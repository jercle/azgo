/**
 * Lists all secrets and last updated time for a given App's Environment
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @returns Nothings is returned
 */

const { SecurityCenter } = require("@azure/arm-security")
const { DefaultAzureCredential } = require("@azure/identity")
const { writeFileSync, readFileSync } = require("fs")

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


getAssessments(opts)

async function getAssessments({ subscriptionId }) {
  const assessmentScope = `/subscriptions/${subscriptionId}`
  const client = new SecurityCenter(
    new DefaultAzureCredential(),
    subscriptionId
  )

  // const assessments = client.assessments.list(
  // `/subscriptions/${subscriptionId}`
  // )

  // console.log(client.assessments.list())

  // console.log(assessments)
  // let assessments = []
  // for await (assessment of client.assessments.list(assessmentScope)) {
  //   assessments = [...assessments, assessment]
  // }
  // writeFileSync("../testData/assessments.json", JSON.stringify(assessments))

  // const filtered = assessments.filter((item) =>
  //   item.id.toLowerCase().includes("registry")
  // )
  // console.log(filtered)

  // console.log(assessmentScope)
  // "/providers/Microsoft.Management/managementGroups/DMZ",
  // "9b828565-a0ed-61c2-6bf3-1afc99a9b2ca"
  // console.log(subAssessment)

  let subs = []
  for await (sub of client.subAssessments.list(
    "microsoft.security/assessments/subassessments",
    "dbd0cb49-b563-45e7-9724-889e799fa648"
  )) {
    subs = [
      ...subs,
      sub,
      // {
      //   displayName: sub.displayName,
      //   severity: sub.status.severity,
      //   remediation: sub.remediation,
      //   description: sub.description,
      // },
    ]
  }
  console.log(
    subs.filter(
      (sub) =>
        sub.id ==
        ""
    )
  )
  // writeFileSync(
  //   "../testData/singeSubAssessment.json",
  //   JSON.stringify(
  //     subs.filter(
  //       (sub) =>
  //         sub.id ==
  //         ""
  //     )
  //   )
  // )

  // const subAss = await client.subAssessments.get(
  //   "",
  //   "dbd0cb49-b563-45e7-9724-889e799fa648",
  //   "d3c2dfc7-d54d-8aaf-f48a-de364522ea3a"
  // )
  // console.log(subAss)



  // let is = []
  // for await (i of client.subAssessments.listAll(
  //   ""
  // )) {
  //   is = [...is, i]
  // }
  // const assessments = JSON.parse(readFileSync("../testData/assessments.json"))

  // const subAssessments = JSON.parse(
  //   readFileSync("../testData/subAssessments.json")
  // )

  // const filtered = assessments.filter((item) =>
  //   item.id.toLowerCase().includes("registry")
  // )
  // console.log(filtered)

  // writeFileSync("../testData/subAssessments.json", JSON.stringify(is))

  // const list = client.subAssessments.list(`/subscriptions/${subscriptionId}`)
  //  const env = () => {
  //    switch (appEnv) {
  //      case 'dev':
  //        return 'nonprod-d';
  //        break;
  //      case 'test':
  //        return 'nonprod-t';
  //        break;
  //      case 'prod':
  //        return 'prod';
  //        break;
  //    }
  //  }
  //  const keyVaultUrl = ``;
  //  const client = new SecretClient(keyVaultUrl, azCliCredential);
  //  let secrets = [];
  //  for await (const secretProperties of client.listPropertiesOfSecrets()) {
  //    const secret = await client.getSecret(secretProperties.name);
  //    secrets = [
  //      ...secrets,
  //      {
  //        secretName: secret.name,
  //        createdOn: secret.properties.createdOn,
  //        updatedOn: secret.properties.updatedOn,
  //        id: secret.properties.id,
  //      },
  //    ];
  //  }
  //  console.log(JSON.stringify(secrets, null, 2));
}

module.exports = getAssessments
