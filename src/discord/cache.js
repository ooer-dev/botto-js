const fs = require('fs')

const cacheFilePath = __dirname + '/../../cache/messages.json'

const messageLimit = 50000
const channelMessageLimit = 20

class DiscordCache {
  #messages = []
  #channels = []

  constructor () {
    this.#load()
  }

  getMessages () {
    return this.#messages
  }

  addMessage (msg) {
    if (this.#messages.length >= messageLimit) {
      const randidx = Math.round(Math.random() * (this.#messages.length - 1))
      this.#messages[randidx] = msg
    } else {
      this.#messages.push(msg)
    }

    this.#save()
  }

  addMessageToChannel (channelId, msg) {
    let channel = this.#channels.filter(c => c.id == channelId)[0] || null
    if (!channel) {
      this.#channels.push({ id: channelId, cache: [] })
      channel = this.#channels[this.#channels.length - 1]
    }

    if (channel.cache.length >= channelMessageLimit) {
      channel.cache.splice(channel.cache.length - 1, 1)
    }
    channel.cache.push(msg)

    this.#save()
  }

  getMessageFromChannel (channelId) {
    let channel = this.#channels.filter(c => c.id == channelId)[0]

    let n = channelMessageLimit
    let kill = false
    while (!kill && n > 0) {
      n -= 1
      if (Math.random() < 0.5) {
        kill = true
      }
    }

    return channel.cache[n] || ''
  }

  #load () {
    const rawFile = fs.readFileSync(cacheFilePath)
    const messages = JSON.parse(rawFile).messages
    const channels = JSON.parse(rawFile).caches

    if (messages.length) {
      this.#messages = messages
    }

    if (channels.length) {
      this.#channels = channels
    }
  }

  #save () {
    fs.writeFileSync(cacheFilePath, JSON.stringify({ messages: this.#messages, caches: this.#channels }))
  }
}

module.exports = new DiscordCache()
