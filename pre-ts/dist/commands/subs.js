import { Flags } from '@oclif/core';
import AzureCommand from "../baseAzure.js";
import selectActiveSubscription from "../funcs/selectActiveSubscription.js";
class Subs extends AzureCommand {
    async run() {
        const { args, flags } = await this.parse(Subs);
        // console.log(flags)
        // checkCache(flags, null, this.config)
        // console.log(this.azCliCredential)
        const subs = await Subs.subscriptions;
        if (flags.showActive) {
            console.log(subs.default);
            process.exit();
        }
        flags.setActive ? selectActiveSubscription() : console.log(subs.all);
    }
}
Subs.description = `Display current configured Azure CLI subscriptions.
  Lists subscriptinos, grouped by Tenant ID`;
Subs.examples = [
// 'azgoc subs',
// 'azgoc subs --setActive',
// 'azgoc subs -s',
// 'azgoc subs --showActive',
// 'azgoc subs -a'
];
Subs.flags = {
    ...AzureCommand.flags,
    "showActive": Flags.boolean({
        char: 'a',
        exclusive: ['setActive'],
        description: "Show current active subscription for Azure CLI"
    }),
    "setActive": Flags.boolean({
        char: 'x',
        description: "Set active subscription for Azure CLI",
        exclusive: ['showActive']
    }),
};
Subs.args = {};
export default Subs;
