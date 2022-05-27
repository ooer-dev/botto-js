/*
 * This file needs some help with variable naming and data modeling.
 * I did a lot of work here to improve it, but it's still kinda weird.
 */

class Markov {
  constructor (order = 1) {
    this.data = []
    this.wList = []

    this.r_data = []
    this.r_wList = []

    this.order = order
  }

  feed (str, rev = false) {
    let WLIST = !rev ? this.wList : this.r_wList
    let DATA = !rev ? this.data : this.r_data
    let text = str.replace(/\n/g, ' ').split(' ')
    text = this.#nSized(text)

    let acceptedWords = []
    let completedWords = []
    for (const c in text) {
      let counter = 0
      for (const j in text) {
        if (text[j] === text[c] && text.length > 20 && counter / text.length > (0.2 / (text.length / 20)) /* > n% of comment's words*/) {
          continue
        }
        if (text[j] === text[c]) {
          counter++
        }
      }

      if (!completedWords.includes(text[c])) {
        completedWords.push(text[c])
        for (let i = 0; i < counter; i++) {
          acceptedWords.push(text[c])
        }
      }
    }

    WLIST = WLIST.concat(acceptedWords)

    for (const word of text) {
      if (DATA.filter(d => d.id === word).length === 0) {
        DATA.push({ id: word, dat: [] })
      }
    }

    for (const i in DATA) {
      for (let j = 0; j < text.length; j++) {
        if (DATA[i].id !== text[j]) continue

        let found = false
        for (const k in DATA[i].dat) {
          if (DATA[i].dat[k].id !== text[j + 1]) continue

          DATA[i].dat[k].weight += 1
          found = true
        }

        if (!found && j + 1 < text.length) {
          DATA[i].dat.push({ id: text[j + 1], weight: 1 })
        }
      }
    }

    if (rev) {
      this.r_data = DATA
      this.r_wList = WLIST
    } else {
      this.data = DATA
      this.wList = WLIST
    }
  }

  feedArray (arr, predicate) {
    if (predicate === undefined) predicate = _ => true

    const inner = (resolve, i = 0) => {
      if (i === arr.length) {
        resolve()
        return
      }

      const str = arr[i]
      if (predicate(str)) this.feed(str)

      setImmediate(() => inner(resolve, ++i))
    }

    return new Promise(resolve => { inner(resolve) })
  }

  speakRand (length) {
    const idx = Math.round(Math.random() * (this.wList.length - 1))

    return this.#speak(this.wList[idx], length)
  }

  speakResponse (text, length) {
    let rndlist = []
    let wordList = this.#nSized(text.split(' '))

    const addW = this.#nSized(text.substring(text.indexOf(' ') + 1, text.length).split(' '))
    wordList = wordList.concat(addW)

    const addI = text.split(' ')
    wordList = wordList.concat(addI)

    for (let parent of this.data) {
      for (let word of wordList) {
        if (parent.id.toLowerCase().indexOf(word.toLowerCase()) !== -1) {
          const weight = parent.id.toLowerCase() === word.toLowerCase() ? 1 : 2
          rndlist.push({ data: parent.id, weight })
          rndlist = rndlist.concat(parent.dat.map(d => ({ data: d.id, weight: d.weight })))
        }
      }
    }

    if (rndlist.length === 0) {
      return this.speakRand(length)
    }

    const starter = Markov.#weightRandom(rndlist)
    let out = ''

    if (Math.random() > 0.5) {
      length = Math.floor(length / 2)
      const retrats = starter.split('').reverse().join('')
      out += this.#speak(retrats, length, true).split('').reverse().join('')
    }

    out += this.#speak(starter, length)

    return out
  }

  #speak (start, length, rev = false) {
    start = this.#nSized(start.split(' ')).reverse()[0]

    let out = rev ? '' : start
    let cycle = 0
    while (cycle < length - 1) {
      const next = this.#selectWord(start, rev)
      if (next === null) break

      out += ' ' + next
      start = next
      cycle++
    }

    return out
  }

  #selectWord (word, rev = false) {
    const DATA = !rev ? this.data : this.r_data

    const observation = DATA.find(d => d.id === word)
    if (observation === undefined) return null

    let rndlist = []
    for (const datum of observation.dat) {
      rndlist.push({
        data: datum.id,
        weight: datum.weight,
      })
    }

    if (rndlist.length === 0) return null

    return Markov.#weightRandom(rndlist)
  }

  #nSized (arr) {
    let arrays = []
    while (arr.length > 0) {
      arrays.push(arr.splice(0, this.order))
    }

    return arrays.map(a => a.join(' '))
  }

  static #weightRandom (data) {
    const rand = Math.random() * data.reduce((a, b) => a + b.weight, 0)

    let sum = 0
    for (const datum of data) {
      sum += datum.weight
      if (rand <= sum) {
        return datum.data
      }
    }
  }
}

module.exports = Markov
