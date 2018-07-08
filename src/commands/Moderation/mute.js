const { Command } = require('klasa')

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'mute',
            enabled: true,
            runIn: ['text'],
            cooldown: 0,
            aliases: [],
            permLevel: 7,
            botPerms: ['MANAGE_ROLES'],
            requiredSettings: [],
            description: '',
            quotedStringSupport: false,
            usage: '[member:member]',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
        })
    }

    async run(msg, [member]) {
        const mutedRole = await msg.guild.configs.mutedRole
        if (!mutedRole) return msg.reply('You do not have a muted role in the guild settings. Please use `$conf set mutedRole` to set the role')
        const hasRole = member.roles.has(mutedRole)
        if (hasRole) {
            member.roles.remove(mutedRole)
        }
        else {
            member.roles.add(mutedRole)
        }
        return msg.reply(`${member} is now ${hasRole ? 'un-muted' : 'muted'}. 😃`)
    }

    async init() {
        // You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
    }
}