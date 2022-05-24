const fs = require('fs')

const coinsFilePath = __dirname + '/../../cache/coins.json'

class Coins {
  constructor () {
    this.#load()
  }

  checkBalance (uid, type) {
    this.#ensureUserExists(uid)

    if (!this.data.users[uid].coins.hasOwnProperty(type)) {
      return null
    }

    return this.data.users[uid].coins[type].amount
  }

  giveCoins (uid, type, amount, save) {
    this.#ensureUserExists(uid)

    if (this.checkBalance(uid, type) === null) {
      this.data.users[uid].coins[type] = { amount: 0 }
    }

    this.data.users[uid].coins[type].amount += amount

    if (save) {
      this.#save()
    }
  }

  pay (sender, recipient, type, amount) {
    this.giveCoins(sender, type, -1 * amount, false)
    this.giveCoins(recipient, type, amount, false)
    this.#save()
  }

  getAllCoins (uid) {
    this.#ensureUserExists(uid)

    let coins = []

    for (const [type, data] of Object.entries(this.data.users[uid].coins)) {
      coins.push({ type, amount: data.amount })
    }

    return coins
  }

  createCoin (type, value, image, emoji) {
    this.data.coin[type] = { type, value, image, emoji }
    this.#save()
  }

  #load () {
    this.data = JSON.parse(fs.readFileSync(coinsFilePath))
  }

  #save () {
    fs.writeFileSync(coinsFilePath, JSON.stringify(this.data))
  }

  #ensureUserExists (uid) {
    if (this.data.users.hasOwnProperty(uid)) return

    this.data.users[uid] = {
      id: uid,
      coins: {},
      transactions: ['ayy'],
    }
  }
}

module.exports = new Coins()
