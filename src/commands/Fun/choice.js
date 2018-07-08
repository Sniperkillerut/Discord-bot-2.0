const { Command } = require('klasa')

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'choice',
            enabled: true,
            runIn: ['text', 'dm', 'group'],
            cooldown: 0,
            aliases: ['choose', 'decide'],
            permLevel: 0,
            botPerms: [],
            requiredSettings: [],
            description: 'Makes a decision for you given some choices.',
            quotedStringSupport: true,
            usage: '<choices:str> [...]',
            usageDelim: ' ',
            extendedHelp: 'If you need a space inside choice use quotes: `$choice "Skillz 4 Killz" Skillz4Killz`'
        })
    }

    async run(msg, [...choices]) {
        const validChoices = choices.filter(x => x)
        return msg.reply(validChoices.length === 1 ? 'You only gave me one choice, dummy.' : `I think you should go with "${choices[Math.floor(Math.random() * choices.length)]}"`)
    }

    async init() {
        // You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
    }
}