const { Command } = require('klasa')

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'say',
            enabled: true,
            runIn: ['text', 'group'],
            cooldown: 0,
            aliases: [],
            permLevel: 0,
            botPerms: ['MANAGE_MESSAGES'],
            requiredSettings: [],
            description: 'Make the Bot say things',
            quotedStringSupport: false,
            usage: '[channel:channel] <message:string> [...]',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        })
    }

    async run(msg, [channel = msg.channel, ...message]) {
        if (channel.postable === false && channel !== msg.channel) throw 'The selected channel is not postable.';
        if (msg.deletable) msg.delete()
        if (!message) return msg.reply(`You need to give the bot a message to send! Ex: CheezDoodles🧀`)
        return channel.send(message.join(' '))
    }

    async init() {
        // You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
    }
}