/**
 * Lists all tenants and subscriptions you have access to
 *
 * @return {array} List of Tenants and their associated subscriptions in current state of AZ CLI
 */

// const os = require("os")
import * as os from 'os'

import { readFileSync } from "fs"
// const azCliProfile = require(`${os.homedir()}/.azure/azureProfile.json`)
const azureProfilePath = `${os.homedir()}/.azure/azureProfile.json`
const { installationId, subscriptions } = JSON.parse(readFileSync(azureProfilePath).toString())

export default function listSubscriptions() {
  const formattedProfile = subscriptions.reduce(
    (all, item, index) => {
      if (!all[item.tenantId]) {
        all[item.tenantId] = []
      }
      all[item.tenantId] = [
        ...all[item.tenantId],
        {
          subscriptionId: item.id,
          subscriptionName: item.name,
          username: item.user.name,
          isDefault: item.isDefault,
        },
      ]
      return all
    },
    {}
  )
  // console.log()
  return formattedProfile
}
