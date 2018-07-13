const { Command } = require('klasa')

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'kick',
            enabled: true,
            runIn: ['text'],
            cooldown: 0,
            aliases: [],
            permLevel: 7,
            botPerms: ['KICK_MEMBERS'],
            requiredSettings: [],
            description: 'Kicks a user from the server',
            quotedStringSupport: false,
            usage: '<member:member> [reason:string] [...]',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        })
    }

    async run(msg, [member, ...reason]) {
        //if (!reason) return msg.reply('You did not provide a reason. Please try again.')
        if (member.id === msg.author.id) return msg.reply('Why would you kick yourself?')
        if (member.id === this.client.user.id) return msg.reply('Have I done something wrong?')
        if (member.roles.highest.position >= msg.member.roles.highest.position) return msg.reply('You cannot kick this user.')
        if (member.kickable === false) return msg.reply('I cannot kick this user.')

        reason = reason.length > 0 ? reason.join(' ') : null
        await member.kick(reason)
        return msg.sendMessage(`${member.user.tag} got kicked.${reason ? ` With reason of: ${reason}` : ''}`)
    }

    async init() {
        // You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
    }
}