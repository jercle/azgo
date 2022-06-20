import {Hook} from '@oclif/core'
import { writeFileSync } from 'fs'

const hook: Hook<'init'> = async function (opts) {
  process.stdout.write(`example hook running ${opts.id}\n`)

  writeFileSync('./test.txt', 'test')
}

export default hook
