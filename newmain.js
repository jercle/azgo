#!/usr/bin/env node

const { bold, yellow } = require("chalk")
const yargs = require("yargs")

const { actOnCli, selectSubscription } = require("./cli")
const { appCache, isSubscriptionSelected } = require("./funcs/utility/cache")

const pat = process.env.AZURE_DEVOPS_EXT_PAT

appCache.init()

const options = yargs
  .env("AZGO")
  .check((argv, options) => {
    if (
      argv._[0] == "ls" ||
      argv._[0] == "security" ||
      argv._[0] == "secrets" ||
      argv._[0] == "asp" ||
      argv._[0] == "app" ||
      argv._[0] == "init" ||
      argv._[0] == "subs"
    ) {
      return true // tell Yargs that the arguments passed the check
    } else {
      throw new Error("See above for available commands")
    }
  })
  .usage(`azgo ${"<command>"} ${"[option]"}`)
  // .usage("ls -n <File Share name> -c <connection string>")
  // .usage("secrets -a <App Name> -e <environment>")
  .command("init", "Initiate app, and configuration", (yargs) => {
    return yargs
      .option("clearCache", {
        alias: "x",
        type: "boolean",
        description: "Clears CLI cache",
      })
      .option("showCache", {
        alias: "s",
        type: "boolean",
        description: "Prints current CLI cache to terminal",
      })
  })
  .command("ls", "List files in given File Share", (yargs) => {
    return yargs
      .option("connStr", {
        describe: "Connection String for Storage Account",
        alias: "c",
        type: "string",
        demandOption: true,
      })
      .option("shareName", {
        describe: "Name of File Share",
        alias: "n",
        type: "string",
        demandOption: true,
      })
      .option("path", {
        describe: "Directory path within File Share. ",
        alias: "p",
        type: "string",
        default: "",
      })
  })
  .command("secrets", "List secrets for an app's keyvault", (yargs) => {
    return yargs
      .option("appName", {
        describe: "Name of App",
        alias: "n",
        type: "string",
        demandOption: true,
      })
      .option("appEnv", {
        describe: "Environment ('dev', 'test', 'prod'",
        alias: "e",
        type: "string",
        demandOption: true,
      })
  })
  .command("acr", "Azure Container Registry related actions", (yargs) => {
    return yargs.command("vulns", "ACR Vulnerability scan actions", (yargs) => {
      return yargs
        .option("subscriptionId", {
          describe: "Subscription ID",
          alias: "s",
          type: "string",
          demandOption: true,
        })
        .option("assessmentId", {
          describe: "Security assessment ID",
          alias: "i",
          type: "string",
          demandOption: true,
        })
        .option("resourceGroup", {
          describe: "Name of Resource Group",
          alias: "g",
          type: "string",
          demandOption: true,
        })
        .option("acrRegistry", {
          describe: "Name of ACR Registry",
          alias: "a",
          type: "string",
          demandOption: true,
        })
        .option("output", {
          alias: "o",
          describe: "Output file path. Ex: /tmp/vulns.json, ./vulns.json, etc",
          type: "string",
        })
        .option("regenReport", {
          alias: "r",
          describe: "Regenerate report from Azure data sources",
          type: "boolean",
        })
    })
  })
  // .command("security", "Security Center related actions", (yargs) => {
  //   return yargs
  // })

  // .option("subscriptionId", {
  //   describe: "Subscription ID",
  //   alias: "s",
  //   type: "string",
  //   demandOption: true,
  // })
  // .option("assessmentId", {
  //   describe: "Security assessment ID",
  //   alias: "i",
  //   type: "string",
  //   demandOption: true,
  // })
  // .option("resourceGroup", {
  //   describe: "Name of Resource Group",
  //   alias: "g",
  //   type: "string",
  //   demandOption: true,
  // })
  // .option("acrRegistry", {
  //   describe: "Name of ACR Registry",
  //   alias: "r",
  //   type: "string",
  //   demandOption: true,
  // })
  // .option("saveFile", {
  //   describe: "Save output to Environment Variable: testDataPath",
  //   type: "boolean",
  // })

  // subscriptionId: process.env.subscriptionId,
  // resourceGroup: process.env.resourceGroup,
  // assessmentId: process.env.assessmentId,
  // acrRegistry: process.env.acrRegistry,
  // testDataPath: process.env.testDataPath,
  // saveFile: process.env.saveFile,

  .command("asp", "Get details of an App Service Plan", (yargs) => {
    return yargs
      .option("appName", {
        describe: "Name of App",
        alias: "n",
        type: "string",
        demandOption: true,
      })
      .option("appEnv", {
        describe: "Environment ('dev', 'test', 'prod')",
        alias: "e",
        type: "string",
        demandOption: true,
      })
      .option("subscriptionId", {
        describe: "Subscription ID",
        alias: "s",
        type: "string",
        demandOption: true,
      })
  })
  .command("app", "Get details of an App Service", (yargs) => {
    return yargs
      .option("appName", {
        describe: "Name of App",
        alias: "n",
        type: "string",
        demandOption: true,
      })
      .option("appEnv", {
        describe: "Environment ('dev', 'test', 'prod')",
        alias: "e",
        type: "string",
        demandOption: true,
      })
      .option("subscriptionId", {
        describe: "Subscription ID",
        alias: "s",
        type: "string",
        demandOption: true,
      })
  })
  .command("subs", "List subscriptions in current AZ CLI profile", (yargs) => {
    return yargs.command(
      "active",
      "Select current active subscription for this CLI and Azure CLI"
    )
  })
  .help()
  .alias("h", "help")
  .alias("v", "version")
  .option("copyOutput", {
    describe: "Copy output to clipboard",
    alias: "c",
    default: false,
    type: "boolean",
  })
  .epilogue(
    "For more information, see the readme at https://github.com/jercle/azgo"
  ).argv

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
