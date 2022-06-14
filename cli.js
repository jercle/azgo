const os = require("os")
const yargs = require("yargs")
const { DefaultAzureCredential } = require("@azure/identity")
const clipboardy = require("clipboardy")
const inquirer = require("inquirer")
const subList =
  require(`${os.homedir()}/.azure/azureProfile.json`).subscriptions

const listShareFiles = require("./funcs/az/listShareFiles")
const getSecrets = require("./funcs/az/getSecrets")
const getAppServicePlan = require("./funcs/az/getAppServicePlan")
const listSubscriptions = require("./funcs/az/listSubscriptions")
const getAppService = require("./funcs/az/getAppService")

const { appCache, clearCacheConfirm } = require("./funcs/utility/cache")

const azCliCredential = new DefaultAzureCredential()

const subs = subList.map((sub) => ({
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

require("yargonaut")
  .style("yellow", "required")
  .helpStyle("green.underline")
  .errorsStyle("red.bold")

const options = yargs
  .check((argv, options) => {
    if (
      argv._[0] == "ls" ||
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
        describe: "Directory path within File Share",
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
  .command("subs", "List subscriptions in current AZ CLI profile")
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
    "For more information, see the readme at https://github.com/stkcat/azure-tooling"
  ).argv

function actOnCli() {
  switch (options._[0]) {
    case "init":
      options.clearCache && clearCacheConfirm()
      options.showCache && appCache.show()
      break
    case "ls":
      listShareFiles(options, azCliCredential)
      break
    case "secrets":
      getSecrets(options, azCliCredential)
      break
    case "asp":
      getAppServicePlan(options, azCliCredential)
      break
    case "app":
      getAppService(options, azCliCredential)
      break
    case "subs":
      let data = listSubscriptions()
      console.log(JSON.stringify(data, null, 2))
      options.c && clipboardy.writeSync(JSON.stringify(data, null, 2))
      break
  }
}

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

module.exports = {
  options,
  actOnCli,
  selectSubscription,
}
