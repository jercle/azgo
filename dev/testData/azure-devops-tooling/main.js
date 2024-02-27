#!/usr/bin/env node
const yargonaut = require('yargonaut');
const yargs = require('yargs');

// Can change to an environment variable for use with Azure DevOps
const pat =
  process.env.AZURE_PERSONAL_ACCESS_TOKEN ||
  require('./vars.json').stackcats.pat;

const setupApp = require('./setupApp');
const deleteApp = require('./deleteApp');

require('yargonaut')
  .style('yellow', 'required')
  .helpStyle('green.underline')
  .errorsStyle('red.bold');

const options = yargs
  .usage('create -n <name> [-p <project> -b <defaultBranch>]')
  .usage('delete -name [-p <project>]')
  .check((argv, options) => {
    if (argv._[0] == 'create' || argv._[0] == 'delete') {
      return true; // tell Yargs that the arguments passed the check
    } else {
      throw new Error("Choose either 'create' or 'delete'");
    }
  })
  .command('create', 'Create app in Azure DevOps', (yargs) => {
    return yargs
      .option('name', {
        describe: 'Name of application',
        alias: 'n',
        type: 'string',
        demandOption: true,
      })
      .option('project', {
        describe: 'Project name or Id',
        alias: 'p',
        type: 'string',
        default: 'Legacy DMZ Playground',
      })
      .option('defaultBranch', {
        describe: 'Default branch for repo',
        alias: 'b',
        type: 'string',
        default: 'main',
      });
  })
  .command('delete', 'Delete app in Azure DevOps', (yargs) => {
    return yargs
      .option('name', {
        describe: 'Name of application',
        alias: 'n',
        type: 'string',
        demandOption: true,
      })
      .option('project', {
        describe: 'Project name or Id',
        alias: 'p',
        type: 'string',
        default: 'Legacy DMZ Playground',
      });
  })
  .example('Standard: ado create -n test-app')
  .example('Different Project: ado create -n test-app -p other-project')
  .help()
  .alias('h', 'help')
  .alias('name', 'appName')
  .alias('v', 'version').argv;

const config = {
  organization: 'stackcats',
  project: options.project,
  appName: options.name,
  defaultBranch: 'main',
  pat,
};

options._[0] == 'create' && setupApp(config);
options._[0] == 'delete' && deleteApp(config);
