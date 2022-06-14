/**
 * Description
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @return
 */

const { DefaultAzureCredential } = require('@azure/identity');
const { NetworkManagementClient } = require('@azure/arm-network');
const fs = require('fs');

// getNSG({
//   rg: 'dmz-prod-1-net-rg',
//   nsgName: 'dmz-prod-1-vnet1-dmz-prod-grants-ip-NSG',
//   subscriptionId: 'cb45d5d6-bd1e-4016-b146-71bfce35fdbe',
// }).then((r) => console.log(r));

async function getNSG({ rg, nsgName, subscriptionId }) {
  const client = new NetworkManagementClient(
    new DefaultAzureCredential(),
    subscriptionId
  );
  let nsg = await client.networkSecurityGroups.get(rg, nsgName);
  let formattedRules = nsg.securityRules.map((rule) => {
    return (({
      id,
      name,
      description,
      protocol,
      sourcePortRange,
      destinationPortRange,
      sourceAddressPrefix,
      destinationAddressPrefix,
      access,
      priority,
      direction,
    }) => ({
      id,
      name,
      description,
      protocol,
      sourcePortRange,
      destinationPortRange,
      sourceAddressPrefix,
      destinationAddressPrefix,
      access,
      priority,
      direction,
    }))(rule);
  });
  let formattedDefaultRules = nsg.defaultSecurityRules.map((rule) => {
    return (({
      id,
      name,
      description,
      protocol,
      sourcePortRange,
      destinationPortRange,
      sourceAddressPrefix,
      destinationAddressPrefix,
      access,
      priority,
      direction,
    }) => ({
      id,
      name,
      description,
      protocol,
      sourcePortRange,
      destinationPortRange,
      sourceAddressPrefix,
      destinationAddressPrefix,
      access,
      priority,
      direction,
    }))(rule);
  });
  let formattedNSG = (({ id, name, location, tags, subnets }) => ({
    id,
    name,
    location,
    tags,
    subnets,
  }))(nsg);

  // fs.writeFile(
  //   './test.json',
  //   JSON.stringify(
  //     {
  //       ...formattedNSG,
  //       securityRules: formattedRules,
  //       defaultSecurityRules: formattedDefaultRules,
  //     },
  //     null,
  //     2
  //   ),
  //   () => {}
  // );

  return {
    ...formattedNSG,
    securityRules: formattedRules,
    defaultSecurityRules: formattedDefaultRules,
  };
}

module.exports = getNSG;
