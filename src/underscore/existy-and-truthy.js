const existy = x => {
  return x != null
}

const truthy = x => {
  return x !== false && existy(x)
}

exports.existy = existy
exports.truthy = truthy
