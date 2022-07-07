import {Hook} from '@oclif/core'
import { endOfWeekWithOptions } from 'date-fns/fp'

const hook: Hook<'prerun'> = async function (opts) {
  // process.stdout.write(`example hook running ${opts.Command.flags}\n`)
  // process.stdout.write(JSON.stringify(opts.Command.flags.subscriptionId, null, 2))
}

export default hook
