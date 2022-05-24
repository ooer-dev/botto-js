exports.escapeRegExp = function (str) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}

exports.stringToID = function (str) {
  return str.replace(/\</g, '').replace(/\>/g, '').replace(/\!/g, '').replace(/\@/g, '')
}
