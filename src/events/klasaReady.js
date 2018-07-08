const { Event } = require('klasa');
module.exports = class extends Event {

    constructor(...args) {
        /**
         * Any default options can be omitted completely.
         * if all options are default, you can omit the constructor completely
         */
        super(...args, {
            enabled: true,
            once: false
        });
    }

    async run() {
        // This is where you place the code you want to run for your event
        ;
        setInterval(this.client.checkUsers, 60000, this.client.users)
        setInterval(this.client.updateRankingChannel, 600000, this.client.guilds)
        this.client.updateRankingChannel(this.client.guilds)
    }

    async init() {
        /*
        * You can optionally define this method which will be run when the bot starts
        * (after login, so discord data is available via this.client)
        */
    }

};
