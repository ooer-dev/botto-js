const fs = require('fs').promises
const { createCanvas, Image } = require('@napi-rs/canvas')
const axios = require('axios')

const bot = require('../bot')

const getAvatarBuffer = async userId => {
  const user = await bot.users.fetch(userId)
  const url = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
  const res = await axios.get(url, { responseType: 'arraybuffer' })

  return Buffer.from(res.data)
}

exports.generate = async text => {
  console.log("Generate text: " + text)
  let canvas = createCanvas(504, 375)
  let ctx = canvas.getContext('2d')

  let img = new Image
  img.src = await fs.readFile(__dirname + '/data/nut.png')
  ctx.drawImage(img, 0, 0, img.width, img.height)

  ctx.save()
  ctx.translate(134, 245)
  ctx.rotate(Math.PI * 0.1)
  ctx.textAlign = 'center'
  ctx.fillStyle = '#FFF'
  ctx.font = '20px bold Verdana'
  ctx.fillText(text, 0, 0)
  ctx.restore()

  return canvas.toBuffer("image/png")
}

exports.generateFace = async (text, userId) => {
  let canvas = createCanvas(504, 375)
  let ctx = canvas.getContext('2d')

  let img = new Image()
  img.src = await fs.readFile(__dirname + '/data/nut.png')
  ctx.drawImage(img, 0, 0, img.width, img.height)

  let fcImg = new Image()
  fcImg.src = await getAvatarBuffer(userId)
  ctx.drawImage(fcImg, 276, 99, 120, 120)

  ctx.save()
  ctx.translate(134, 245)
  ctx.rotate(Math.PI * 0.1)
  ctx.textAlign = 'center'
  ctx.fillStyle = '#FFF'
  ctx.font = '20px bold Verdana'
  ctx.fillText(text, 0, 0)
  ctx.restore()

  return canvas.toBuffer("image/png")
}
