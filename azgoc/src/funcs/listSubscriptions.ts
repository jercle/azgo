/**
 * Lists all tenants and subscriptions you have access to
 *
 * @return {array} List of Tenants and their associated subscriptions in current state of AZ CLI
 */

// const os = require("os")
import { homedir } from 'os'

import { readFileSync } from "fs"

const azureProfile = readFileSync(`${homedir()}/.azure/azureProfile.json`).toString().trim()
const { subscriptions } = JSON.parse(azureProfile)

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
