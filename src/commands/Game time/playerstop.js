const { Command } = require('klasa');
const { MessageEmbed }  = require('discord.js');
const fs = require('fs')

module.exports = class extends Command {

    constructor(...args) {
        /**
         * Any default options can be omitted completely.
         * if all options are default, you can omit the constructor completely
         */
        super(...args, {
            enabled: true,
            runIn: ['text'],
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
            description: 'Player status.',
            extendedHelp: 'No extended help available.',
            usage: '[user:mention]',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false
        });
    }

    async run(message, [...params]) {
        let user
        let string
        let since
        let sinceWarning = false
        if (message.mentions.users.first()) {
            if (message.mentions.users.first().bot) {
                return message.reply('Sorry, I don\'t log the playtime of bots!')
            }
            if (fs.existsSync(`./data/userdata/${message.mentions.users.first().id}.csv`) === false) {
                return message.reply(`*${message.mentions.users.first().username}* hasn't (according to Discord) ever played a game since I measured your playtime!\n*(playtime measured since: \`${fs.readFileSync(`./data/startDates/${message.mentions.users.first().id}.txt`)}\`)*`)
            }
            user = message.mentions.users.first()
            if (params[1]) {
                since = params[1]
            }
            if (since) {
                string = `\n${this.client.convertSince(since)}, **${message.mentions.users.first().username}'s most played games are:**\n`
            }
            else {
                string = `\n**${message.mentions.users.first().username}'s most played games are:**\n`
            }
            if (since && this.client.sinceDate(since) < new Date(fs.readFileSync(`./data/startDates/${message.mentions.users.first().id}.txt`))) {
                sinceWarning = true
            }
        }
        else {
            if (fs.existsSync(`./data/userdata/${message.author.id}.csv`) === false) {
                return message.reply(`You haven't (according to Discord) ever played a game since I measured your playtime!\n*(playtime measured since: \`${fs.readFileSync(`./data/startDates/${message.author.id}.txt`)}\`)*`)
            }
            user = message.author
            if (params[0]) {
                since = params[0]
            }
            if (since) {
                string = `\n**${this.client.convertSince(since)}, your most played games are:**\n`
            }
            else {
                string = '\n**Your most played games are:**\n'
            }
            if (since && this.client.sinceDate(since) < new Date(fs.readFileSync(`./data/startDates/${message.author.id}.txt`))) {
                sinceWarning = true
            }
        }

        // Get an array of objects of the games the user was playing
        const games = []
        function pushObject(value) {
            let found = false
            const game = value.split(' gamePlaying: ')[1]
            const date = value.split(' gamePlaying: ')[0]
            if (game === undefined) {
                return
            }
            if (since && this.client.sinceDate(since) > new Date(date)) {
                return
            }
            for (let i = 0; i < games.length; i++) {
                if (games[i].game === game) {
                    found = true
                    games[i].time += 1
                    break
                }
            }
            if (found === false) {
                games.push({ game: game, time: 1 })
            }
        }
        fs.readFileSync(`./data/userdata/${user.id}.csv`).toString().split('\n').forEach(pushObject)
        // Sort the list by playtime
        games.sort(function (a, b) { return b.time - a.time })
        // Make a string of it
        for (let i = 0; i < 10; i++) {
            if (i === 0 && games[i] === undefined) {
                string += '**You haven\'t played any game in that time period!**'
                break
            }
            if (games[i]) {
                string += `**${i + 1}. ${games[i].game}**: *${this.client.timeConvert(games[i].time)}*\n`
            }
        }

        if (sinceWarning === true) {
            if (message.mentions.users.first()) {
                string += `\n**Warning**: this information is inaccurate, because I started measuring ${message.mentions.users.first().username}'s playtime later than the time you specified.\n(measuring started ${this.client.MSDays(Math.abs(new Date() - new Date(fs.readFileSync(`./data/startDates/${message.mentions.users.first().id}.txt`))))} days ago)`
            }
            else {
                string += `\n**Warning**: this information is inaccurate, because I started measuring your playtime later than the time you specified.\n(measuring started ${this.client.MSDays(Math.abs(new Date() - new Date(fs.readFileSync(`./data/startDates/${message.author.id}.txt`))))} days ago)`
            }
        }
        return message.reply(string)
    }

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
    }

};
