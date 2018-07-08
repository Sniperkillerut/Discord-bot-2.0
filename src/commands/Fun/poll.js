const { Command } = require('klasa')

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'poll',
            enabled: true,
            runIn: ['text', 'group'],
            cooldown: 0,
            aliases: [],
            permLevel: 0,
            botPerms: [],
            requiredSettings: [],
            description: 'Make the Bot say things',
            quotedStringSupport: false,
            usage: '',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        })
    }

    async run(msg) {
        await msg.react('👍')
        await msg.react('👎')
        return msg.react('🤷')
    }

    async init() {
        // You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
    }
}