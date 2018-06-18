const { Command } = require('klasa')
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'embed',
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

    async run(msg, [...message]) {
        if (msg.guild) {
            msg.delete()
        }
        const embed = new MessageEmbed()
            .setDescription(message.join(' '))
            .setColor([114, 137, 218])
        msg.channel.send({ embed })
    }

    async init() {
        // You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
    }
}