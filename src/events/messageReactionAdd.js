const { Event } = require('klasa')
const fs = require('fs')

module.exports = class extends Event {
  constructor(...args) {
    /**
     * Any default options can be omitted completely.
     * if all options are default, you can omit the constructor completely
     */
    super(...args, {
      enabled : true,
      once    : false
    })
  }

  async run(messageReaction, user) {
    // This is where you place the code you want to run for your event
    if (user.bot) {
      return
    }
    const id = messageReaction.emoji.guild.id
    const messages = []
    const reaction = []
    const role = []
    if (fs.existsSync(`./data/autoroles/${id}.csv`)) {
      const fileread = fs.readFileSync(`./data/autoroles/${id}.csv`).toString()
      fileread.split('\n').forEach(function(value) {
        if (value) {
          messages.push(value.split(',')[0])
          reaction.push(value.split(',')[1])
          role.push(value.split(',')[2])
        }
      })
      const mess = messages.find(ms => ms === messageReaction.message.id)
      if (mess) {
        const index = messages.indexOf(mess)
        const react = messageReaction.emoji.guild.emojis.find(
          emoj => emoj.id === reaction[index]
        )
        if (react) {
          const roleAdd = messageReaction.emoji.guild.roles.find(
            rol => rol.id === role[index]
          )
          if (roleAdd) {
            const usr = messageReaction.emoji.guild.members.find(
              member => member.id === user.id
            )
            if (usr) {
              usr.roles.add(roleAdd)
            }
          }
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
}
