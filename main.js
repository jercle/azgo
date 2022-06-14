#!/usr/bin/env node
const yargs = require("yargs")

const { DefaultAzureCredential } = require("@azure/identity")
const azCliCredential = new DefaultAzureCredential()

const listShareFiles = require("./funcs/az/listShareFiles")
const getSecrets = require("./funcs/az/getSecrets")
const getAppServicePlan = require("./funcs/az/getAppServicePlan")
const listSubscriptions = require("./funcs/az/listSubscriptions")
const getAppService = require("./funcs/az/getAppService")

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
      argv._[0] == "subs"
    ) {
      return true // tell Yargs that the arguments passed the check
    } else {
      throw new Error("See above for available commands")
    }
  })
  .usage("ls -n <File Share name> -c <connection string>")
  .usage("secrets -a <App Name> -e <environment>")
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
  .alias("v", "version").argv

options._[0] == "ls" && listShareFiles(options, azCliCredential)
options._[0] == "secrets" && getSecrets(options, azCliCredential)
options._[0] == "asp" && getAppServicePlan(options, azCliCredential)
options._[0] == "subs" && console.log(JSON.stringify(listSubscriptions(), null, 2))
options._[0] == "app" && getAppService(options, azCliCredential)
