import { Command, Flags } from '@oclif/core';
class default_1 extends Command {
}
// this.auth = 'testing'
// auth = 'testing'
// static flags = {
//   loglevel: Flags.string({options: ['error', 'warn', 'info', 'debug']})
// }
default_1.enableJsonFlag = true;
default_1.baseFlags = {
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
export default default_1;
