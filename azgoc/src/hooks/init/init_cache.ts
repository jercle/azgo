import {Hook} from '@oclif/core'

const hook: Hook<'init'> = async function (opts) {
  // process.stdout.write(`example hook running ${opts.id}\n`)
  process.stdout.write(`example hook running TESTING\n`)
  console.log('test')
}

export default hook
