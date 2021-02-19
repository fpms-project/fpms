fpms-client
===========

fast package manager server for yarn

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/fpms-client.svg)](https://npmjs.org/package/fpms-client)
[![Downloads/week](https://img.shields.io/npm/dw/fpms-client.svg)](https://npmjs.org/package/fpms-client)
[![License](https://img.shields.io/npm/l/fpms-client.svg)](https://github.com/ssh://git@github.com/sh4869/fpms-client.git/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g fpms-client
$ fpms COMMAND
running command...
$ fpms (-v|--version|version)
fpms-client/1.0.0 darwin-x64 node-v14.3.0
$ fpms --help [COMMAND]
USAGE
  $ fpms COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fpms hello [FILE]`](#fpms-hello-file)
* [`fpms help [COMMAND]`](#fpms-help-command)

## `fpms hello [FILE]`

describe the command here

```
USAGE
  $ fpms hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ fpms hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/sh4869/fpms-client/blob/v1.0.0/src/commands/hello.ts)_

## `fpms help [COMMAND]`

display help for fpms

```
USAGE
  $ fpms help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
