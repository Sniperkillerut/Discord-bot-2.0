const { Command } = require('klasa');

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
            description: 'Players currently playing Guild\'s default Game.',
            extendedHelp: 'No extended help available.',
            usage: '',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false
        });
    }

    async run(message, [...params]) {

        if (!message.guild.configs.defaultGame) {
            message.channel.send('This Guild has no Default Game, please set it in the configs')
            return
        }

        const userArray = []
        let stringCount = 0
        let realCount = 0
        let string = ''
        let morePeople = false

        message.guild.members.forEach(function (user, id) {
            if (user.user.bot) {
                return
            }
            if (!user.presence.activity) {
                return
            }
            if (stringCount >= 20) {
                if (user.presence.activity.name.toLowerCase() === message.guild.configs.defaultGame.toLowerCase()) {
                    realCount++
                }
                morePeople = true
                return
            }
            if (user.presence.activity.name.toLowerCase() === message.guild.configs.defaultGame.toLowerCase()) {
                string += `- ${user.user.tag}\n`
                realCount++
                stringCount++

            }
        })

        if (stringCount === 0) {
            string = `Nobody is playing ${message.guild.configs.defaultGame}, you'll have to play with yourself :rolling_eyes:\n` + string
        }
        if (stringCount === 1) {
            string = `**${stringCount} person is playing ${message.guild.configs.defaultGame}:**\n` + string
        }
        if (stringCount > 1) {
            string = `**${stringCount} people are playing ${message.guild.configs.defaultGame}:**\n` + string
        }
        if (morePeople === true) {
            string += `**And ${realCount - stringCount} more people, but I can't send a longer message!**`
        }
        message.channel.send(string)
    }

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
    }

};
