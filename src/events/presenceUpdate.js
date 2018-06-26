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

    async run(oldMember, newMember) {
        if (oldMember.user.bot) { return }
        const guild = newMember.guild
        const game_new = newMember.presence.game || newMember.presence.activity
        const game_old = oldMember.presence.game || oldMember.presence.activity
        if ((game_new && game_new.name) === (game_old && game_old.name)) {
            return
        }
        if (game_new) {
            const playRole = guild.roles.find(role => role.name === `In ${game_new.name}`)
            if (!playRole) {
                const color = '#' + Math.floor(Math.random() * 16777215).toString(16)
                //const botrole = guild.roles.find('name', client.config.name)
                //client.logger.log(`[AUTO-ROLE CREATED] bot role position: ${botrole.position}`)
                guild.roles.create({
                    data: {
                        name: `In ${game_new.name}`,
                        color: color,
                        mentionable: true,
                        hoist: true,
                        position: 2
                    },
                    reason: `Automatic role for ${game_new.name} players`
                })
                    .then(role => {
                        // client.logger.log(`[AUTO-ROLE CREATED] Created new role with name ${role.name} and color ${role.color}`)
                        newMember.roles.add(role)
                    .catch(console.error)
                        // const role2 = guild.roles.find('name', `In ${game_new.name}`)
                        // client.logger.cmd(`[AUTO-ROLE CREATED] adding person ${newMember.user.username} to role ${role2.name}, currently ${role2.members.size} members of said role.`)
                    })
                    .catch(console.error)
            }
            else {
                newMember.roles.add(playRole)
                    .catch(console.error)
                // const role = guild.roles.find('name', `In ${game_new.name}`)
                // client.logger.cmd(`[AUTO-ROLE SET] adding person ${newMember.user.username} to role ${role.name}, currently ${role.members.size} members of said role.`)
            }
        }
        if (game_old) {
            const playRole = guild.roles.find(role => role.name === `In ${game_old.name}`)
            if (playRole && newMember.roles.has(playRole.id)) {
                newMember.roles.remove(playRole,'playing stop')
                    .catch(console.error)

                //const role = guild.roles.find(role => role.name === `In ${game_old.name}`)
                // client.logger.cmd(`[AUTO-ROLE UNSET] removing person ${newMember.user.username} from role ${role.name}, currently ${role.members.size} members of said role.`)
                //if(role.members.size === 0) {
                if (playRole.members.size === 1) {

                    //promise error, gets rejected, apparently discord is responding with an empty json and the lib dont like it
                    //so no async solution avaliable for now
                    //for both role.add and role.delete

                    // client.logger.cmd(`[AUTO-ROLE DELETE] role ${role.name} is currently empty, deleting said role.`)
                    // role.delete()
                    playRole.delete()
                    .catch (console.error)
                }
            }
        }
    }

    async init() {
        /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
    }

};
