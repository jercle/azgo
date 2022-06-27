const { existsSync, writeFileSync, watch, readFileSync, write } = require("fs")
const os = require("os")
const inquirer = require("inquirer")

const subscriptions =
  require(`${os.homedir()}/.azure/azureProfile.json`).subscriptions

let appCache = {
  cachePath: "./.cache/appcache.json",
  cache: {},
  init: function (opt) {
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
    console.log(this.cache)
  },
}

// console.log(appCache.init())
// console.log(appCache.set( "asd"))

const subs = subscriptions.map((sub) => ({
  value: {
    subscriptionId: sub.id,
    name: sub.name,
    user: sub.user.name,
    tenantId: sub.tenantId,
  },
  name: `${sub.id}: ${sub.name}`,
  user: sub.user.name,
  tenantId: sub.tenantId,
}))

const pat = process.env.AZURE_DEVOPS_EXT_PAT

function main() {
  appCache.init()
  if (!pat || pat == "") {
    console.log(
      "\x1b[33m%s\x1b[0m",
      "Warning: AZURE_DEVOPS_EXT_PAT environment variable not set \n"
    )
  }
  if (
    appCache.cache.selectedSubscription &&
    appCache.cache.selectedSubscription != "" &&
    appCache.cache.selectedSubscription != [] &&
    Object.entries(appCache.cache.selectedSubscription).length != 0 &&
    appCache.cache.selectedSubscription != {}
  ) {
    return
  } else {
    selectSubscription()
  }
}

main()

function selectSubscription() {
  inquirer
    .prompt({
      type: "list",
      name: "subscriptionId",
      message: "Choose subscription",
      choices: subs,
    })
    .then((answer) => {
      appCache.set("selectedSubscription", answer.subscriptionId)
    })
}

// function exitHouse() {
//   inquirer.prompt(directionsPrompt).then((answers) => {
//     if (answers.direction === 'Forward') {
//       console.log('You find yourself in a forest');
//       console.log(
//         'There is a wolf in front of you; a friendly looking dwarf to the right and an impasse to the left.'
//       );
//       encounter1();
//     } else {
//       console.log('You cannot go that way. Try again');
//       exitHouse();
//     }
//   });
// }

// console.log(appCache)

// inquirer
//   .prompt([
//     {
//       type: 'list',
//       name: 'theme',
//       message: 'What do you want to do?',
//       choices: [
//         'Order a pizza',
//         'Make a reservation',
//         new inquirer.Separator(),
//         'Ask for opening hours',
//         {
//           name: 'Contact support',
//           disabled: 'Unavailable at this time',
//         },
//         'Talk to the receptionist',
//       ],
//     },
//     {
//       type: 'list',
//       name: 'size',
//       message: 'What size do you need?',
//       choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
//       filter(val) {
//         return val.toLowerCase();
//       },
//     },
//   ])
//   .then((answers) => {
//     console.log(JSON.stringify(answers, null, '  '));
//   });
