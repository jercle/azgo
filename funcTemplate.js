/**
 * Description
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @return
 */

const { DefaultAzureCredential } = require("@azure/identity")

__name__(opts, new DefaultAzureCredential())

const opts = {
  acrRegistry: "",
  subscriptionId: {
    prod: "",
    nonprod: "",
  },
  appName: "",
  imageRetention: 30,
}

async function __name__({ appEnv, appName }, azCliCredential) {}

module.exports = __name__
