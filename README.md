AZGO
=================

Extends the functionality, UX, and data aggregation of the Azure CLI.

- [AZGO](#azgo)
  - [Function of this CLI](#function-of-this-cli)
  - [Simple example](#simple-example)
    - [Set current active subscription](#set-current-active-subscription)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Authentication](#authentication)
- [Usage](#usage)

## Function of this CLI
This CLI has been created to add additional functionality to [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/) such as data aggregation from multiple `az` commands, reporting, and pulling data from both Azure DevOps and Azure.

Some of the reporting functionality is around container vulnerability scanning with the ability to install a web portal as an Azure Web App in development

This CLI is still very much under development, and functions with the `test-` or `dev-` prefixes are considered mid-development

Any help with testing would be greatly appreciated, as that area is my biggest weakness.

## Simple example
### Set current active subscription
Provides a UI wrapper over `az account set --subscription` to select current active subscription. Gives a list of available subscriptions without the need to find the required ID and paste into a flag. This does change the active subscription for Azure CLI

```bash
azgo subs -s
```
![package](https://user-images.githubusercontent.com/10472533/176458369-1ce98ace-7cb8-45ca-a40a-5ecbde21f7dd.gif)


## Prerequisites
[Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) must be installed and logged in.
For any Azure DevOps functions, a Personal Access Token must be set at AZURE_DEVOPS_EXT_PAT environment variable

You can obtain a Personal Access Token from https://dev.azure.com/YOUR_ORGANIZATION/_usersSettings/tokens

Then set the token as your environment variable using the following:
Linux/macOS:
```bash
export AZURE_DEVOPS_EXT_PAT=TOKEN
```
Windows CMD:
```cmd
set AZURE_DEVOPS_EXT_PAT=TOKEN
```
Winows Powershell:
```powershell
$env:AZURE_DEVOPS_EXT_PAT=TOKEN"
```

## Installation

First clone the repo
```bash
git clone git@github.com:jERCle/azgo.git
```

CD to repositoriy then install dependencies
```bash
cd azgo && npm install
```

Use npm link `azgo` to link to newmain.js
```bash
npm link
```

## Authentication
You must be logged in with `azure cli` as this uses the authentication provided by the user currently logged into Azure CLI

For Azure DevOps functionality, you must have a Personal Access Token saved to AZURE_DEVOPS_EXT_PAT environment variable as per [Function of this CLI](#function-of-this-cli)


# Usage
<!-- usage -->
```sh-session
$ npm install -g azgo
$ azgo COMMAND
running command...
$ azgo (--version)
azgo/0.0.7 darwin-arm64 node-v18.9.1
$ azgo --help [COMMAND]
USAGE
  $ azgo COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`azgo acr repos list`](#azgo-acr-repos-list)
* [`azgo acr repos purge`](#azgo-acr-repos-purge)
* [`azgo acr vulns`](#azgo-acr-vulns)
* [`azgo boards`](#azgo-boards)
* [`azgo commands`](#azgo-commands)
* [`azgo generate azure app`](#azgo-generate-azure-app)
* [`azgo generate azure platform`](#azgo-generate-azure-platform)
* [`azgo help [COMMAND]`](#azgo-help-command)
* [`azgo subs`](#azgo-subs)

## `azgo acr repos list`

Get all container vulnerabilities

```
USAGE
  $ azgo acr repos list -a <value> [--json] [--debug] [-s <value>] [-o <value>] [-m] [-r]

FLAGS
  -a, --acrRegistry=<value>  (required) ACR registry to use
  -m, --includeManifests     Include manifests in output
  -o, --outfile=<value>      Save output to file
  -r, --resyncData           Resync data from Azure

GLOBAL AZURE FLAGS
  -s, --subscriptionId=<value>  Subscription ID to use.
                                If not supplied, will use current active Azure CLI subscription.

GLOBAL FLAGS
  --debug  Testing only. Returns CLI config and, and some other debug info
  --json   Format output as json.

DESCRIPTION
  Get all container vulnerabilities

EXAMPLES
  $ azgo acr repos list
```

## `azgo acr repos purge`

Purges old container images from ACR

```
USAGE
  $ azgo acr repos purge [--executeDelete] [-r <value>]

FLAGS
  -r, --retentionDays=<value>  [default: 30] Only purge images older than number of days provided
  --executeDelete              Runs the deletion of images

DESCRIPTION
  Purges old container images from ACR
```

## `azgo acr vulns`

Get all vulnerabilities related to container images

```
USAGE
  $ azgo acr vulns [--json] [--debug] [-s <value>] [-r <value>] [-a <value>] [--resyncData] [-f <value>] [-T ]
    [-C ] [-l |  | -g repository|category|severity|patchable|os|osDetails|imageDigest|cve|byRepoUnderCve | [-d -c -o
    <value>]] [-U] [-S <value>]

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
  --resyncData                      Resync data from Azure to cache, and optionally (with -U) upload to MongoDB

GLOBAL AZURE FLAGS
  -s, --subscriptionId=<value>  Subscription ID to use.
                                If not supplied, will use current active Azure CLI subscription.

GLOBAL FLAGS
  --debug  Testing only. Returns CLI config and, and some other debug info
  --json   Format output as json.

DESCRIPTION
  Get all vulnerabilities related to container images

EXAMPLES
  $ azgo acr vulns

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

## `azgo boards`

Azure DevOps Boards related commands

```
USAGE
  $ azgo boards -o <value> [--json] [--debug] [-i <value> | -l] [-u <value>] [-c ] [-g state|type ] [-t
    bug|task|decision|epic|feature|impediment|pbi|risk ] [--closed | [-s todo|inprogress|done|removed|new|approved|commi
    tted|considered|identify|analyse|evaluate|treat|monitor|open|closed|all ] |  | --all]

FLAGS
  -c, --onlyCount
      Only show count of items

  -g, --groupBy=<option>
      Group by state or type
      <options: state|type>

  -i, --id=<value>
      ID of the work item to display

  -l, --list
      List all work items assigned to given user

  -s, --filterState=<option>...
      Filter on state.
      By default, returns work items in all open states

      Can optionally use --closed (Only closed) or --all (all states)
      <options: todo|inprogress|done|removed|new|approved|committed|considered|identify|analyse|evaluate|treat|monitor|ope
      n|closed|all>

  -t, --filterType=<option>...
      Filter on type
      <options: bug|task|decision|epic|feature|impediment|pbi|risk>

  -u, --user=<value>
      User's full name or Email address used for Azure DevOps login
      "John Smith" or "john.smith@org.com.au" to filter by assignment

      NOTE: If not provided, email address used with current active subscription will be used.
      This can be found or changed with the "azgo subs" command.

  --all
      Return all work items in ANY state

  --closed
      Return all work items in any CLOSED state

GLOBAL AZURE DEVOPS FLAGS
  -o, --organization=<value>  (required) Organization to use for Azure DevOps related commands
                              NOTE: Can also be set using AZGO_DEVOPS_ORG environment variable

GLOBAL FLAGS
  --debug  Testing only. Returns CLI config and, and some other debug info
  --json   Format output as json.

DESCRIPTION
  Azure DevOps Boards related commands

  Current functionality is listing all items, with some filtering

EXAMPLES
  $ azgo boards
```

_See code: [dist/commands/boards.ts](https://github.com/jercle/azgo/blob/v0.0.7/dist/commands/boards.ts)_

## `azgo commands`

list all the commands

```
USAGE
  $ azgo commands [--json] [-h] [--hidden] [--tree] [--columns <value> | -x] [--sort <value>] [--filter
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

## `azgo generate azure app`

Create Azure pipeline and armconfig files from template

```
USAGE
  $ azgo generate azure app [-n <value>]

FLAGS
  -n, --name=<value>  Name of Application

DESCRIPTION
  Create Azure pipeline and armconfig files from template

EXAMPLES
  $ azgo generate azure app
```

## `azgo generate azure platform`

Create Azure pipeline and armconfig files from template

```
USAGE
  $ azgo generate azure platform -n <value> -e <value> [-s <value>] [-b <value>] [-d <value>] [-i]

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
  $ azgo generate azure platform
```

## `azgo help [COMMAND]`

Display help for azgo.

```
USAGE
  $ azgo help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for azgo.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.14/src/commands/help.ts)_

## `azgo subs`

Display current configured Azure CLI subscriptions.

```
USAGE
  $ azgo subs [--json] [--debug] [-s <value>] [-a | -x]

FLAGS
  -a, --showActive  Show current active subscription for Azure CLI
  -x, --setActive   Set active subscription for Azure CLI

GLOBAL AZURE FLAGS
  -s, --subscriptionId=<value>  Subscription ID to use.
                                If not supplied, will use current active Azure CLI subscription.

GLOBAL FLAGS
  --debug  Testing only. Returns CLI config and, and some other debug info
  --json   Format output as json.

DESCRIPTION
  Display current configured Azure CLI subscriptions.

  Lists subscriptinos, grouped by Tenant ID
```

_See code: [dist/commands/subs.ts](https://github.com/jercle/azgo/blob/v0.0.7/dist/commands/subs.ts)_
<!-- commandsstop -->
