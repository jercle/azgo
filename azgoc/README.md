AZGO
=================

Extends the functionality, UX, and data aggregation of the Azure CLI.

<!-- [![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json) -->

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g azgo
$ azgoc COMMAND
running command...
$ azgoc (--version)
azgo/0.0.4 darwin-arm64 node-v18.4.0
$ azgoc --help [COMMAND]
USAGE
  $ azgoc COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`azgoc acr list`](#azgoc-acr-list)
* [`azgoc acr repos list`](#azgoc-acr-repos-list)
* [`azgoc acr vulns`](#azgoc-acr-vulns)
* [`azgoc commands`](#azgoc-commands)
* [`azgoc generate azure app`](#azgoc-generate-azure-app)
* [`azgoc generate azure platform`](#azgoc-generate-azure-platform)
* [`azgoc help [COMMAND]`](#azgoc-help-command)
* [`azgoc subs`](#azgoc-subs)

## `azgoc acr list`

describe the command here

```
USAGE
  $ azgoc acr list

DESCRIPTION
  describe the command here

EXAMPLES
  $ azgoc acr list
```

## `azgoc acr repos list`

Get all container vulnerabilities

```
USAGE
  $ azgoc acr repos list -a <value> [-o <value>] [-m] [-r]

FLAGS
  -a, --acrRegistry=<value>  (required) ACR registry to use
  -m, --includeManifests     Include manifests in output
  -o, --outfile=<value>      Save output to file
  -r, --resyncData           Resync data from Azure

DESCRIPTION
  Get all container vulnerabilities

EXAMPLES
  $ azgoc acr repos list
```

## `azgoc acr vulns`

Get all vulnerabilities related to container images

```
USAGE
  $ azgoc acr vulns [-s <value>] [-r <value>] [-a <value>] [--resyncData] [-f <value>] [-T ] [-C ] [-l |  | -g
    repository|category|severity|patchable|os|osDetails|imageDigest|cve|byRepoUnderCve | [-d -c -o <value>]] [-U] [-S
    <value>]

FLAGS
  -C, --formatCsv                   Show output as CSV
  -S, --dbConnectionString=<value>  Connection string for Database
  -T, --formatTable                 Format output as a table
  -U, --uploadToDb                  Upload to MongoDB Database
  -a, --acrRegistry=<value>         Name of the ACR.
                                    If not supplied, will select ACR in the subscription, or list them if there are
                                    multiple
  -c, --showCounts                  Show counts of vulnerabilities only, no detailed information.
  -d, --detailedOutput              When used with the --showCounts -c flag, saves detailed information to output file
                                    instead of just counts
  -f, --filter=<value>...           [default: ] Fiter results to specific attribute values
                                    Example: 'severity:high,medium', 'os:linux', patchable:true
  -g, --groupBy=<option>            Group CVEs by provided attribute
                                    <options:
                                    repository|category|severity|patchable|os|osDetails|imageDigest|cve|byRepoUnderCve>
  -l, --listAllCves                 List all CVEs found in assessed ACR
  -o, --outfile=<value>             Save output to file
  -r, --resourceGroup=<value>       Resource Group associate with the ACR
                                    If not supplied, will attempt to acquire from ACR's ID string
  -s, --subscriptionId=<value>      [default: 23310d40-a0d5-4446-8433-d0e6b151c2ab]
                                    Subscription ID to use.
                                    If not supplied, will use current active Azure CLI subscription.
  --resyncData                      Resync data from Azure

DESCRIPTION
  Get all vulnerabilities related to container images

EXAMPLES
  $ azgoc acr vulns

FLAG DESCRIPTIONS
  -c, --showCounts  Show counts of vulnerabilities only, no detailed information.

    Show counts of vulnerabilities only, no detailed information.

    Note: Detailed information will still be output to file if the --detailedOutput -d flag is used

    Note: This flag does not currently function when grouping 'byRepoUnderCve'

  -g, --groupBy=repository|category|severity|patchable|os|osDetails|imageDigest|cve|byRepoUnderCve

    Group CVEs by provided attribute

    Only display counts of vulnerabilities, grouped by provided countByAttribute
    Possible attributes include:
    repository: Group by repository name
    category: Can group by values such as 'Windows', 'Ubuntu', 'Debian', etc.
    severity: Severity of vulnerability, such as 'High', 'Medium', 'Low', etc.
    patchable: Whether or not the vulnerability is patchable
    os: Operating System of affected container. e.g. 'Windows', 'Linux'
    osDetails: Operating System details, e.g. 'Windows Server 2016', 'Ubuntu 16.04', etc.
    imageDigest: Group by image digest
    cve: Groups by CVE
    byRepoUnderCve: Groups by CVE, then by repository name. Example:
    ...},
    'CVE-2022-32230': {
    repo1: [ [Object] ],
    repo2: [ [Object], [Object] ],
    repo3: [ [Object], [Object], [Object], [Object], [Object] ]
    },
    'CVE-2022-30131': {
    ...
```

## `azgoc commands`

list all the commands

```
USAGE
  $ azgoc commands [--json] [-h] [--hidden] [--tree] [--columns <value> | -x] [--sort <value>] [--filter
    <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help         Show CLI help.
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --hidden           show hidden commands
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)
  --tree             show tree of commands

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  list all the commands
```

_See code: [@oclif/plugin-commands](https://github.com/oclif/plugin-commands/blob/v2.2.0/src/commands/commands.ts)_

## `azgoc generate azure app`

Create Azure pipeline and armconfig files from template

```
USAGE
  $ azgoc generate azure app [-n <value>]

FLAGS
  -n, --name=<value>  Name of Application

DESCRIPTION
  Create Azure pipeline and armconfig files from template

EXAMPLES
  $ azgoc generate azure app
```

## `azgoc generate azure platform`

Create Azure pipeline and armconfig files from template

```
USAGE
  $ azgoc generate azure platform -n <value> -e <value> [-s <value>] [-b <value>] [-d <value>] [-i]

FLAGS
  -b, --baseName=<value>
      Base name of the application.
      Eg: "DMZ" or "PROD".
      Creates naming convention of <baseName>-<envName>-<subEnv>-<appName>
      If not specified, will be left out of the resource names

  -d, --subEnvironments=<value>
      Sub Environment of the application.
      Eg: "NonProd" or "Prod".
      Can be used for creating names such as:
      Web-NonProd-Dev-AppName
      Web-NonProd-Test-AppName
      Web-Prod-Prod-AppName
      Creates naming convention of <baseName>-<envName>-<subEnv>-<appName>
      If not specified, will be left out of the resource names

  -e, --appEnvironemnts=<value>
      (required) Comma separated list of application environments to build.
      Eg: dev,prod
      At least one is required as this creates the pipeline and
      variable files per environment provided

  -i, --ignoreDuplicates
      Ignore duplicate names
      Eg: 'Web-Prod-Prod-AppName' would become 'Web-Prod-AppName'

  -n, --name=<value>
      (required) Name of application

  -s, --subscriptionId=<value>
      [default: 23310d40-a0d5-4446-8433-d0e6b151c2ab]
      Subscription ID to use.
      If not supplied, will use current active Azure CLI subscription.

DESCRIPTION
  Create Azure pipeline and armconfig files from template

EXAMPLES
  $ azgoc generate azure platform
```

## `azgoc help [COMMAND]`

Display help for azgoc.

```
USAGE
  $ azgoc help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for azgoc.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `azgoc subs`

Display current configured Azure CLI subscriptions

```
USAGE
  $ azgoc subs [-s]

FLAGS
  -s, --setActive  Set active subscription for Azure CLI

DESCRIPTION
  Display current configured Azure CLI subscriptions

EXAMPLES
  $ azgoc subs

  $ azgoc subs --setActive
```

_See code: [dist/commands/subs.ts](https://github.com/jercle/azgo/blob/v0.0.4/dist/commands/subs.ts)_
<!-- commandsstop -->
