const { Command, Timestamp } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'server',
            enabled: true,
            runIn: ['text', 'dm', 'group'],
            cooldown: 0,
            aliases: [],
            permLevel: 0,
            botPerms: ['EMBED_LINKS'],
            requiredSettings: [],
            description: 'Gives information about the server that the command is typed in.',
            quotedStringSupport: false,
            usage: '',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
        })
    }

    async run(msg) {
        const guild = msg.guild
        const server = {
            name: guild.name,
            id: guild.id,
            image: guild.iconURL(),
            createdAt: guild.createdAt,
            botJoin: guild.joinedAt,
            region: guild.region.toUpperCase(),
            owner: `${guild.owner.displayName}#${guild.owner.user.discriminator}`,
            filter: guild.explicitContentFilter,
            roles: guild.roles.array().length,
            members: guild.memberCount,
            // Amount of bots on the server
            bots: guild.members.filter((member) => { return member.user.bot }).array().length,
            // # of users + bots that sent message since client was last turned on
            activity: guild.members.filter((member) => {
                if (member.lastMessage) {
                    return member.lastMessage.createdTimestamp
                }
            }).array(),
            // # of users + bots that sent message since client turned on
            daily: guild.members.filter((member) => {
                // for every member check if they have a lastMessage
                if (member.lastMessage) {
                    // if the time from NOW - time of last message is under 24 hours add it to array
                    if (new Date() - member.lastMessage.createdTimestamp < 86400000) {
                        return member.lastMessage.createdTimestamp
                    }
                }
            }).array(),
            // # per week # of users + bots
            weekly: guild.members.filter((member) => {
                if (member.lastMessage) {
                    if (new Date() - member.lastMessage.createdTimestamp < (86400000 * 7) && new Date() - member.lastMessage.createdTimestamp > 86400000) {
                        return member.lastMessage.createdTimestamp
                    }
                }
            }).array(),
            // # per montth of users + bots
            monthly: guild.members.filter((member) => {
                if (member.lastMessage) {
                    if (new Date() - member.lastMessage.createdTimestamp < (86400000 * 30) && new Date() - member.lastMessage.createdTimestamp > (86400000 * 7)) {
                        return member.lastMessage.createdTimestamp
                    }
                }
            }).array(),
            online: guild.presences.array().length,
            channels: guild.channels.array().length,
            // # of text channels
            text: guild.channels.filter((channel) => {
                if (channel.type === 'text') {
                    return channel
                }
            }).array().length,
            emojis: guild.emojis.array().length,
            // All emojis with their unicode like <>
            allEmojis: guild.emojis.filter((emoji) => {
                const id = `<:${emoji.identifier}>`
                return id
                // Remove all , in the array and just show all emojis
            }).array().toString().replace(/,/g, '')
        }
        this.verificationLevels = [
            'None',
            'Low',
            'Medium',
            '(╯°□°）╯︵ ┻━┻',
            '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
        ];

        this.filterLevels = [
            'Off',
            'No Role',
            'Everyone'
        ];
		this.timestamp = new Timestamp('d MMMM YYYY - HH:mm');
        const embed = new MessageEmbed()
            .setAuthor(`${server.name} ID: ${server.id}`, guild.iconURL())
            .setColor(0x3D85C6)
            .setThumbnail(server.image)
            //.addField('❯ Name', msg.guild.name, true)
            // .addField('❯ ID', msg.guild.id, true)
			.addField('❯ Explicit Filter', this.filterLevels[msg.guild.explicitContentFilter], true)
			.addField('❯ Verification Level', this.verificationLevels[msg.guild.verificationLevel], true)
            .addField('❯ Creation Date', this.timestamp.display(msg.guild.createdAt), true)
            .addField('❯ Bot Joined', this.timestamp.display(server.botJoin), true)
			.addField('❯ Owner', msg.guild.owner ? msg.guild.owner.user.tag : 'None', true)
            .addField('❯ Roles', server.roles, true)
            .addField(`Members: ${server.members}`, `Online: ${server.online}\nUsers: ${parseInt(server.members) - parseInt(server.bots)}\nBots: ${server.bots}`, true)
            .addField(`Channels: ${server.channels}`, `Text: ${server.text}\nVoice: ${parseInt(server.channels) - parseInt(server.text)}`, true)
            .addField(`Active Members Since Last Bot Update: ${server.activity.length}`, `Daily: ${server.daily.length}\nWeekly: ${server.weekly.length}\nMonthly: ${server.monthly.length}`, true)
        // .addField(`Emojis: ${server.emojis}`, `${server.allEmojis}`, true)
        return msg.sendEmbed( embed )
    }

    async init() {
        // You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
    }
}