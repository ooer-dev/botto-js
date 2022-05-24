const rawjs = require('raw.js')
const keys = require('../../config/keys.json')

const commentSubs = 'ooer+ooerintensifies'
const titleSubs = 'ooer+ooerintensifies+195'

class RedditClient {
  #reddit

  constructor () {
    this.#reddit = new rawjs('OoerBot v2.0 by mc_labs15')
  }

  login () {
    return new Promise((resolve, reject) => {
      this.#reddit.setupOAuth2(keys.key1, keys.key2)
      this.#reddit.auth({ username: keys.username, password: keys.password }, function (err, response) {
        if (err) {
          console.log('Unable to authenticate user: ' + err)
          reject(err)
        } else {
          console.log(keys.username + ' successfully authenticated!')
          resolve()
        }
      })
    })
  }

  getTitles (count) {
    return new Promise((resolve, reject) => {
      let titles = []

      const read = (num, after = null) => {
        if (num <= 0) {
          resolve(titles)
          return
        }

        let req = { r: titleSubs, limit: 100, all: true }
        if (!after) {
          req.after = after
        }

        this.#reddit.new(req, function (err, res) {
          if (err) {
            resolve(titles)
            return
          }

          const things = res.children

          for (const thing of things) {
            if (thing.data.author.toLowerCase() === keys.username.toLowerCase()) {
              continue
            }

            titles.push(thing.data.title)
          }

          const aft = things[things.length - 1].data.name
          const ct = num - 1
          read(ct, aft)
        })
      }

      read(count)
    })
  }

  getComments (count) {
    return new Promise((resolve, reject) => {
      let comments = []

      const read = (num, after = null) => {
        if (num <= 0) {
          resolve(comments)
          return
        }

        let req = { r: commentSubs, limit: 100, all: true }
        if (!after) {
          req.after = after
        }

        this.#reddit.comments(req, function (err, res) {
          if (err) {
            resolve(comments)
            return
          }

          const things = res.data.children

          for (const thing of things) {
            if (thing.data.author.toLowerCase() === keys.username.toLowerCase()) {
              continue
            }

            comments.push(thing.data.body)
          }

          const aft = things[things.length - 1].data.name
          const ct = num - 1
          read(ct, aft)
        })
      }

      read(count)
    })
  }
}

module.exports = new RedditClient()
