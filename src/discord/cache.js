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
    let channel = this.#channels.find(c => c.id == channelId) || null
    if (!channel) {
      this.#channels.push({ id: channelId, cache: [] })
      channel = this.#channels[this.#channels.length - 1]
    }

    if (channel.cache.length >= channelMessageLimit) {
      channel.cache.splice(0, 1)
    }
    channel.cache.push(msg)

    this.#save()
  }

  getMessageFromChannel (channelId) {
    let channel = this.#channels.find(c => c.id == channelId)

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
    const json = JSON.parse(rawFile);
    const messages = json.messages
    const channels = json.channels

    if (messages.length) {
      this.#messages = messages
    }

    if (channels.length) {
      this.#channels = channels
    }
  }

  #save () {
    fs.writeFileSync(cacheFilePath, JSON.stringify({ messages: this.#messages, channels: this.#channels }))
  }
}

module.exports = new DiscordCache()
