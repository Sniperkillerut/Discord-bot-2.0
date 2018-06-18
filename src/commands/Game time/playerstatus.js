const { Command } = require('klasa');
const { MessageEmbed }  = require('discord.js');

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
            if (params[0]) {
                return message.reply('Please mention someone to view their status')
            }
            let gameOfNiet
            const game_new = message.author.presence.game || message.author.presence.activity
            if (!game_new) {
                gameOfNiet = 'According to Discord you aren\'t playing a game.'
            }
            else {
                gameOfNiet = `You're currently playing: **${game_new.name}**`
            }
            const userStatus = this.client.convertPresence(message.author, 'game')
            const embedColor = this.client.convertPresence(message.author, 'color')
            const embed = new MessageEmbed()
                .setAuthor(`${message.author.username}'s status`, this.client.user.avatarURL)
                .setColor(embedColor)
                .setThumbnail(message.author.avatarURL)
                .addField('Presence', `Your Discord profile status is set to: **${userStatus}**`)
                .addField('Game', `${gameOfNiet}`)
            message.channel.send({ embed })
        }
        else if (message.mentions.users.first() === message.author) {
            message.reply(`Please use \`${message.guild.configs.prefix}status\` without a mention to view your own status.`)
        }
        else {
            let gameOfNiet
            const game_new = message.mentions.users.first().presence.game || message.mentions.users.first().presence.activity
            if (!game_new) {
                gameOfNiet = `According to Discord *${message.mentions.users.first().username}* isn't playing a game.`
            }
            else {
                gameOfNiet = `*${message.mentions.users.first().username}* is currently playing: **${game_new.name}**`
            }
            const userStatus = this.client.convertPresence(message.mentions.users.first(), 'game')
            const embedColor = this.client.convertPresence(message.mentions.users.first(), 'color')

            const embed = new MessageEmbed()
                .setAuthor(`${message.mentions.users.first().username}'s status`, this.client.user.avatarURL)
                .setColor(embedColor)
                .setThumbnail(message.mentions.users.first().avatarURL)
                .addField('Presence', `${message.mentions.users.first().username}'s profile status is set to: **${userStatus}**`)
                .addField('Game', `${gameOfNiet}`)
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
