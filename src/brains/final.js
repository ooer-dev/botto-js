const fs = require('fs')
const he = require('he')

const Markov = require('./markov')

class FinalBrain {
  #brain

  constructor () {
    const brainDat = JSON.parse(fs.readFileSync(__dirname + '/data/brain_final.json').toString())
    const reverseDat = JSON.parse(fs.readFileSync(__dirname + '/data/reverse_brain_final.json').toString())

    this.#brain = new Markov(2)
    this.#brain.data = brainDat.data
    this.#brain.wList = brainDat.wList
    this.#brain.r_data = reverseDat.data
    this.#brain.r_wList = reverseDat.wList
  }

  generate (msg) {
    let length = Math.round(Math.random() * 150 + 1)
    if (Math.random() < 0.8) {
      length = Math.round(Math.random() * 15 + 1)
    }

    const response = Math.random() < 0.4 ? this.#brain.speakResponse(msg, length) : this.#brain.speakRand(length)

    return he.decode(response).replace(/\\n/g, '\n')
  }
}

module.exports = new FinalBrain()
