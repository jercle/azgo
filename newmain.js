#!/usr/bin/env node

const { bold, yellow } = require("chalk")

const { actOnCli, options, selectSubscription } = require("./cli")
const { appCache, isSubscriptionSelected } = require("./funcs/utility/cache")

const pat = process.env.AZURE_DEVOPS_EXT_PAT

appCache.init()

actOnCli(options)
main()

function main() {
  appCache.init()
  if (!pat || pat == "") {
    console.log(
      bold(
        yellow("Warning: AZURE_DEVOPS_EXT_PAT environment variable not set \n")
      )
    )
  }
  !isSubscriptionSelected(appCache.cache.selectedSubscription) &&
    selectSubscription()
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
