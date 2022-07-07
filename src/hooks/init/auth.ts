import { Hook } from '@oclif/core'
import { DefaultAzureCredential } from '@azure/identity';

const hook: Hook<'init'> = async function (opts) {
  // process.stdout.write(`example hook running ${opts.id}\n`)
  // console.log("Init Auth hook running!")

  // const

  // const response = "test"
}

// global.azCliCredential = new DefaultAzureCredential()

// declare global {
//   const azCliCredential: new DefaultAzureCredential()
// }


export default hook

// TODO: Create custom base class for auth with Azure CLI: https://oclif.io/docs/base_class
