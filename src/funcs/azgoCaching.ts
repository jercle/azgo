import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync } from "fs";

import { formatDistance, formatISO, differenceInHours, differenceInDays, parseISO } from 'date-fns'
import chalk from 'chalk'

import getAllContainerRepositories from './getAllContainerRepositories.js'
import getAllContainerRegistries from './dev-getAllContainerRegistries.js'
import getSubAssessments from './getSubAssessments.js'

const opts = {
  acrRegistry: process.env.AZGO_ACR_REGISTRY,
  outfile: process.env.AZGO_SAVE_FILE,
  includeManifests: process.env.AZGO_INCLUDE_MANIFESTS,
  resyncData: process.env.AZGO_RESYNC_DATA,
  subscriptionId: process.env.AZGO_SUBSCRIPTION_ID,
  cacheDir: '/Users/jercle/Library/Caches/azgo'
}

// const json = getCache('repositories', opts.subscriptionId, opts.cacheDir)

// setCache('repositories', json, '', '/Users/jercle/git/azgo/src/funcs')

/**
* Saves cache to local cache dir.
*
* @param {string} cacheFileName - Name of the cache file to set
* @param {object} data - Data to cache
* @param {string} subscriptionId - Subscription ID for cache subdirectory
* @param {string} cacheDir - Location of local cache directory
* @returns void
*
*/
export function setCache(
  cacheFileName: string,
  data: Object,
  subscriptionId: string,
  cacheDir: string): void {

  writeFileSync(`${cacheDir}/${subscriptionId}/${cacheFileName}.json`, JSON.stringify(data))
}

// console.log()
// getCache('repositories', opts.subscriptionId, opts.cacheDir)

/**
* Gets cached from local cache file
*
* @param {string} cacheFileName - Name of the cache file to set
* @param {string} subscriptionId - Subscription ID for cache subdirectory
* @param {string} cacheDir - Location of local cache directory
* @returns object
*
*/
export function getCache(
  cacheFileName: string,
  subscriptionId: string,
  cacheDir: string): object {
  const cache = JSON.parse(readFileSync(`${cacheDir}/${subscriptionId}/${cacheFileName}.json`)
    .toString()
    .trim())

  const timeSinceSync = formatDistance(parseISO(cache.azgoSyncDate), new Date(), { addSuffix: true })
  const hoursSinceSync = differenceInHours(new Date(), parseISO(cache.azgoSyncDate))

  if (hoursSinceSync > 24) {
    console.log(chalk.magenta(`NOTE: ${cacheFileName[0].toUpperCase() + cacheFileName.substring(1)} cache data stale
      Last sync'd ${hoursSinceSync} hours / ${timeSinceSync}`))
  }
  // console.log({ timeSinceSync, hoursSinceSync })
  return cache
}

// cacheExists(',asgsagasg', 'sagsagsag,', asgsa)

/**
* Checks to see if cache exist for given type:
*
* 'repositories', 'containerRegsitries', 'subAssessments', etc
*
* @param {string} cacheFileName - Name of the cache file to check
* @param {string} subscriptionId - Subscription ID for cache subdirectory
* @param {string} cacheDir - Location of local cache directory
* @returns object
*
*/
export function cacheExists(cacheFileName: string, subscriptionId: string, cacheDir: string) {
  const subCacheDir = `${cacheDir}/${subscriptionId}`
  if (!existsSync(subCacheDir)) {
    return false
  }
  const subscriptionCacheFiles = readdirSync(subCacheDir).map(name => name.toLowerCase())

  return subscriptionCacheFiles.includes(`${cacheFileName.toLowerCase()}.json`)
}

// initCache('/Users/jercle/git/azgo/cache', opts.subscriptionId)


/**
* Initializes the app cache directory
*
* @param {string} subscriptionId - Subscription ID for cache subdirectory
* @param {string} cacheDir - Location of local cache directory
* @returns void
*
*/
export function initCache(cacheDir: string, subscriptionId: string): void {
  const subCacheDir = `${cacheDir}/${subscriptionId}`
  if (!existsSync(subCacheDir)) {
    // console.log(`cache doesn't exist, creating cache for subscriptioon ${opts.subscriptionId}`)
    mkdirSync(subCacheDir, { recursive: true })
    // } else {
    // console.log(`cache exists for subscription ${opts.subscriptionId}`)
  }
}



// checkCache(opts, null, opts)
export async function checkCache(opts, azCliCredential, config, filter = null) {
  const subCacheDir = `${config.cacheDir}/${opts.subscriptionId}`
  // const subCacheDir = `/Users/jercle/git/azgo/cache/${opts.subscriptionId}`
  // console.log(config.cacheDir)
  // console.log(opts.subscriptionId)
  // process.exit()

  // console.log(subCacheDir)

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

  console.log(subscriptionCacheFiles)

  if (filter === 'checkOnly') {
    return { subscriptionCacheFiles, cacheDir: config.cacheDir }
  }



  // console.log('pre if')
  if (filter === 'containerRegsitries') {
    console.log('in if')
    const containerRegsitries = Object.keys(subscriptionCacheFiles).includes('containerRegsitries.json') && !opts.resyncData ?
      JSON.parse(readFileSync(`${config.cacheDir}/containerRegsitries.json`).toString().trim()) :
      await getAllContainerRegistries(opts, azCliCredential)
    return { containerRegsitries }
  }
  // console.log('post if')



  // console.log(subCacheDir)
  // conso
  // const assessmentsCache = existsSync(`${config.cacheDir}/assessments.json`)
  // const repositoriesCache = existsSync(`${config.cacheDir}/repositories.json`)

  // const assessments = opts.assessmentsCache && !opts.resyncData ?
  // JSON.parse(readFileSync(`${config.cacheDir}/assessments.json`).toString().trim()) : []
  // await getSubAssessments(opts, azCliCredential)

  // const repos = opts.repositoriesCache && !opts.resyncData ?
  // JSON.parse(readFileSync(`${config.cacheDir}/repositories.json`).toString().trim()) : []
  // await getAllContainerRepositories(opts, azCliCredential)

  return { assessments: { data: [] }, repos: { data: [] } }
  // return { assessments, repos }
}
