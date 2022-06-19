oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g azgoc
$ azgoc COMMAND
running command...
$ azgoc (--version)
azgoc/0.0.0 darwin-arm64 node-v16.15.1
$ azgoc --help [COMMAND]
USAGE
  $ azgoc COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`azgoc help [COMMAND]`](#azgoc-help-command)
* [`azgoc plugins`](#azgoc-plugins)
* [`azgoc plugins:install PLUGIN...`](#azgoc-pluginsinstall-plugin)
* [`azgoc plugins:inspect PLUGIN...`](#azgoc-pluginsinspect-plugin)
* [`azgoc plugins:install PLUGIN...`](#azgoc-pluginsinstall-plugin-1)
* [`azgoc plugins:link PLUGIN`](#azgoc-pluginslink-plugin)
* [`azgoc plugins:uninstall PLUGIN...`](#azgoc-pluginsuninstall-plugin)
* [`azgoc plugins:uninstall PLUGIN...`](#azgoc-pluginsuninstall-plugin-1)
* [`azgoc plugins:uninstall PLUGIN...`](#azgoc-pluginsuninstall-plugin-2)
* [`azgoc plugins update`](#azgoc-plugins-update)
* [`azgoc subs`](#azgoc-subs)

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

## `azgoc plugins`

List installed plugins.

```
USAGE
  $ azgoc plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ azgoc plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `azgoc plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ azgoc plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ azgoc plugins add

EXAMPLES
  $ azgoc plugins:install myplugin 

  $ azgoc plugins:install https://github.com/someuser/someplugin

  $ azgoc plugins:install someuser/someplugin
```

## `azgoc plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ azgoc plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ azgoc plugins:inspect myplugin
```

## `azgoc plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ azgoc plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ azgoc plugins add

EXAMPLES
  $ azgoc plugins:install myplugin 

  $ azgoc plugins:install https://github.com/someuser/someplugin

  $ azgoc plugins:install someuser/someplugin
```

## `azgoc plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ azgoc plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ azgoc plugins:link myplugin
```

## `azgoc plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ azgoc plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ azgoc plugins unlink
  $ azgoc plugins remove
```

## `azgoc plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ azgoc plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ azgoc plugins unlink
  $ azgoc plugins remove
```

## `azgoc plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ azgoc plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ azgoc plugins unlink
  $ azgoc plugins remove
```

## `azgoc plugins update`

Update installed plugins.

```
USAGE
  $ azgoc plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

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

_See code: [dist/commands/subs.ts](https://github.com/jercle/azgo/blob/v0.0.0/dist/commands/subs.ts)_
<!-- commandsstop -->
