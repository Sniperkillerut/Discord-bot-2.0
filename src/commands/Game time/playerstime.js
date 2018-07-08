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

        if (!message.mentions.users.first()) {
            const timePlayedWeek = this.client.timePlayed(message.author.id, message.guild.configs.defaultGame, '7d')
            const timePlayedDay = this.client.timePlayed(message.author.id, message.guild.configs.defaultGame, 'today')
            const timePlayedAll = this.client.timePlayed(message.author.id, message.guild.configs.defaultGame)

            if (timePlayedAll === 0) {
                return message.reply(`You haven't (according to Discord) ever played ${message.guild.configs.defaultGame} since I measured your playtime!\n*(playtime measured since: \`${fs.readFileSync(`./data/startDates/${message.author.id}.txt`)}\`)*`)
            }
            /*if (timePlayedCustom >= 0) {
              let string = `${this.client.convertSince(since)}, you've played \`${this.client.timeConvert(timePlayedCustom)}\` ${message.guild.configs.defaultGame}!`
              if (sinceWarning == true) {
                string += `\n**Warning**: this information is inaccurate, because I started measuring your playtime later than the time you specified.\n(measuring started ${this.client.MSDays(Math.abs(new Date() - new Date(fs.readFileSync(`./data/startDates/${message.author.id}.txt`))))} days ago)`
              }
              return message.reply(string)
            }*/
            const embed = new MessageEmbed()
                .setAuthor(`${message.author.username}'s ${message.guild.configs.defaultGame} playtime`, message.author.avatarURL)
                .setColor(3447003)
                .setFooter(`"Total" measured from ${fs.readFileSync(`./data/startDates/${message.author.id}.txt`)}`)
                .setThumbnail(this.client.getThumbnail(message.guild.configs.defaultGame))
            if (timePlayedWeek === -2) {
                embed.addField('Last week', 'Your data hasn\'t been logged for a week, so I can\'t show you this information!')
            }
            else {
                embed.addField('Last week', `You've played \`${this.client.timeConvert(timePlayedWeek)}\` ${message.guild.configs.defaultGame} this week`)
            }
            if (timePlayedDay === -2) {
                embed.addField('Today', 'Your data hasn\'t been logged for a day, so I can\'t show you this information!')
            }
            else {
                embed.addField('Today', `You've played \`${this.client.timeConvert(timePlayedDay)}\` ${message.guild.configs.defaultGame} today`)
            }
            embed.addField('Total', `You've played \`${this.client.timeConvert(timePlayedAll)}\` ${message.guild.configs.defaultGame} in total (see footer)`)
            message.channel.send({ embed })
        }
        else {
            if (message.mentions.users.first().bot) {
                return message.reply('Sorry, I don\'t log the playtime of bots!')
            }
            const timePlayedWeek = this.client.timePlayed(message.mentions.users.first().id, message.guild.configs.defaultGame, '7d')
            const timePlayedDay = this.client.timePlayed(message.mentions.users.first().id, message.guild.configs.defaultGame, 'today')
            const timePlayedAll = this.client.timePlayed(message.mentions.users.first().id, message.guild.configs.defaultGame)
            if (timePlayedAll === 0) {
                return message.reply(`${message.mentions.users.first().username} hasn't (according to Discord) ever played ${message.guild.configs.defaultGame} since I measured his playtime!\n*(playtime measured since: \`${fs.readFileSync(`./data/startDates/${message.mentions.users.first().id}.txt`)}\`)*`)
            }
            /*if (timePlayedCustom >= 0) {
              let string = `${this.client.convertSince(since)}, ${mention.username} has played \`${this.client.timeConvert(timePlayedCustom)}\` ${message.guild.configs.defaultGame}!`
              if (sinceWarning === true) {
                string += `\n**Warning**: this information is inaccurate, because I started measuring ${message.mentions.users.first().username}'s playtime later than the time you specified.\n(measuring started ${this.client.MSDays(Math.abs(new Date() - new Date(fs.readFileSync(`./data/startDates/${message.mentions.users.first().id}.txt`))))} days ago)`
              }
              return message.reply(string)
            }*/
            const embed = new MessageEmbed()
                .setAuthor(`${message.mentions.users.first().username}'s ${message.guild.configs.defaultGame} playtime`, message.mentions.users.first().avatarURL)
                .setColor(3447003)
                .setFooter(`"Total" measured from ${fs.readFileSync(`./data/startDates/${message.author.id}.txt`)}`)
                .setThumbnail(this.client.getThumbnail(message.guild.configs.defaultGame))
            if (timePlayedWeek === -2) {
                embed.addField('Last week', `${message.mentions.users.first().username}'s data hasn't been logged for a week, so I can't show you this information!`)
            }
            else {
                embed.addField('Last week', `${message.mentions.users.first().username} has played \`${this.client.timeConvert(timePlayedWeek)}\` ${message.guild.configs.defaultGame} this week`)
            }
            if (timePlayedDay === -2) {
                embed.addField('Today', `${message.mentions.users.first().username}'s' data hasn't been logged for a day, so I can't show you this information!`)
            }
            else {
                embed.addField('Today', `${message.mentions.users.first().username} has played \`${this.client.timeConvert(timePlayedDay)}\` ${message.guild.configs.defaultGame} today`)
            }
            embed.addField('Total', `${message.mentions.users.first().username} has played \`${this.client.timeConvert(timePlayedAll)}\` ${message.guild.configs.defaultGame} in total (see footer)`)
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
