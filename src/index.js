const { Client } = require('klasa');
const { config, token_test, GoogleAPI, GoogleCSE } = require('./config');

const fs             = require('fs')
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

class MyKlasaClient extends Client {

    constructor(...args) {
        super(...args);

        // Add any properties to your Klasa Client
    }

    // Add any methods to your Klasa Client

    sinceDate(since) {
        const d   = new Date()
        const num = Number(since.substring(0, since.length - 1))

        if (since.endsWith('m')) {
            d.setMinutes(d.getMinutes() - num)
        }
        if (since.endsWith('h')) {
            d.setHours(d.getHours() - num)
        }
        if (since.endsWith('d')) {
            d.setDate(d.getDate() - num)
        }
        if (since.endsWith('w')) {
            d.setDate(d.getDate() - num * 7)
        }
        if (since === 'today') {
            d.setHours(6)
            d.setMinutes(0)
            d.setSeconds(0)
            d.setMilliseconds(0)
        }
        return d
    }

    timeConvert(n) {
        if (n < 0) {
            return n
        }
        const num      = n
        const hours    = (num / 60)
        const rhours   = Math.floor(hours)
        const minutes  = (hours - rhours) * 60
        const rminutes = Math.round(minutes)
        if (rhours === 0 && minutes === 0) {
            return 'no'
        }
        if (rhours > 0) {
            if (rminutes === 0) {
                if (rhours === 1) {
                    return rhours + ' hour'
                }
                return rhours + ' hours'

            }
            if (rminutes > 1) {
                if (rhours === 1) {
                    return rhours + ' hour and ' + rminutes + ' minutes'
                }
                return rhours + ' hours and ' + rminutes + ' minutes'

            }
            if (rminutes === 1) {
                if (rhours === 1) {
                    return rhours + ' hour en ' + rminutes + ' minutes'
                }
                return rhours + ' hours and ' + rminutes + ' minutes'

            }
        }
        else {
            if (rminutes === 1) {
                return rminutes + ' minute'
            }
            return rminutes + ' minutes'

        }
    }

    ordinalSuffix(i) {
        const j = i % 10,
              k = i % 100
        if (j === 1 && k !== 11) {
            return i + 'st'
        }
        if (j === 2 && k !== 12) {
            return i + 'nd'
        }
        if (j === 3 && k !== 13) {
            return i + 'rd'
        }
        return i + 'th'
    }

    convertSince(since) {
        const num = Number(since.substring(0, since.length - 1))
        let suffix
        let prefix

        if (since.endsWith('m')) {
            suffix = 'minute'
            prefix = 'In'
        }
        if (since.endsWith('h')) {
            suffix = 'hour'
            prefix = 'In'
        }
        if (since.endsWith('d')) {
            suffix = 'day'
            prefix = 'In'
        }
        if (since.endsWith('w')) {
            suffix = 'week'
            prefix = 'In'
        }
        if (since === 'today') {
            return 'Today'
        }
        if (num > 1) {
            suffix += 's'
        }
        return `${prefix} the last ${num} ${suffix}`
    }

    MSDays(t) {
        const cd  = 24 * 60 * 60 * 1000
        const ch  = 60 * 60 * 1000
        let   d   = Math.floor(t / cd)
        let   h   = Math.floor((t - d * cd) / ch)
        let   m   = Math.round((t - d * cd - h * ch) / 60000)
        const pad = function (n) { return n < 10 ? '0' + n : n }
        if (m === 60) {
            h++
            m = 0
        }
        if (h === 24) {
            d++
            h = 0
        }
        return d
    }

    // Functions about playtime

    timePlayed(id, game, since, overwriteFilter) {
        if (this.privateCheck(id) === true) {
            return -1
        }
        if (fs.existsSync(`./data/userdata/${id}.csv`)) {
            let userObject = []
            let logStart
            if (fs.existsSync(`./data/startDates/${id}.txt`)) {
                logStart = new Date(fs.readFileSync(`./data/startDates/${id}.txt`))
            }
            else {
                fs.appendFileSync(`./data/startDates/${id}.txt`, new Date())
                logStart = new Date()
            }
            // Push all the data to an array of objects
            fs.readFileSync(`./data/userdata/${id}.csv`).toString().split('\n').forEach(function (value) {
                userObject.push({ date: value.split(' gamePlaying: ')[0], game: value.split(' gamePlaying: ')[1] })
            })
            // If a game is specified, filter the userObject's correct game out of the array
            if (game) {
                userObject = userObject.filter(function (currentValue) {
                    if ((currentValue.game) && (game)) {
                        return currentValue.game.toLowerCase() === game.toLowerCase()
                    }
                })
            }
            // Filter the correct time out of the array
            if (since !== undefined && since.length > 0) {
                let since2     = this.sinceDate(since)
                    userObject = userObject.filter(function (value) {
                    return new Date(value.date) > since2
                })
            }
            // Return the length of the array (minutes of playtime)
            return userObject.length
        }
        return 0
    }

    privateCheck(id) {
        if (fs.existsSync(`./data/privateUsers/${id}.csv`)) {
            return true
        }
        return false
    }

    convertPresence(user, type) {
        let userStatus
        let embedColor
        const onlineEmoji = this.emojis.find( emoji => emoji.name === 'online')
        const idleEmoji   = this.emojis.find(emoji => emoji.name === 'idle')
        if (user.presence.status === 'dnd') {
            userStatus = 'do not disturb :no_entry:'
            embedColor = '#db2525'
        }
        if (user.presence.status === 'offline') {
            userStatus = 'offline/invisible'
            embedColor = '#8c8c8c'
        }
        if (user.presence.status === 'idle') {
            userStatus = `idle ${idleEmoji}`
            embedColor = '#e29b16'
        }
        if (user.presence.status === 'online') {
            userStatus = `online ${onlineEmoji}`
            embedColor = '0x00AE86'
        }
        if (type === 'game') {
            return userStatus
        }
        if (type === 'color' || type === 'colour') {
            return embedColor
        }
    }

    checkUsers(users) {
        let usersPositive = 0
        function fileUsers(user, id) {
            if (user.bot) {
                return
            }
            const user_game = user.presence.game || user.presence.activity
            if (!user_game) {
                if (fs.existsSync(`./data/startDates/${id}.txt`) === false) {
                    return fs.appendFileSync(`./data/startDates/${id}.txt`, new Date())
                }
            }
            else {
                usersPositive += 1
                fs.appendFileSync(`./data/userdata/${id}.csv`, `${Date()} gamePlaying: ${user_game.name}\n`)
            }
        }
        users.forEach(fileUsers)
        console.log(`${Date()}: ${users.size} users checked, ${usersPositive} playing a game`)
    }

    // Leaderboard functions
    getTopList(since, guildID, newBoolean) {
        // First check if the leaderboard is cached, if so it will return the cached leaderboard for faster replies
        if (fs.existsSync(`./data/cache/${guildID}/weekly.json`) && newBoolean !== true && since === '7d') {
            return JSON.parse(fs.readFileSync(`./data/cache/${guildID}/weekly.json`))
        }
        if (fs.existsSync(`./data/cache/${guildID}/daily.json`) && newBoolean !== true && since === 'today') {
            return JSON.parse(fs.readFileSync(`./data/cache/${guildID}/daily.json`))
        }
        if (fs.existsSync(`./data/cache/${guildID}/always.json`) && newBoolean !== true && since === undefined) {
            return JSON.parse(fs.readFileSync(`./data/cache/${guildID}/always.json`))
        }
        const guild = this.guilds.find(guild => guild.id === guildID)
        function topUsers(user, id) {
            if (user.bot) { return }
            if (fs.existsSync(`./data/userdata/${id}.csv`) === true && guild.client.privateCheck(id) === false) {
                return { id: id, minutes: user.client.timePlayed(id, guild.configs.defaultGame, since) }
            }

            return undefined

        }
        let topList = guild.members.map(topUsers)
            topList = topList.filter(value => value !== undefined)
        return topList.sort(function (a, b) { return (b.minutes > a.minutes) ? 1 : ((a.minutes > b.minutes) ? -1 : 0) })
    }

    getLeaderboardString(guild, guildConf) {
        function leaderboardString(sinceString, since) {
            let string = `**----------------- ${sinceString} -----------------**\n`
            let topList
            let emptyString
            let noMoreString
            if (since === '7d') {
                            topList      = topListWeek
                            emptyString  = `No one played ${guildConf.defaultGame} this week!`
                            noMoreString = `No more users played ${guildConf.defaultGame} this week!`
                      const d            = new Date()
                d.setDate(d.getDate() - 7)
                if (guild.joinedAt > d) {
                    return `${string}I joined this server less than a week ago, so this leaderboard would be the same as the "Always" leaderboard. Go check out that one!`
                }
            }
            if (since === 'today') {
                            topList      = topListDay
                            emptyString  = `No one played ${guildConf.defaultGame} today!`
                            noMoreString = `No more users played ${guildConf.defaultGame} today!`
                      const vanochtend   = new Date()
                vanochtend.setHours(6)
                vanochtend.setMinutes(0)
                vanochtend.setSeconds(0)
                vanochtend.setMilliseconds(0)
                if (guild.joinedAt > vanochtend) {
                    return `${string}I joined this server today, so this leaderboard would be the same as the "Always" leaderboard. Go check out that one!`
                }
            }
            if (since === undefined || since === '') {
                noMoreString = `No more users have ever played ${guildConf.defaultGame}!`
                emptyString  = `No one has ever played ${guildConf.defaultGame}!`
                topList      = topListAll
            }
            const l      = guildConf.leaderboardAmount
            let   amount = 0
            let i
            for (i = 0; i < l; i++) {
                if (topList === undefined) {
                    break
                }
                if (topList[i] === undefined) {
                    break
                }
                if (topList[i].minutes === 0) {
                    break
                }
                if (i === 0) {
                    if (guild.client.timePlayed(topList[i].id, guildConf.defaultGame, since, true) > 0) {
                        if (guildConf.enableRankingMentions === 'true') {
                            string += `1. <@${guild.members.find(member => member.id === topList[i].id).user.id}> 👑 *- ${guild.client.timeConvert(guild.client.timePlayed(topList[i].id, guildConf.defaultGame, since, true))}*\n`
                            amount++
                        }
                        else {
                            string += `1. **${guild.members.find(member => member.id === topList[i].id).user.tag}** 👑 *- ${guild.client.timeConvert(guild.client.timePlayed(topList[i].id, guildConf.defaultGame, since, true))}*\n`
                            amount++
                        }
                    }
                }
                else if (guild.client.timePlayed(topList[i].id, guildConf.defaultGame, since, true) > 0) {
                    if (guildConf.enableRankingMentions === 'true') {
                        string += `${i + 1}. <@${guild.members.find(member => member.id === topList[i].id).user.id}> *- ${guild.client.timeConvert(guild.client.timePlayed(topList[i].id, guildConf.defaultGame, since, true))}*\n`
                        amount++
                    }
                    else {
                        string += `${i + 1}. **${guild.members.find(member => member.id === topList[i].id).user.tag}** *- ${guild.client.timeConvert(guild.client.timePlayed(topList[i].id, guildConf.defaultGame, since, true))}*\n`
                        amount++
                    }
                }
            }
            if (amount < guildConf.leaderboardAmount) {
                if (amount === 0) {
                    string += emptyString
                }
                else {
                    string += noMoreString
                }
            }
            return string
        }
        const topListWeek = this.getTopList('7d', guild.id, true)
        const topListDay  = this.getTopList('today', guild.id, true)
        const topListAll  = this.getTopList('', guild.id, true)
        if (!fs.existsSync(`./data/cache/${guild.id}`)) {
            fs.mkdirSync(`./data/cache/${guild.id}`)
        }
        fs.writeFileSync(`./data/cache/${guild.id}/weekly.json`, JSON.stringify(topListWeek))
        fs.writeFileSync(`./data/cache/${guild.id}/daily.json`, JSON.stringify(topListDay))
        fs.writeFileSync(`./data/cache/${guild.id}/always.json`, JSON.stringify(topListAll))
        fs.writeFileSync(`./data/cache/${guild.id}/date.txt`, Date())
        return `*${guild.name}'s* \`${guild.configs.defaultGame}\` leaderboard:\n${leaderboardString('WEEKLY', '7d')}\n${leaderboardString('DAILY', 'today')}\n${leaderboardString('ALL')}\n**------------------------------------------------**\nLast updated at: \`${Date().toString()}\`\nJoined guild at: \`${guild.joinedAt}\``
    }

    updateRankingChannel(guilds) {
        guilds.forEach(function (guild) {
            if (!guild.configs.rankingChannel) {
                return
            }
            const rankingChannelID = guild.configs.rankingChannel.replace('<#', '').replace('>', '')
            const rankingChannel   = guild.channels.find(channel => channel.id === rankingChannelID)
            if (rankingChannel) {
                // Permission check
                const botMember = guild.members.find(member => member.id === guild.me.id)
                if (botMember.permissionsIn(rankingChannel).has('VIEW_CHANNEL') === false) {
                    return console.log(`No permissions to read messages in ranking channel, aborting (server: ${guild.name})`)
                }
                if (botMember.permissionsIn(rankingChannel).has('SEND_MESSAGES') === false) {
                    return console.log(`No permissions to send messages in ranking channel, aborting (server: ${guild.name})`)
                }
                if (botMember.permissionsIn(rankingChannel).has('MANAGE_MESSAGES') === false) {
                    return console.log(`No permissions to manage messages in ranking channel, aborting (server: ${guild.name})`)
                }
                guild.client.fetchBotMessages(20, rankingChannel)
                    .then((message) => {
                        if (message === undefined) {
                            guild.client.purge(50, rankingChannel).catch(err => { console.log('Error purging rankingChannel!\n' + err) })
                            console.log(`${Date()}: Calculating ${guild.name} leaderboard...`)
                            rankingChannel.send(guild.client.getLeaderboardString(guild, guild.configs))
                            console.log(`${Date()}: ${guild.name}: Leaderboard sent!`)
                        }
                        else {
                            console.log(`${Date()}: Calculating ${guild.name} leaderboard...`)
                            message.edit(guild.client.getLeaderboardString(guild, message.guild.configs))
                            guild.client.purge(50, rankingChannel).catch(err => { console.log('Error purging rankingChannel!\n' + err) })
                            console.log(`${Date()}: ${guild.name}: Leaderboard updated!`)
                        }
                    })
                    .catch((err) => {
                        console.log('Error calculating leaderboard: \n' + err)
                    })
            }
        })
    }

    async fetchBotMessages(limit, channel) {
        const fetched = await channel.messages
        if (fetched.first()) {
            const botFetched = fetched.filter(currentMSG => currentMSG.author.id === this.user.id)
            if (botFetched.first()) {
                return botFetched.first()
            }
            return undefined
        }
        return undefined
    }

    async purge(purgeLimit, channel) {
        const filter  = currentMSG => currentMSG.author.id !== this.user.id
              fetched = await channel.awaitMessages(filter, { max: 4, time: 6000, errors: ['time'] })
            .then(collected => {
               console.log(collected.size)
                channel.bulkDelete(collected)
            })
        if (fetched.first()) {
            // Filteren
            fetched = fetched.filter(currentMSG => currentMSG.author.id !== user.id)
            channel.bulkDelete(fetched)
        }
    }

    getThumbnail(game) {
        let searchQuery = game.replace(/ /g, '+') + '+logo'
        let thumbnailURL
        searchQuery = searchQuery.toLowerCase()
        if (fs.existsSync(`./data/thumbnails/${searchQuery}.csv`)) {
            return fs.readFileSync(`./data/thumbnails/${searchQuery}.csv`).toString()
        }
        const xmlHttp = new XMLHttpRequest()
        xmlHttp.open('GET', `https://www.googleapis.com/customsearch/v1?q=${searchQuery}&cx=${GoogleCSE}&filter=0&imgSize=icon&num=1&key=${GoogleAPI}`, false)
        xmlHttp.send(null)
        const searchThumbnail = xmlHttp.responseText
        const searchObject    = JSON.parse(searchThumbnail)
        console.log(`${Date()}: New search result for: ${searchQuery}, filed it.`)
        if (searchObject) {
            if (searchObject.items) {
                if (searchObject.items[0]) {
                    if (searchObject.items[0].pagemap) {
                        if (searchObject.items[0].pagemap.cse_image) {
                            thumbnailURL = searchObject.items[0].pagemap.cse_image[0].src
                        }
                    }
                }
            }
        }
        fs.appendFileSync(`./data/thumbnails/${searchQuery}.csv`, thumbnailURL)
        return thumbnailURL
    }

    // Local function to check if an argument is a time specified, e.a. 3w, 5m, 7h
    checkTimeFormat(string) {
        if (string === 'today') {
            return true
        }
        if (string.length > 3 && Number(string.substring(0, string.length - 1)) > 0) {
            if (string.endsWith('m') || string.endsWith('h') || string.endsWith('d') || string.endsWith('w')) {
                return -1
            }
        }
        if (string.endsWith('m') || string.endsWith('h') || string.endsWith('d') || string.endsWith('w')) {
            if (Number(string.substring(0, string.length - 1)) > 0) {
                return true
            }
        }
        return false
    }

}

new MyKlasaClient(config).login(token_test);

Array.prototype.clean = function (deleteValue) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === deleteValue) {
            this.splice(i, 1)
            i--
        }
    }
    return this
}