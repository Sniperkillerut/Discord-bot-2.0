const { Command } = require('klasa')

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'nickname',
            enabled: true,
            runIn: ['text'],
            cooldown: 0,
            aliases: ['nick'],
            permLevel: 7,
            botPerms: ['CHANGE_NICKNAME', 'MANAGE_NICKNAMES'],
            requiredSettings: [],
            description: 'Change nickname of a user',
            quotedStringSupport: false,
            usage: '<member:member> <name:str> [...]',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        })
    }

    async run(msg, [member, ...name]) {
        const fullNick = name.join(' ')
        // checks the nickname size for the discord requirement if so replies and then exits
        if (fullNick.length > 32 || fullNick.length === 0) return msg.reply('Sorry the nickname was too long or too short.')
        // set the nickname
        await member.setNickname(fullNick)
        // send a message in regards to what changed in an embed.
        return msg.reply(`Nickname has been changed to ${fullNick} for ${member} 😃`)
    }

    async init() {
        // You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
    }
}