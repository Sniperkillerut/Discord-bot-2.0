const { Command } = require('klasa')
const fs = require('fs')

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name                : 'reactionRole',
      enabled             : true,
      runIn               : ['text'],
      cooldown            : 0,
      aliases             : [],
      permLevel           : 6,
      botPerms            : ['ADD_REACTIONS', 'MANAGE_ROLES'],
      requiredSettings    : [],
      description         : 'Adds or remove auto role reaction.',
      quotedStringSupport : false,
      guarded             : true,
      subcommands         : true,
      usage               :
        '<add|remove> <role:role> <reaction:emoji> <message:message> [...]',
      usageDelim   : ' ',
      extendedHelp : 'No extended help available.'
    })
  }

  async add(msg, [role, reaction, message]) {
    if (!message.reactable) {
      return msg.sendMessage('That message can not be reacted to.')
    }
    const id = msg.guild.id
    const data = `${message.id},${reaction.id},${role.id}\n`
    fs.appendFileSync(`./data/autoroles/${id}.csv`, data)
    const mess = `The emoji ${reaction} will now add the role ${role} to the user when he uses it on the message:`
    const embed = {
      title       : `Message ID: ${message.id}`,
      description : message.content
    }
    message.react(reaction)
    return msg.sendMessage(mess, { embed })
  }

  async remove(msg, [role, reaction, message]) {
    const id = msg.guild.id
    const data = `${message.id},${reaction.id},${role.id}`
    let found = false
    if (fs.existsSync(`./data/autoroles/${id}.csv`)) {
      const fileread = fs.readFileSync(`./data/autoroles/${id}.csv`).toString()
      let file2 = ''
      fileread.split('\n').forEach(function(value) {
        if (value) {
          if (value != data) {
            file2 += value + '\n'
          }
          else {
            found = true
          }
        }
      })
      fs.writeFileSync(`./data/autoroles/${id}.csv`, file2)
    }
    if (!found) {
      return msg.sendMessage('Auto Role not found')
    }
    const reaction2 = message.reactions.find(react => react.me)
    if (reaction2) {
      reaction2.users.remove(this.client.user)
    }
    const mess = `The emoji ${reaction} will no longer add the role ${role} to the user when he uses it on the message:`
    const embed = {
      title       : `Message ID: ${message.id}`,
      description : message.content
    }
    return msg.sendMessage(mess, { embed })
  }

  async init() {
    let guilds =[]
    this.client.guilds.forEach(guild => {
      guilds.push(guild)
    })
    guilds.forEach(guild =>{
      if (fs.existsSync(`./data/autoroles/${guild.id}.csv`)) {
        const fileread = fs
          .readFileSync(`./data/autoroles/${guild.id}.csv`)
          .toString()
        const messages = []
        const reaction = []
        fileread.split('\n').forEach(function (value) {
          if (value) {
            messages.push(value.split(',')[0])
            reaction.push(value.split(',')[1])
          }
        })
        //TODO: maybe add channel to the file?
        guild.channels.forEach(channel => {
          if (channel.type != 'text') {
            return
          }
          // const filter = mess => messages.includes(mess)
          messages.forEach(msg => {
            let mess =  channel.messages.fetch(msg)
            .then(mess => {
              if (mess) {
                const index = messages.indexOf(mess.id)
                if (index>=0) {
                  mess.react(reaction[index])
                }
              }
            })
          })
        })
      }
    })
  }
}
