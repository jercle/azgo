/**
 * Lists all tenants and subscriptions you have access to
 *
 * @return {array} List of Tenants and their associated subscriptions in current state of AZ CLI
 */
// const os = require("os")
import { homedir } from 'os';
import { readFileSync } from "fs";
const azureProfile = readFileSync(`${homedir()}/.azure/azureProfile.json`).toString().trim();
const { subscriptions } = JSON.parse(azureProfile);
export default function listSubscriptions() {
    // const chalk = await import('chalk')
    const formattedProfile = subscriptions.reduce((all, item, index) => {
        if (item.isDefault) {
            all.default = {
                tenantId: item.tenantId,
                subscriptionId: item.id,
                subscriptionName: item.name,
                username: item.user.name
            };
        }
        if (!all.all) {
            all.all = [];
        }
        if (!all.all[item.tenantId]) {
            all.all[item.tenantId] = [];
        }
        all.all[item.tenantId] = [
            ...all.all[item.tenantId],
            // `${} `
            `${item.id} - ${item.name} - ${item.user.name}`
            // {
            //   subscriptionId: item.id,
            //   subscriptionName: item.name,
            //   username: item.user.name,
            //   isDefault: item.isDefault,
            // },
        ];
        return all;
    }, {});
    // console.log()
    return formattedProfile;
}
