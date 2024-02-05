import { readFileSync } from 'fs';
import { homedir } from 'os';
import { ContainerRegistryManagementClient } from '@azure/arm-containerregistry';
import { formatISO } from 'date-fns';
const azureProfile = readFileSync(`${homedir()}/.azure/azureProfile.json`).toString().trim();
const { subscriptions } = JSON.parse(azureProfile);
const activeSubscription = subscriptions.filter(sub => sub.isDefault)[0];
// console.log('testing')
export default async function getAllContainerRegistries({ subscriptionId }, azCliCredential) {
    // console.log(subscriptionId)
    // const registries = JSON.parse(readFileSync(`/Users/jercle/git/azgo/testData/20220629/${subscriptionId}/getAllContainerRegistries.json`).toString().trim())
    const client = new ContainerRegistryManagementClient(azCliCredential, subscriptionId);
    const regFetch = await client.registries.list();
    let registries = [];
    for await (const regsistry of regFetch) {
        registries = [...registries, regsistry];
    }
    // console.log(registries)
    // console.log('test')
    // writeFileSync('/Users/jercle/git/azgo/testData/20220622/getAllContainerRegistries-NonProd.json', JSON.stringify(registries, null, 2))
    const response = {
        azgoSyncDate: formatISO(new Date()),
        data: registries,
    };
    return response;
}
// getAllContainerRegistries({subscriptionId: process.env.AZGO_SUBSCRIPTION_ID}, new DefaultAzureCredential())
// console.log(await client.registries.get("DMZ-NonProd-Dev-RG", "DMZNonProdDevACR01"))
// writeFileSync('/Users/jercle/git/azgo/testData/20220622/getContainerRegistry-Prod.json', JSON.stringify(registries, null, 2))
// /**
//  * Lists all tenants and subscriptions you have access to
//  *
//  * @return {array} List of Tenants and their associated subscriptions in current state of AZ CLI
//  */
// const os = require("os")
