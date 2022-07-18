const checks = require('./util/checks')
const nutbutton = require('./img/nutbutton')
const combo = require('./brains/combo')
const reddit = require('./data/reddit')
const channels = require('./util/channels')
const Coins = require('./data/coins')
const dcache = require('./discord/cache')
const bot = require('./bot')
const text = require('./util/text')
const final = require('./brains/final')
const keys = require('../config/keys.json')

let markovInProgress = false
let chatProbability = 0.02

const sendMessage = async function (opts) {
  const channel = bot.channels.cache.get(opts.to)
  let content = opts.message || ''
  const files = opts.files || []
  const filtered = opts.filter || true

  if (filtered && checks.isDirty(content)) return

  if (content === '') content = null

  await channel.send({
    content,
    files
  })
}

bot.on('messageCreate', async function (msginst) {
  let message = msginst.content
  const userID = msginst.author.id
  const channelID = msginst.channelId

  if (checks.isDirty(message) && !checks.isAdmin(userID)) {
    return
  }

  dcache.addMessageToChannel(channelID, message)

  message = message.replace(/@everyone/g, '@WHATTHEFUCKDIDYOUJUSTFUCKINGSAYABOUTMEYoULITTLEBITCH')
  message = message.replace(/@here/g, '@ohhombresonagradablesparaayudar')
  message = message.replace(/@muds/g, '@Tobefair,youhavetohaveaveryhighIQtounderstandRickandMorty.Thehumourisextremelysubtle,andwithoutasolidgraspoftheoreticalphysicsmostofthejokeswillgooveratypicalviewer’shead.There’salsoRick’snihilisticoutlook,whichisdeftlywovenintohischaracterisation-hispersonalphilosophydrawsheavilyfromNarodnayaVolyaliterature,forinstance.Thefansunderstandthisstuff;theyhavetheintellectualcapacitytotrulyappreciatethedepthsofthesejokes,torealisethatthey’renotjustfunny-theysaysomethingdeepaboutLIFE.AsaconsequencepeoplewhodislikeRick&MortytrulyAREidiots-ofcoursetheywouldn’tappreciate,forinstance,thehumourinRick’sexistentialcatchphrase“WubbaLubbaDubDub,”whichitselfisacrypticreferencetoTurgenev’sRussianepicFathersandSons.I’msmirkingrightnowjustimaginingoneofthoseaddlepatedsimpletonsscratchingtheirheadsinconfusionasDanHarmon’sgeniuswitunfoldsitselfontheirtelevisionscreens.Whatfools..howIpitythem.')

  const args = message.replace(/  /g, ' ').split(' ')
  switch (args[0].toLowerCase()) {
    case '?nut':
      if (args.length > 1) {
        const pattern = new RegExp(text.escapeRegExp('?nut '), 'g')
        try {
          const attachment = await nutbutton.generate(message.replace(pattern, ''))
          await sendMessage({
            to: channelID,
            files: [{ attachment, name: 'nut6969.png' }],
          })
        } catch (err) {
          console.log(err)
        }
      } else {
        await sendMessage({
          to: channelID,
          message: '💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦💦'
        })
      }
      break
    case '?nutface':
      if (args.length >= 3) {
        const nutter = text.stringToID(args[1])
        const button = args.slice(2).join(' ')
        try {
          const attachment = await nutbutton.generateFace(button, nutter)
          await sendMessage({
            to: channelID,
            files: [{ attachment, name: 'nut6969.png' }],
          })
        } catch (err) {
          console.log(err)
        }
      }
      break
    ////////////////////////////////////////////////////CONFIG
    case '?addchatchannel':
      if (checks.isAdmin(userID)) {
        channels.setChatChannel(channelID, true)
        await sendMessage({
          to: channelID,
          message: 'Chat channel added',
        })
      }
      break
    case '?removechatchannel':
      if (checks.isAdmin(userID)) {
        channels.setChatChannel(channelID, false)
        await sendMessage({
          to: channelID,
          message: 'Chat channel removed',
        })
      }
      break
    case '?addlearnchannel':
      if (checks.isAdmin(userID)) {
        channels.setLearnChannel(channelID, true)
        await sendMessage({
          to: channelID,
          message: 'Learn channel added',
        })
      }
      break
    case '?removelearnchannel':
      if (checks.isAdmin(userID)) {
        channels.setLearnChannel(channelID, false)
        await sendMessage({
          to: channelID,
          message: 'Learn channel removed',
        })
      }
      break
    ////////////////////////////////////////////////////OOERCOINS
    case '?grant':
      if (checks.isWeakAdmin(userID) && !isNaN(1 * args[3])) {
        if (args.length === 4) {
          const recipient = text.stringToID(args[1])
          const coin = args[2]
          const amount = Math.round(1 * args[3])
          Coins.giveCoins(recipient, coin, amount, true)
          await sendMessage({
            to: channelID,
            message: `Divinely gifted ${amount} ${coin} to <@!${recipient}>`,
          })
        } else {
          await sendMessage({
            to: channelID,
            message: 'Usage: ```?grant USER COINTYPE AMOUNT```',
          })
        }
      } else {
        await sendMessage({
          to: channelID,
          message: 'Not an admin',
        })
      }
      break
    case '?balance':
      if (args.length === 1 || args.length === 2) {
        const account = args.length === 2 ? text.stringToID(args[1]) : userID
        const coins = Coins.getAllCoins(account)
        let msg = `**TOTAL ACCOUNT BALANCE FOR** <@!${account}>:`
        for (let coin of coins) {
          if (coin.amount !== 0) {
            msg += `\n**${coin.type}**: ${coin.amount}`
          }
        }
        await sendMessage({
          to: channelID,
          message: msg,
          filter: false,
        })
      } else {
        await sendMessage({
          to: channelID,
          message: 'Usage: ```?balance``` or ```?balance USER```',
        })
      }
      break
    case '?pay':
      if (args.length === 4 && !isNaN(1 * args[3])) {
        const recipient = text.stringToID(args[1])
        const coin = args[2]
        const amount = Math.round(1 * args[3])

        if (Coins.checkBalance(userID, coin) >= amount && amount > 0) {
          Coins.pay(userID, recipient, coin, amount)
          await sendMessage({
            to: channelID,
            message: `Sent ${amount} ${coin} to <@!${recipient}>`,
          })
        } else if (Coins.checkBalance(userID, coin) < amount) {
          await sendMessage({
            to: channelID,
            message: 'You can\'t afford this! Use ```?balance``` to check your current balance',
          })
        } else if (amount < 0) {
          if (checks.isAdmin(userID)) {
            Coins.pay(userID, recipient, coin, amount)
            await sendMessage({
              to: channelID,
              message: `Stole ${-amount} ${coin} from <@!${recipient}>`,
            })
          } else {
            await sendMessage({
              to: channelID,
              message: 'You can\'t steal from other users!',
            })
          }
        }
      } else {
        await sendMessage({
          to: channelID,
          message: 'Usage: ```?pay USER ITEM AMOUNT```',
        })
      }

      break

    ////////////////////////////////////////////////////MISC
    case '?help':
      await sendMessage({
        to: channelID,
        message: 'FUCK YOU, FIGURE IT OUT YOURSELF',
      })
      break
    case '?reset':
      if (checks.isAdmin(userID)) {
        await sendMessage({
          to: channelID,
          message: 'OMAN RE-OOERING BERAinN',
        })
        combo.reset()
      } else {
        await sendMessage({
          to: channelID,
          message: 'OMAN INVALID COMMAND OR USER BEEP BEEP :warning:',
        })
      }

      break
    case '?randomchat':
      if (args.length === 2) {
        if (checks.isAdmin(userID) && !isNaN(1 * args[1])) {
          chatProbability = 1 * args[1]
          await sendMessage({
            to: channelID,
            message: 'chatto set to ' + chatProbability,
          })
        }
      }
      break
    case '?dond':
      if (checks.isAdmin(userID)) {
        await sendMessage({
          to: channelID,
          message: Math.random() >= 0.5 ? ':eggplant: **DONG** :eggplant:' : ':taco: **NO DONG** :taco:',
        })
      }
      break
  }

  if (message === 'ping') {
    await sendMessage({
      to: channelID,
      message: 'pong',
    })
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  if (markovInProgress || userID === bot.user.id) {
    return
  }

  if (channels.isLearnChannel(channelID)) {
    combo.learn(message)
  }

  const reply = dcache.getMessageFromChannel(channelID)
  if (channels.isChatChannel(channelID) || Math.random() < chatProbability || checks.hasMention(message)) {
    markovInProgress = true

    await new Promise(r => setTimeout(r, Math.round(Math.random() * 10000)))

    if (Math.random() < 0.6) {
      await sendMessage({
        to: channelID,
        message: final.generate(reply)
      })
    } else {
      if (Math.random() > 0.5) {
        const txt = await combo.replyLong(reply)
        await sendMessage({
          to: channelID,
          message: txt
        })
      } else {
        const txt = await combo.replyShort(reply)
        await sendMessage({
          to: channelID,
          message: txt
        })
      }
    }

    markovInProgress = false
  }
})

///////////////////////////

bot.login(keys.discord_token)
reddit.login()
