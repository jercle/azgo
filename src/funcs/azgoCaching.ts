import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync } from "fs";

import { formatDistance, formatISO, differenceInHours, differenceInDays, parseISO } from 'date-fns'

import getAllContainerRepositories from './getAllContainerRepositories.js'
import getAllContainerRegistries from './dev-getAllContainerRegistries.js'
import getSubAssessments from './getSubAssessments.js'

export async function checkCache(opts, azCliCredential, config, filter = null) {
  // console.log(config.cacheDir)
  // console.log(opts.subscriptionId)
  // process.exit()
  const subCacheDir = await `${config.cacheDir}/${opts.subscriptionId}`

  console.log(subCacheDir)
  if (!existsSync(subCacheDir)) {
    console.log(`cache doesn't exist, creating cache for subscriptioon ${opts.subscriptionId}`)
    mkdirSync(subCacheDir)
    console.log(existsSync(subCacheDir))
  } else {
    console.log(`cache exists for subscription ${opts.subscriptionId}`)
  }

  const subscriptionCacheFiles = readdirSync(subCacheDir)
    .filter(filename => !filename.includes('.DS_Store'))
    .reduce((all, item, index) => {
      const { azgoSyncDate, data } = JSON.parse(readFileSync(`${subCacheDir}/${item}`)
        .toString()
        .trim())
      all[item] = {
        azgoSyncDate,
        timeSinceSync: formatDistance(parseISO(azgoSyncDate), new Date(), { addSuffix: true }),
        hoursSinceSync: differenceInHours(new Date(), parseISO(azgoSyncDate)),
        objects: data.length
      }
      return all
    }, {})

  if (filter === 'checkOnly') {
    return { subscriptionCacheFiles, cacheDir: config.cacheDir }
  }



  console.log('pre if')
  if (filter === 'containerRegsitries') {
    console.log('in if')
    const containerRegsitries = Object.keys(subscriptionCacheFiles).includes('containerRegsitries.json') && !opts.resyncData ?
      JSON.parse(readFileSync(`${config.cacheDir}/containerRegsitries.json`).toString().trim()) :
      await getAllContainerRegistries(opts, azCliCredential)
    return { containerRegsitries }
  }
  console.log('post if')



  // console.log(subCacheDir)
  // conso
  // const assessmentsCache = existsSync(`${config.cacheDir}/assessments.json`)
  // const repositoriesCache = existsSync(`${config.cacheDir}/repositories.json`)

  const assessments = opts.assessmentsCache && !opts.resyncData ?
    JSON.parse(readFileSync(`${config.cacheDir}/assessments.json`).toString().trim()) :
    await getSubAssessments(opts, azCliCredential)

  const repos = opts.repositoriesCache && !opts.resyncData ?
    JSON.parse(readFileSync(`${config.cacheDir}/repositories.json`).toString().trim()) :
    await getAllContainerRepositories(opts, azCliCredential)

  return { assessments, repos }
}


// saveToCache()
// export async function saveToCache() {
// export async function saveToCache(data, filename) {

// }
