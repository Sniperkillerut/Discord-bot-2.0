const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

    constructor(...args) {
        /**
         * Any default options can be omitted completely.
         * if all options are default, you can omit the constructor completely
         */
        super(...args, {
            enabled: true,
            spamProtection: true
        });
    }

    async run(message, command) {
        // This is where you place the code you want to run for your inhibitor
        if (message.guild && message.guild.configs.deleteCommand) return message.delete();
        return null;
    }

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
        if (!this.client.gateways.guilds.schema.has('deleteCommand')) {
            await this.client.gateways.guilds.schema.add('deleteCommand', { type: 'boolean', default: false });
        }
    }

};
