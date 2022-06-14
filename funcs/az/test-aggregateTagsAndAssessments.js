/**
 * Description
 *
 * @param {string} appEnv - App's Environment (dev, test, or prod)
 * @param {string} appName - Application Name as used within Azure
 * @param {string} azCliCredential - Credential received from Azure CLI
 * @return
 */
const { PromisePool } = require("@supercharge/promise-pool")
const { DefaultAzureCredential } = require("@azure/identity")
const { SecurityCenter } = require("@azure/arm-security")
const getSubAssessments = require("./test-getSubAssessments")
// const getContainerRespository = require("./test-getContainerRepository")

const { writeFileSync, readFileSync, write } = require("fs")
const { CosmosClient } = require("@azure/cosmos")
// const getAllContainerRepositories = require("./test-getAllContainerRepositories")
const getContainerRepositoryFromDigest = require("./test-getContainerRepositoryFromDigest")
const { MongoClient } = require("mongodb")
const {
  ContainerRegistryClient,
  KnownContainerRegistryAudience,
} = require("@azure/container-registry")

// $r = Invoke-WebRequest -Uri https://management.azure.com/subscriptions/23310d40-a0d5-4446-8433-d0e6b151c2ab/resourcegroups?api-version=2016-09-01 -Method GET -Headers $authHeaders
// $r.Headers["x-ms-ratelimit-remaining-subscription-reads"]



const opts = {
  subscriptionId: "23310d40-a0d5-4446-8433-d0e6b151c2ab",
  resourceGroup: "DMZ-NonProd-Dev-RG",
  acrName: "dmznonproddevacr01",
  assessmentName: "dbd0cb49-b563-45e7-9724-889e799fa648",
}

const opts = {
  acrRegistry: "https://stkcatacr.azurecr.io",
  subscriptionId: "bae338c7-6098-4d52-b173-e2147e107dfa",
  repoName: "gm",
  imageRetention: 30,
  resourceGroup: "DefaultResourceGroup-EAU",
  acrName: "stkcatacr",
  assessmentName: "dbd0cb49-b563-45e7-9724-889e799fa648",
}

aggregateTagsAndAssessments(opts, new DefaultAzureCredential())
// aggregateTagsAndAssessments()

async function aggregateTagsAndAssessments({ acrName }, credentials) {
  const dbClient = new MongoClient(
    "mongodb://"
  )
  const acrClient = new ContainerRegistryClient(
    `https://${acrName}.azurecr.io`,
    credentials,
    {
      audience: KnownContainerRegistryAudience.AzureResourceManagerPublicCloud,
    }
  )

  await dbClient.connect()

  const containerVulnerabilities = dbClient.db("containerVulnerabilities")
  const windowsVulnsCollection = containerVulnerabilities.collection("windows")

  // dbClient.close()

  // const subAssessments = await getSubAssessments(opts, credentials)
  // // const repos = await getAllContainerRepositories(opts, credentials)
  // writeFileSync(
  //   "../testData/aggregateTagsAndAssessments-subAssessments-env.json",
  //   JSON.stringify(subAssessments)
  // )
  // console.log(subAssessments)
  // writeFileSync(
  //   "../testData/aggregateTagsAndAssessments-repos-env.json",
  //   JSON.stringify(repos)
  // )
  // let subAssessments = JSON.parse(
  //   readFileSync("../testData/aggregateTagsAndAssessments-subAssessments.json")
  // )
  let subAssessments = JSON.parse(
    readFileSync(
      "../testData/aggregateTagsAndAssessments-subAssessments-env.json"
    )
  )

  // console.log(subAssessments)

  // var bulk = db.items.initializeUnorderedBulkOp();
  // let bulkWindowsVuln = windowsVulnsCollection.initializeUnorderedBulkOp()
  // bulk.find({ item: "abc123" }).upsert().replaceOne({})

  // formattedWindowsVulns.forEach(async (vuln) => {
  // console.log(vuln)
  // await bulkWindowsVuln.find({ _id: vuln._id }).upsert().replaceOne(vuln)
  // })

  // await bulkWindowsVuln.execute().then((d) => console.log(d))
  // formattedWindowsVulns.reduce((all, item, index)

  // let data = await container.items.readAll().fetchAll()
  // console.log(data)
  // console.log(JSON.stringify(windowsVulns))
  // let blankCategory = subAssessments.filter((a) => a.category === undefined)
  // console.log(JSON.stringify(blankCategory))
  // let blankStatus = subAssessments.filter((a) => a.status.severity === "High")
  // console.log(JSON.stringify(blankStatus))
  // console.log(JSON.stringify(subAssessments))
  // const repo = JSON.parse(
  //   readFileSync("../testData/aggregateTagsAndAssessments-repos.json")
  // )
  // const repos = JSON.parse(
  //   readFileSync("../testData/aggregateTagsAndAssessments-repos.json")
  // )
  // console.log(repos)
  // const affectedImages = []
  // console.log(subAssessments)
  // console.log(repo)
  // subAssessments.map((s) => {
  //   console.log({
  //     displayName: s.displayName,
  //     digest: s.additionalData.imageDigest,
  //     // cve: s.additionalData.cve,
  //     severity: s.status.severity,
  //     patchable: s.additionalData.patchable,
  //     repository: s.additionalData.repositoryName,
  //     os: s.additionalData.imageDetails.os,
  //     osDetails: s.additionalData.imageDetails.osDetails,
  //   })
  // })
  // subAssessments = subAssessments.map(async (s) => {
  //   // let affectedTags = getContainerRepositoryFromDigest()
  //   let obj = {
  //     name: s.name,
  //     idPropertiesId: s.idPropertiesId,
  //     displayName: s.displayName,
  //     severity: s.severity,
  //     remediation: s.remediation,
  //     impact: s.impact,
  //     description: s.description,
  //     timeGenerated: s.timeGenerated,
  //     patchable: s.additionalData.patchable,
  //     vendorReferences: s.additionalData.vendorReferences,
  //     repositoryName: s.additionalData.repositoryName,
  //     imageDigest: s.additionalData.imageDigest,
  //     acrRegistry: s.additionalData.registryHost,
  //     imageOs: s.additionalData.imageDetails.os,
  //     imageOsDetails: s.additionalData.imageDetails.osDetails,
  //     cve: s.additionalData.cve,
  //   }
  //   const repo = await getContainerRepositoryFromDigest(obj, credentials)
  //   console.log(repo)
  //   return obj
  // })

  const windowsVulns = subAssessments.filter(
    (a) => a.category && a.category.toLowerCase() === "windows"
  )

  const { results: formattedAssessments, formatErrors } = await PromisePool.for(
    windowsVulns
  )
    .withConcurrency(10)
    .process(async (s, index) => {
      let obj = {
        name: s.name,
        idPropertiesId: s.idPropertiesId,
        displayName: s.displayName,
        severity: s.severity,
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
      // const repo = await getContainerRepositoryFromDigest(
      //   obj,
      //   credentials
      // ).catch((err) => console.log(err))
      // console.log(obj)

      const repo = await acrClient
        .getArtifact(obj.repositoryName, obj.imageDigest)
        .getManifestProperties()
        .catch((err) => console.error(err))

      console.log(repo)
      obj.affectedTags = repo.tags
      return obj
    })
  // console.log(results)
  ////////////////////////////////////////////////////////////////////////////////
  // let formattedAssessments = []

  // for await (s of subAssessments) {
  //   let obj = {
  //     name: s.name,
  //     category: s.category,
  //     idPropertiesId: s.idPropertiesId,
  //     displayName: s.displayName,
  //     severity: s.severity,
  //     remediation: s.remediation,
  //     impact: s.impact,
  //     description: s.description,
  //     timeGenerated: s.timeGenerated,
  //     patchable: s.additionalData.patchable,
  //     vendorReferences: s.additionalData.vendorReferences,
  //     acrRegistry: s.additionalData.registryHost.split(".")[0],
  //     imageOs: s.additionalData.imageDetails
  //       ? s.additionalData.imageDetails.os
  //       : undefined,
  //     imageOsDetails: s.additionalData.imageDetails
  //       ? s.additionalData.imageDetails.osDetails
  //       : undefined,
  //     cve: s.additionalData.cve,
  //     repositoryName: s.additionalData.repositoryName,
  //     imageDigest: s.additionalData.imageDigest,
  //   }
  // console.log(
  //   `Processing ${itemNum} of ${subAssessments.length} - ${obj.repositoryName}`
  // )
  // itemNum++
  // const repo = await getContainerRepositoryFromDigest(obj, credentials).catch(
  //   (err) => console.log(err)
  // )

  // obj.affectedTags = repo.tags
  // formattedAssessments = [...formattedAssessments, obj]
  // }
  // console.log(formattedAssessments)
  writeFileSync(
    "../testData/aggregateTagsAndAssessments-formattedAssessments-env-windows.json",
    JSON.stringify(formattedAssessments)
  )

  // let windowsVulns = formattedAssessments.filter(
  //   (a) => a.category && a.category.toLowerCase() === "windows"
  // )
  // console.log(windowsVulns)

  // const formattedWindowsVulns = windowsVulns.map((vuln) => {
  //   // console.log(vuln.id)
  //   const { id, name, ...formattedVuln } = vuln
  //   formattedVuln.azureId = id
  //   formattedVuln._id = name
  //   // console.log(formattedVuln)
  //   return formattedVuln
  // })
  ////////////////////////////////////////////////////////////////////////////////
  // console.log(subAssessments.map((s) => s.additionalData.imageDetails))
  // console.log(subAssessments)
  // Get all subAssessments, then check which image tags they relate to.
  // console.log(subAssessments)

  // const windowsDigests = formattedWindowsVulns.reduce((r, a) => {
  //   // console.log(a.imageDigest)
  //   r[`${a.repositoryName}_//_${a.imageDigest}_//_${a.acrRegistry}`] =
  //     (r[`${a.repositoryName}_//_${a.imageDigest}_//_${a.acrRegistry}`] || 0) +
  //     1
  //   return r
  // }, {})

  // console.log(Object.keys(windowsDigests).length)
  // console.log(
  //   windowsDigests[
  //     "sha256:f4dca9d84503549c696323a72e3ba13bddd2d4ef5896e336ecf2dc93453385c3"
  //   ]
  // )
  // console.log(Object.keys(windowsDigests).length)
  // console.log(windowsDigests)

  // const windowsDigestsWithTags = Object.keys(windowsDigests).map(
  //   async (digest, index) => {
  //     const [repositoryName, imageDigest, acrRegistry] = digest.split("_//_")
  //     // console.log(imageDigest)
  //     console.log(
  //       `Processing ${index + 1} of ${
  //         Object.keys(windowsDigests).length
  //       } - ${digest}`
  //     )
  //     const repo = await getContainerRepositoryFromDigest(
  //       { repositoryName, imageDigest, acrRegistry },
  //       credentials
  //     ).catch((err) => console.log(err))
  //     // digest.tags = repo.tags
  //     return {
  //       repositoryName,
  //       imageDigest,
  //       tags: repo.tags,
  //       numCves: windowsDigests[imageDigest],
  //     }
  //   }
  // )
  // console.log(windowsDigestsWithTags)
  dbClient.close()
}

module.exports = aggregateTagsAndAssessments
