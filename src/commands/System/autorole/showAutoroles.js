const { Command } = require('klasa')
const { MessageEmbed } = require('discord.js')
const fs               = require('fs')

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name        : 'showAutoroles',
      enabled     : true,
      runIn       : ['text'],
      cooldown    : 0,
      permLevel   : 6,
      description : 'shows a list of all the AutoRoles created for this Guild',
      extendedHelp: 'No extended help available.'
    })
  }

  async run(msg) {
    const id        = msg.guild.id
    const autoroles = new MessageEmbed()
      //.setColor(0xFFFFFF)
      .setTitle('List of AutoRoles')

    if (fs.existsSync(`./data/autoroles/${id}.csv`)) {
      fs.readFileSync(`./data/autoroles/${id}.csv`)
        .toString()
        .split('\n')
        .forEach(function(value) {
          if (value) {
            const arr   = value.split(',')
            const emoj  = msg.guild.emojis.get(arr[1])
            const role  = msg.guild.roles.get(arr[2])
            const title = `${emoj} => ${role.name}`
            const mess  = `Message ID: ${arr[0]}`
            autoroles.addField(title, mess)
          }
        })
    }
    return msg.sendEmbed(autoroles)
  }
}
