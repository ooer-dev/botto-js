const fs = require('fs')

const admins = [
  '165206792689680385', // mcl
  '166279914109009921',
  '248933758898667521',
  '135348017078206464',
  '310618614497804289',
  '115892921584189447',
  '93531425671753728',
  '154542529591771136',
  '179313752464818178',
  '346804110303166474',
  '174640149999779840',
  '274430881786101760',
  '147866216202108928',
  '202435815198949376',
  '205962325725937665',
  '132924988100444160', // curt
  '346804110303166474', // sean
  '112305782028062720', // bacon
]

const weakAdmins = [
  '201723500971556864', // dominus
]

const filterWords = JSON.parse(fs.readFileSync(__dirname + '/filter.json')).banned

exports.isAdmin = function (uid) {
  return admins.includes(uid)
}

exports.isWeakAdmin = function (uid) {
  return weakAdmins.includes(uid) || exports.isAdmin(uid)
}

exports.isDirty = function (str) {
  for (const word of filterWords) {
    if (new RegExp(word).test(str.toLowerCase())) {
      return true
    }
  }

  return false
}

exports.hasMention = function (txt) {
  return txt.indexOf('<@!313929951114035200>') > -1
}
