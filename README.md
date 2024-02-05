oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g azgo
$ azgo COMMAND
running command...
$ azgo (--version)
azgo/0.0.0 linux-x64 node-v20.11.0
$ azgo --help [COMMAND]
USAGE
  $ azgo COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`azgo hello PERSON`](#azgo-hello-person)
* [`azgo hello world`](#azgo-hello-world)
* [`azgo help [COMMANDS]`](#azgo-help-commands)
* [`azgo plugins`](#azgo-plugins)
* [`azgo plugins:install PLUGIN...`](#azgo-pluginsinstall-plugin)
* [`azgo plugins:inspect PLUGIN...`](#azgo-pluginsinspect-plugin)
* [`azgo plugins:install PLUGIN...`](#azgo-pluginsinstall-plugin-1)
* [`azgo plugins:link PLUGIN`](#azgo-pluginslink-plugin)
* [`azgo plugins:uninstall PLUGIN...`](#azgo-pluginsuninstall-plugin)
* [`azgo plugins reset`](#azgo-plugins-reset)
* [`azgo plugins:uninstall PLUGIN...`](#azgo-pluginsuninstall-plugin-1)
* [`azgo plugins:uninstall PLUGIN...`](#azgo-pluginsuninstall-plugin-2)
* [`azgo plugins update`](#azgo-plugins-update)

## `azgo hello PERSON`

Say hello

```
USAGE
  $ azgo hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/jercle/azgo/blob/v0.0.0/src/commands/hello/index.ts)_

## `azgo hello world`

Say hello world

```
USAGE
  $ azgo hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ azgo hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/jercle/azgo/blob/v0.0.0/src/commands/hello/world.ts)_

## `azgo help [COMMANDS]`

Display help for azgo.

```
USAGE
  $ azgo help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for azgo.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.12/src/commands/help.ts)_

## `azgo plugins`

List installed plugins.

```
USAGE
  $ azgo plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ azgo plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/index.ts)_

## `azgo plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ azgo plugins add plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ azgo plugins add

EXAMPLES
  $ azgo plugins add myplugin 

  $ azgo plugins add https://github.com/someuser/someplugin

  $ azgo plugins add someuser/someplugin
```

## `azgo plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ azgo plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ azgo plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/inspect.ts)_

## `azgo plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ azgo plugins install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ azgo plugins add

EXAMPLES
  $ azgo plugins install myplugin 

  $ azgo plugins install https://github.com/someuser/someplugin

  $ azgo plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/install.ts)_

## `azgo plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ azgo plugins link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ azgo plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/link.ts)_

## `azgo plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ azgo plugins remove plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ azgo plugins unlink
  $ azgo plugins remove

EXAMPLES
  $ azgo plugins remove myplugin
```

## `azgo plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ azgo plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/reset.ts)_

## `azgo plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ azgo plugins uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ azgo plugins unlink
  $ azgo plugins remove

EXAMPLES
  $ azgo plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/uninstall.ts)_

## `azgo plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ azgo plugins unlink plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ azgo plugins unlink
  $ azgo plugins remove

EXAMPLES
  $ azgo plugins unlink myplugin
```

## `azgo plugins update`

Update installed plugins.

```
USAGE
  $ azgo plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.1/src/commands/plugins/update.ts)_
<!-- commandsstop -->
