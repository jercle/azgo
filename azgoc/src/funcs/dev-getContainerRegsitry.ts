import { ContainerRegistryManagementClient } from '@azure/arm-containerregistry'
import { DefaultAzureCredential } from '@azure/identity'
import { readFileSync, writeFileSync } from 'fs'
import { homedir } from 'os'

const activeSubscription = JSON.parse(readFileSync(`${homedir()}/.azure/azureProfile.json`)
  .toString()
  .trim())
  .subscriptions
  .filter(sub => sub.isDefault)[0]

const client = new ContainerRegistryManagementClient(new DefaultAzureCredential(), activeSubscription.id);

const regFetch = await client.registries.list()

// console.log(registries)

let registries = []

for await (const regsistry of regFetch) {
  registries = [...registries, regsistry]
}

console.log(registries)

// console.log(await client.registries.get("DMZ-NonProd-Dev-RG", "DMZNonProdDevACR01"))

// writeFileSync('/Users/jercle/git/azgo/testData/20220622/getContainerRegistry-Prod.json', JSON.stringify(registries, null, 2))





// /**
//  * Lists all tenants and subscriptions you have access to
//  *
//  * @return {array} List of Tenants and their associated subscriptions in current state of AZ CLI
//  */

// // const os = require("os")
// import { homedir } from 'os'

// import { readFileSync } from "fs"

// const azureProfile = readFileSync(`${homedir()}/.azure/azureProfile.json`).toString().trim()
// const { subscriptions } = JSON.parse(azureProfile)

// export default function listSubscriptions() {
//   const formattedProfile = subscriptions.reduce(
//     (all, item, index) => {
//       if (!all[item.tenantId]) {
//         all[item.tenantId] = []
//       }
//       all[item.tenantId] = [
//         ...all[item.tenantId],
//         {
//           subscriptionId: item.id,
//           subscriptionName: item.name,
//           username: item.user.name,
//           isDefault: item.isDefault,
//         },
//       ]
//       return all
//     },
//     {}
//   )
//   // console.log()
//   return formattedProfile
// }
