const { existsSync, writeFileSync, readFileSync, mkdirSync } = require("fs")
const os = require("os")

const inquirer = require("inquirer")

let appCache = {
  cachePath: `${os.homedir()}/.azgo/appcache.json`,
  cache: {},
  init: function (opts) {
    if (!existsSync(`${os.homedir()}/.azgo/`)) {
      mkdirSync(`${os.homedir()}/.azgo`)
    }
    if (existsSync(this.cachePath)) {
      if (readFileSync(this.cachePath) == "") {
        this.cache = {}
      } else {
        this.cache = require(this.cachePath)
      }
    } else {
      writeFileSync(this.cachePath, JSON.stringify(this.cache))
    }
    return this.cache
  },
  set: function (key = "all", data) {
    console.log(data)
    if (key == "all") {
      writeFileSync(this.cachePath, JSON.stringify(this.cache))
    } else {
      this.cache[key] = data
      writeFileSync(this.cachePath, JSON.stringify(this.cache))
    }
    console.log(this.cache)
    return this.cache
  },
  get: function (key = "all") {
    if (key == "all") {
      return this.cache
    } else {
      this.cache[key] = JSON.parse(readFileSync(this.cachePath))[key]
      return this.cache[key]
    }
  },
  show: function () {
    this.cache = require(this.cachePath)
    console.log(JSON.stringify(this.cache, null, 2))
  },
  clear: function () {
    this.cache = {}
    writeFileSync(this.cachePath, "{}")
  },
  isEmpty: function() {
    if (
      this.cache == "" ||
      Object.entries(this.cache).length == 0 ||
      this.cache == [] ||
      this.cache == {}
    ) {
      return true
    } else {
      return false
    }
  }
}

function isSubscriptionSelected(selectedSubscription) {
  if (
    !appCache.isEmpty(appCache.cache) &&
    selectedSubscription &&
    selectedSubscription != "" &&
    selectedSubscription != [] &&
    Object.entries(selectedSubscription).length != 0 &&
    selectedSubscription != {}
  ) {
    return true
  } else {
    return false
  }
}

function clearCacheConfirm() {
  inquirer
    .prompt({
      type: "confirm",
      name: "clearCache",
      message: "Are you sure you want to clear the CLI cache?",
      default: false,
    })
    .then((answer) => {
      if (answer.clearCache) {
        appCache.clear()
        console.log("Cache cleared")
      }
    })
}

module.exports = {
  appCache, isSubscriptionSelected, clearCacheConfirm
}
// module.exports
