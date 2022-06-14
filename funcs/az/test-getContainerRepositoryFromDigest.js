/**
 * Description
 *
 * @param {String} appEnv - App's Environment (dev, test, or prod)
 * @param {String} appName - Application Name as used within Azure
 * @param {String} azCliCredential - Credential received from Azure CLI
 * @return {Array}
 */

const {
  ContainerRegistryClient,
  KnownContainerRegistryAudience,
} = require("@azure/container-registry")
const { PromisePool } = require("@supercharge/promise-pool")

// // Dev and testing code only //
// const { DefaultAzureCredential } = require("@azure/identity")
// const { readFileSync } = require("fs")
// const opts = {
//   acrRegistry: "",
// }
// //
// windowsVulns = JSON.parse(
//   readFileSync(
//     "../testData/aggregateTagsAndAssessments-formattedAssessments-env-windows.json"
//   )
// )
//
// console.log(
//   windowsVulns.filter((i) => i.name == "09f622b6-4c2b-df3b-d74d-99e1b6e756a9")
// )
//
// let subAssessments = JSON.parse(
//   readFileSync("../testData/aggregateTagsAndAssessments-subAssessments.json")
// )
// getContainerRepositoryFromDigest(opts, new DefaultAzureCredential())
// ////////////////////////////////////////////////////////////
/**
 * Do this thing
 *
 * @async
 * @param  {array<String></String>} acrRegistryies               Oh yeah!
 * @param  {string} azCliCredential             And again
 * @param  {array} dataset                      Same here
 * @param  {boolean} isWindows=true             Test
 */

async function getContainerRepositoryFromDigest(
  acrRegistryies,
  azCliCredential,
  dataset,
  isWindows = true
) {
  // Create new ContainerRegistryClient instance
  const client = new ContainerRegistryClient(
    `https://${acrRegistry[0]}.azurecr.io`,
    azCliCredential,
    {
      audience: KnownContainerRegistryAudience.AzureResourceManagerPublicCloud,
    }
  )

  if (windows) {
    // Uses the PromisePool library to concurrently get tags for all digests
    const { results: formattedAssessments, formatErrors } =
      await PromisePool.for(windowsVulns)
        .withConcurrency(1000)
        .process(async (s, index) => {
          let obj = {
            _id: s.name,
            idPropertiesId: s.idPropertiesId,
            displayName: s.displayName,
            severity: s.status.severity,
            remediation: s.remediation,
            impact: s.impact,
            description: s.description,
            timeGenerated: s.timeGenerated,
            patchable: s.additionalData.patchable,
            vendorReferences: s.additionalData.vendorReferences,
            acrRegistry: s.additionalData.registryHost.split(".")[0],
            imageOs: s.additionalData.imageDetails
              ? s.additionalData.imageDetails.os
              : undefined,
            imageOsDetails: s.additionalData.imageDetails
              ? s.additionalData.imageDetails.osDetails
              : undefined,
            cve: s.additionalData.cve,
            repositoryName: s.additionalData.repositoryName,
            imageDigest: s.additionalData.imageDigest,
          }
          console.log(
            `Processing ${index} of ${windowsVulns.length} - ${obj.repositoryName}`
          )

          // Gets the image manifest from ACR
          const repo = await client
            .getArtifact(obj.repositoryName, obj.imageDigest)
            .getManifestProperties()
            .catch((err) => console.error(err))
          obj.affectedTags = repo.tags
          return obj
        })
    console.log(formattedAssessments)
    return formattedAssessments
  } else {
    throw "Currently only supporting Windows containers"
  }
}

module.exports = getContainerRepositoryFromDigest
