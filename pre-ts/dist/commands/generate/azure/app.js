import { Command, Flags } from '@oclif/core';
class GenerateAzureApp extends Command {
    async run() {
        const { args, flags } = await this.parse(GenerateAzureApp);
        // let tpl = readFileSync(`${__dirname}/../../../../templates/azure/app.tpl`, 'utf8')
        console.log('Currently not functional');
    }
}
GenerateAzureApp.description = 'Create Azure pipeline and armconfig files from template';
GenerateAzureApp.examples = [
    '<%= config.bin %> <%= command.id %>',
];
GenerateAzureApp.flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({ char: 'n', description: 'Name of Application' }),
    // flag with no value (-f, --force)
    // force: Flags.boolean({ char: 'f' }),
};
GenerateAzureApp.args = {};
export default GenerateAzureApp;
// inquirer
// .prompt({
//   type: "string",
//   name: "subscriptionId",
//   message: "Choose subscription",
//   choices: subs,
// })
// .then((answer) => {
//   appCache.set("selectedSubscription", answer.subscriptionId)
// })
