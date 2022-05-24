const { Client, Intents } = require('discord.js')

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES] })

bot.on('error', function (event) {
  console.log(event)
})

bot.on('ready', function (c) {
  console.log('Logged in as %s - %s\n', c.user.username, c.user.id)
})

module.exports = bot
