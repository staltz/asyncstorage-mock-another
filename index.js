var db = {}

function getItem(key, cb) {
  return new Promise((resolve, reject) => {
    if (typeof db[key] === 'undefined') {
      cb && cb(null, null)
      resolve(null)
    } else {
      cb && cb(null, db[key])
      resolve(db[key])
    }
  })
}

function setItem(key, value, cb) {
  return new Promise((resolve, reject) => {
    db[key] = value
    cb && cb(null)
    resolve(null)
  })
}

function removeItem(key, cb) {
  return new Promise((resolve, reject) => {
    if (typeof db[key] === 'undefined') {
      cb && cb(null)
      resolve(null)
    } else {
      delete db[key]
      cb && cb(null)
      resolve(null)
    }
  })
}

function _merge(target, reference) {
  for (var key in reference) {
    if (typeof target[key] === 'object' && typeof reference[key] === 'object') {
      _merge(target[key], reference[key])
    } else if (typeof reference[key] !== 'undefined') {
      target[key] = reference[key]
    }
  }
}

var VAL_MERGE_1 = {'foo': 1, 'bar': {'hoo': 1, 'boo': 1},           'moo': {'a': 3}}
var VAL_MERGE_2 =           {'bar': {'hoo': 2},           'baz': 2, 'moo': {'a': 3}}
var VALEXPECT =   {'foo': 1, 'bar': {'hoo': 2, 'boo': 1}, 'baz': 2, 'moo': {'a': 3}}

function mergeItem(key, jsonString, cb) {
  return new Promise((resolve, reject) => {
    var newObj = JSON.parse(jsonString)
    if (typeof db[key] === 'undefined') {
      db[key] = jsonString
    } else if (typeof db[key] === 'string') {
      var prevObj = JSON.parse(db[key])
      _merge(prevObj, newObj)
      db[key] = JSON.stringify(prevObj)
    } else {
      _merge(db[key], newObj)
    }
    cb && cb(null)
    resolve(null)
  })
}

function clear(cb) {
  return new Promise((resolve, reject) => {
    db = {}
    cb && cb(null)
    resolve(null)
  })
}

function getAllKeys(cb) {
  return new Promise((resolve, reject) => {
    var keys = Object.keys(db)
    cb && cb(null, keys)
    resolve(null)
  })
}

function flushGetRequests() {
  return new Promise((resolve, reject) => {
    resolve(null)
  })
}

function multiGet(keys, cb) {
  return new Promise((resolve, reject) => {
    var errors = keys.map(key => {
      if (typeof db[key] === 'undefined') {
        return [key, 'No data for key ' + key + ' found in AsyncStorage']
      } else {
        return null
      }
    }).filter(arr => arr !== null)

    if (errors.length > 0) {
      cb && cb(errors)
      reject(errors)
    } else {
      var results = keys.map(key => [key, db[key]])
      cb && cb(null, results)
      resolve(results)
    }
  })
}

function multiSet(kvPairs, cb) {
  return new Promise((resolve, reject) => {
    kvPairs.forEach(kv => {
      var key = kv[0]
      var value = kv[1]
      db[key] = value
    })
    cb && cb(null)
    resolve(null)
  })
}

function multiRemove(keys, cb) {
  return new Promise((resolve, reject) => {
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      if (typeof db[key] === 'undefined') {
        resolve(null)
        cb && cb(null)
        return
      } else {
        delete db[key]
      }
    }
    cb && cb(null)
    resolve(null)
  })
}

function multiMerge(kvPairs, cb) {
  return new Promise((resolve, reject) => {
    kvPairs.forEach(kv => {
      var key = kv[0]
      var jsonString = kv[1]
      var newObj = JSON.parse(jsonString)
      if (typeof db[key] === 'undefined') {
        db[key] = newObj
      } else {
        for (var k in newObj) {
          db[key][k] = newObj[k]
        }
      }
    })
    cb && cb(null)
    resolve(null)
  })
}

module.exports = {
  getItem: getItem,
  setItem: setItem,
  removeItem: removeItem,
  mergeItem: mergeItem,
  clear: clear,
  getAllKeys: getAllKeys,
  flushGetRequests: flushGetRequests,
  multiGet: multiGet,
  multiSet: multiSet,
  multiRemove: multiRemove,
  multiMerge: multiMerge
}
