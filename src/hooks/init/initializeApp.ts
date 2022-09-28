import { Hook } from '@oclif/core'
import { existsSync, mkdirSync } from 'fs'

import { initCache } from '../../funcs/azgoCaching.js'

import listSubscriptions from '../../funcs/listSubscriptions.js'

const hook: Hook<'init'> = async function (opts) {

  // initCache()

  let activeSubscription = listSubscriptions().default.subscriptionId

  initCache(process.env.XDG_CACHE_HOME, activeSubscription)

  // process.stdout.write(`example hook running ${opts.id}\n`)
  // const config = this.config

  // const subCacheDir = `${config.cacheDir}/${opts.subscriptionId}`
  // console.log(config.cacheDir)
  // console.log(opts)
  // console.log(subCacheDir)
  // try {
  //   if (existsSync("./directory-name")) {
  //     console.log("Directory exists.")
  //   } else {
  //     console.log("Directory does not exist.")
  //   }
  // } catch(e) {
  //   console.log("An error occurred.")
  // }

}

export default hook
