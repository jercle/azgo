import { ContainerRegistryManagementClient } from '@azure/arm-containerregistry'
import { DefaultAzureCredential } from '@azure/identity'
import { readFileSync, writeFileSync } from 'fs'
import { homedir } from 'os'

const azureProfile = readFileSync(`${homedir()}/.azure/azureProfile.json`).toString().trim()
const { subscriptions } = JSON.parse(azureProfile)
const activeSubscription = subscriptions.filter(sub => sub.isDefault)[0]


// getAllContainerRegistries(new DefaultAzureCredential(), activeSubscription.id)


export default async function getAllContainerRegistries({subscriptionId}, azCliCredential) {
  const registries = JSON.parse(readFileSync('/Users/jercle/git/azgo/testData/20220629/getAllContainerRegistries.json').toString().trim())
  // /const client = new ContainerRegistryManagementClient(azCliCredential, subscriptionId);
  // const regFetch = await client.registries.list()
  // let registries = []

  // for await (const regsistry of regFetch) {
  //   registries = [...registries, regsistry]
  // }

  // console.log(registries)
  // writeFileSync('/Users/jercle/git/azgo/testData/20220622/getAllContainerRegistries-NonProd.json', JSON.stringify(registries, null, 2))
  return registries
}


// console.log(await client.registries.get("DMZ-NonProd-Dev-RG", "DMZNonProdDevACR01"))

// writeFileSync('/Users/jercle/git/azgo/testData/20220622/getContainerRegistry-Prod.json', JSON.stringify(registries, null, 2))





// /**
//  * Lists all tenants and subscriptions you have access to
//  *
//  * @return {array} List of Tenants and their associated subscriptions in current state of AZ CLI
//  */

// const os = require("os")
