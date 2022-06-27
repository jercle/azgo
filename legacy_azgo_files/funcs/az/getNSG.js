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

const opts = {
  subscriptionId: process.env.subscriptionId,
  resourceGroup: process.env.resourceGroup,
  acrName: process.env.acrName,
  assessmentName: process.env.assessmentName,
  nsgName: process.env.nsgName,
  acrRegistry: process.env.acrRegistry,
  testDataPath: process.env.testDataPath
}
// {
//   subscriptionId,
//   resourceGroup,
//   acrName,
//   assessmentName,
//   nsgName,
//   acrRegistry,
//   testDataPath,
// }

// getNSG(opts).then((r) => console.log(r));

async function getNSG({ resourceGroup, nsgName, subscriptionId }) {
  const client = new NetworkManagementClient(
    new DefaultAzureCredential(),
    subscriptionId
  );
  let nsg = await client.networkSecurityGroups.get(resourceGroup, nsgName);
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
