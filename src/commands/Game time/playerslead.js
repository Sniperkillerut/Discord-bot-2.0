const { Command } = require('klasa');
const fs = require('fs')

module.exports = class extends Command {

    constructor(...args) {
        /**
         * Any default options can be omitted completely.
         * if all options are default, you can omit the constructor completely
         */
        super(...args, {
            enabled: true,
            runIn: ['text', 'dm', 'group'],
            requiredPermissions: [],
            requiredSettings: [],
            aliases: [],
            autoAliases: true,
            bucket: 1,
            cooldown: 0,
            promptLimit: 0,
            promptTime: 30000,
            deletable: false,
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            description: 'Player Personal leaderboard.',
            extendedHelp: 'No extended help available.',
            usage: '',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false
        });
    }

    async run(message, [...params]) {

        if (!message.mentions.users.first()) {
            const timePlayedWeek = this.client.timePlayed(message.author.id, message.guild.configs.defaultGame, '7d')
            const timePlayedDay = this.client.timePlayed(message.author.id, message.guild.configs.defaultGame, 'today')
            const timePlayedAll = this.client.timePlayed(message.author.id, message.guild.configs.defaultGame)
            if (params[0]) {
                return message.reply(`Please mention someone to view their personal leaderboard\n*e.a.: ${message.guild.configs.prefix}playersTop @xVaql*`)
            }
            if (timePlayedAll === 0) {
                return message.reply(`You haven't (according to Discord) ever played ${message.guild.configs.defaultGame} since I measured your playtime, so there's nothing to show you!\n*(playtime measured since: \`${fs.readFileSync(`./data/startDates/${message.author.id}.txt`)}\`)*`)
            }
            const placeWeek = this.client.getTopList('7d', message.guild.id).map(topListWeek => topListWeek.id).indexOf(message.author.id) + 1
            const placeDay = this.client.getTopList('today', message.guild.id).map(topListDay => topListDay.id).indexOf(message.author.id) + 1
            const placeAll = this.client.getTopList('', message.guild.id).map(topListAll => topListAll.id).indexOf(message.author.id) + 1
            const embed = new Discord.RichEmbed()
                .setAuthor('Your personal leaderboard', message.author.avatarURL)
                .setColor(0x00AE86)
                .setFooter(`Leaderboard updated at: ${fs.readFileSync(`./data/cache/${message.guild.id}/date.txt`)}`)
                .setThumbnail(this.client.getThumbnail(message.guild.configs.defaultGame))
            if (message.guild.configs.rankingChannel !== 'none') {
                embed.setDescription(`Check the top ${message.guild.configs.leaderboardAmount} users in the ${message.guild.configs.rankingChannel} channel`)
            }
            if (this.client.timePlayed(message.author.id, message.guild.configs.defaultGame, '7d') === 0) {
                embed.addField('Weekly', `You haven't played ${message.guild.configs.defaultGame} this week!`)
            }
            else {
                embed.addField('Weekly', `In the week list you are ranked: **${this.client.ordinalSuffix(placeWeek)}** *(${this.client.timeConvert(timePlayedWeek)})*`)
            }
            if (this.client.timePlayed(message.author.id, message.guild.configs.defaultGame, 'today') === 0) {
                embed.addField('Daily', `You haven't played ${message.guild.configs.defaultGame} today!`)
            }
            else {
                embed.addField('Daily', `In the day list you are ranked: **${this.client.ordinalSuffix(placeDay)}** *(${this.client.timeConvert(timePlayedDay)})*`)
            }
            embed.addField('Total', `In the total list you are ranked: **${this.client.ordinalSuffix(placeAll)}** *(${this.client.timeConvert(timePlayedAll)})*`)
            message.channel.send({ embed })
        }
        else {
            if (message.mentions.users.first().bot) {
                return message.reply('Sorry, I don\'t log the playtime of bots!')
            }
            if (this.client.timePlayed(message.mentions.users.first().id, message.guild.configs.defaultGame) === 0) {
                return message.reply(`${message.mentions.users.first().username} hasn't (according to Discord) ever played ${message.guild.configs.defaultGame} since I measured his playtime!\n*(playtime measured since: \`${fs.readFileSync(`./data/startDates/${message.mentions.users.first().id}.txt`)}\`)*`)
            }

            const timePlayedWeek = this.client.timePlayed(message.mentions.users.first().id, message.guild.configs.defaultGame, '7d')
            const timePlayedDay = this.client.timePlayed(message.mentions.users.first().id, message.guild.configs.defaultGame, 'today')
            const timePlayedAll = this.client.timePlayed(message.mentions.users.first().id, message.guild.configs.defaultGame)

            const placeWeek = this.client.getTopList('7d', message.guild.id).map(topListWeek => topListWeek.id).indexOf(message.mentions.users.first().id) + 1
            const placeDay = this.client.getTopList('today', message.guild.id).map(topListDay => topListDay.id).indexOf(message.mentions.users.first().id) + 1
            const placeAll = this.client.getTopList('', message.guild.id).map(topListAll => topListAll.id).indexOf(message.mentions.users.first().id) + 1
            const embed = new Discord.RichEmbed()
                .setAuthor(`${message.mentions.users.first().username}'s personal leaderboard`, message.mentions.users.first().avatarURL)
                .setColor(0x00AE86)
                .setFooter(`Leaderboard updated at: ${fs.readFileSync(`./data/cache/${message.guild.id}/date.txt`)}`)
                .setThumbnail(this.client.getThumbnail(message.guild.configs.defaultGame))
            if (message.guild.configs.rankingChannel !== 'none') {
                embed.setDescription(`Check the top ${message.guild.configs.leaderboardAmount} users in the ${message.guild.configs.rankingChannel} channel`)
            }
            if (this.client.timePlayed(message.mentions.users.first().id, message.guild.configs.defaultGame, '7d') === 0) {
                embed.addField('Weekly', `${message.mentions.users.first().username} hasn't played ${message.guild.configs.defaultGame} this week!`)
            }
            else {
                embed.addField('Weekly', `In the week list ${message.mentions.users.first().username} is ranked: **${this.client.ordinalSuffix(placeWeek)}** *(${this.client.timeConvert(timePlayedWeek)})*`)
            }
            if (this.client.timePlayed(message.mentions.users.first().id, message.guild.configs.defaultGame, 'today') === 0) {
                embed.addField('Daily', `${message.mentions.users.first().username} hasn't played ${message.guild.configs.defaultGame} today!`)
            }
            else {
                embed.addField('Daily', `In the day list ${message.mentions.users.first().username} is ranked: **${this.client.ordinalSuffix(placeDay)}** *(${this.client.timeConvert(timePlayedDay)})*`)
            }
            embed.addField('Total', `In the total list ${message.mentions.users.first().username} is ranked: **${this.client.ordinalSuffix(placeAll)}** *(${this.client.timeConvert(timePlayedAll)})*`)
            message.channel.send({ embed })
        }
    }

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
    }

};
