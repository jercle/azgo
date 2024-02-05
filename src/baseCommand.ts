import { Command, Flags } from '@oclif/core'

export default abstract class extends Command {
  // this.auth = 'testing'
  // auth = 'testing'
  // static flags = {
  //   loglevel: Flags.string({options: ['error', 'warn', 'info', 'debug']})
  // }
  public static enableJsonFlag = true
  static baseFlags = {
    // interactive: Flags.boolean({
    //   char: 'i',
    //   description: 'Run command in interactive mode',
    //   helpGroup: 'GLOBAL'
    // }),
    debug: Flags.boolean({
      description: "Testing only. Returns CLI config and, and some other debug info",
      helpGroup: 'GLOBAL'
      // hidden: true
    }),
  };
}
