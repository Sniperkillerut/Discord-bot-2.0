const { Command } = require('klasa');
const { MessageEmbed }  = require('discord.js');

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
            description: '',
            extendedHelp: 'No extended help available.',
            usage: '',
            usageDelim: undefined,
            quotedStringSupport: false,
            subcommands: false
        });
    }

    async run(message, [...params]) {
        if (!message.args[0]) {return}
        const n = message.args[0].split(' ')
        let i = 0
        /*
        let rolls = 'Rolling dices'
        n.forEach(function (argument) {
            i++
            if (isNaN(argument)) {
                rolls += `\nRolling Dice #${i}: ERROR, "${argument}" is not a valid number`
            } else {
                const diceSides = argument
                const rollResult = Math.floor(Math.random() * diceSides) + 1
                rolls += `\nRolling Dice #${i} of ${diceSides} sides: ${rollResult}`
            }
        })
        message.send(rolls)
        */

        const serverInfo = new MessageEmbed()
        serverInfo.setColor(0xCEDD)
        serverInfo.setThumbnail("https://images-na.ssl-images-amazon.com/images/I/718l-U18CvL._SY355_.jpg")
        n.forEach(function (argument) {
            i++
            if (isNaN(argument)) {
                serverInfo.addField(`\nRolling Dice #${i}:`, `ERROR "${argument}" is not a number`, true)
            } else {
                const diceSides = argument
                const rollResult = Math.floor(Math.random() * diceSides) + 1
                serverInfo.addField(`Dice #${i} of ${diceSides} sides:`, rollResult, true)
            }
        })
        let suffix = i>1? 's':''
        serverInfo.setTitle(`Rolling ${message.author.username}'s Dice${suffix}`)
        message.send(serverInfo)
    }

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
    }

};
