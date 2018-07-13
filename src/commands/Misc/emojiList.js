const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: 'Lists all guild\'s emoji',
        });
    }

    async run(msg, [...extra]) {
        const emojiList = msg.guild.emojis.map((e, x) => ('<:emoji:'+x+'>' + ' = ' + e) + ' | ' + e.name).join('\n');
        msg.channel.send(emojiList);
    }
}