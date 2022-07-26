const fs = require('fs')

const admins = [
  '165206792689680385', // mcl
  '166279914109009921', // blap
  '248933758898667521', // cailin
  '135348017078206464', // sassy
  '310618614497804289', // crimso
  '115892921584189447', // rooster
  '93531425671753728',  // jauris
  '154542529591771136', // mork
  '179313752464818178', // niyx
  '346804110303166474', // sean
  '174640149999779840', // woll
  '274430881786101760', // nolan
  '147866216202108928', // riock
  '202435815198949376', // lethal
  '205962325725937665', // ooer
  '132924988100444160', // curt
  '112305782028062720', // bacon
  '212654686799396868', // pants
]

const weakAdmins = [
  // '201723500971556864', // dominus
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
