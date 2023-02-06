import { Hook } from '@oclif/core'
import { existsSync, mkdirSync } from 'fs'

import { initCache } from '../../funcs/azgoCaching.js'
import { initConfig } from '../../funcs/azgoUtils.js'

import listSubscriptions from '../../funcs/listSubscriptions.js'

const hook: Hook<'init'> = async function (opts) {

  // initCache()

  let activeSubscription = listSubscriptions().default.subscriptionId

  process.env.XDG_CACHE_HOME ? initCache(process.env.XDG_CACHE_HOME, activeSubscription) : initCache(this.config.cacheDir, activeSubscription)
  // process.env.XDG_CACHE_HOME ? console.log('XDG_CACHE_HOME') : console.log('this.config.cacheDir')
  process.env.XDG_CONFIG_HOME ? initConfig(process.env.XDG_CONFIG_HOME) : initConfig(this.config.configDir)
  // process.env.XDG_CACHE_HOME ? console.log('XDG_CONFIG_HOME') : console.log('this.config.configDir')

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
