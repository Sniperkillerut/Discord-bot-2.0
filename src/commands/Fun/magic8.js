
const { Command } = require('klasa')

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'magic8',
            enabled: true,
            runIn: ['text', 'dm', 'group'],
            cooldown: 0,
            aliases: ['8', 'magic', '8ball', 'mirror'],
            permLevel: 0,
            botPerms: [],
            requiredSettings: [],
            description: 'Magic 8-Ball, does exactly what the toy does. (Results may vary)',
            quotedStringSupport: false,
            usage: '',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
        })
    }

    async run(msg) {
        return msg.reply(msg.content.endsWith('?')
            ? `🎱 ${answers[Math.floor(Math.random() * answers.length)]}`
            : "🎱 That doesn't look like a question, try again please.")
    }

    async init() {
        // You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
    }
}
const answers = ['Maybe.',
    'Certainly not.',
    'I hope so.',
    'Not in your wildest dreams.',
    'There is a good chance.',
    'Quite likely.',
    'I think so.',
    'I hope not.',
    'I hope so.',
    'Never!',
    'Fuhgeddaboudit.',
    'Ahaha! Really?!?',
    'Pfft.',
    'Sorry, bucko.',
    'Hell, yes.',
    'Hell to the no.',
    'The future is bleak.',
    'The future is uncertain.',
    'I would rather not say.',
    'Who cares?',
    'Possibly.',
    'Never, ever, ever.',
    'There is a small chance.',
    'Yes!']