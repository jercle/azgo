const os = require("os")
const { DefaultAzureCredential } = require("@azure/identity")
const clipboardy = require("clipboardy")
const inquirer = require("inquirer")
let subList
try {
  subList = require(`${os.homedir()}/.azure/azureProfile.json`).subscriptions
} catch (error) {
  console.error("Azure CLI profile doesn't seem to be set up")
  throw new Error(error)
}

const listShareFiles = require("./funcs/az/listShareFiles")
const getSecrets = require("./funcs/az/getSecrets")
const getSubAssessments = require("./funcs/az/getSubAssessments")
const getAppServicePlan = require("./funcs/az/getAppServicePlan")
const listSubscriptions = require("./funcs/az/listSubscriptions")
const getAppService = require("./funcs/az/getAppService")
const selectActiveSubscription = require("./funcs/utility/selectActiveSubscription")

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

require("@jercle/yargonaut")
  .style("yellow", "required")
  .helpStyle("green.underline")
  .errorsStyle("red.bold")

function actOnCli(options) {
  console.log(options)
  switch (options._[0]) {
    case "init":
      options.clearCache && clearCacheConfirm()
      options.showCache && appCache.show()
      break
    case "acr":
      getSubAssessments(options, azCliCredential)
      // console.log("acr")
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
      if (options._[1] == "active") {
        selectActiveSubscription()
      } else {
        let data = listSubscriptions()
        console.log(JSON.stringify(data, null, 2))
        options.c && clipboardy.writeSync(JSON.stringify(data, null, 2))
      }
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
  actOnCli,
  selectSubscription,
}
