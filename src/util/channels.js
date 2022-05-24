const fs = require('fs')

const channelsFilePath = __dirname + '/../../config/channelList.json'
let channels = JSON.parse(fs.readFileSync(channelsFilePath))

exports.isChatChannel = function (cid) {
  return channels.chatChannels.includes(cid)
}

exports.isLearnChannel = function (cid) {
  return channels.learnChannels.includes(cid)
}

exports.setChatChannel = function (cid, v) {
  const idx = channels.chatChannels.indexOf(cid)
  if (v) {
    if (idx === -1) {
      channels.chatChannels.push(cid)
    }
  } else {
    if (idx > -1) {
      channels.chatChannels.splice(idx, 1)
    }
  }

  fs.writeFileSync(channelsFilePath, JSON.stringify(channels))
}

exports.setLearnChannel = function (cid, v) {
  const idx = channels.learnChannels.indexOf(cid)

  if (v) {
    if (idx === -1) {
      channels.learnChannels.push(cid)
    }
  } else {
    if (idx > -1) {
      channels.learnChannels.splice(idx, 1)
    }
  }

  fs.writeFileSync(channelsFilePath, JSON.stringify(channels))
}
