# fpms-client

fast package manager server for yarn

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/fpms-client.svg)](https://npmjs.org/package/fpms-client)
[![Downloads/week](https://img.shields.io/npm/dw/fpms-client.svg)](https://npmjs.org/package/fpms-client)
[![License](https://img.shields.io/npm/l/fpms-client.svg)](https://github.com/ssh://git@github.com/sh4869/fpms-client.git/blob/master/package.json)

<!-- toc -->
- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Require

* yarn

# Usage
<!-- usage -->

```sh-session
$ npm install -g fpms-client
$ fpms COMMAND
running command...
$ fpms (-v|--version|version)
fpms-client/0.0.1 darwin-x64 node-v13.14.0
$ fpms --help [COMMAND]
USAGE
  $ fpms COMMAND
...
```

<!-- usagestop -->
# Commands
<!-- commands -->

- [`fpms add [PACKAGE]`](#fpms-add-file)
- [`fpms help [COMMAND]`](#fpms-help-command)

## `fpms add [PACKAGE]`

add package for npm.

```
add package

USAGE
  $ fpms add [PACKAGES]

OPTIONS
  --fetch-only only fetching data from fpms
```

### example

```
# sample
$ ls
package.json
$ fpms add react
☑ fetch packages from fpms
☑ update yarn.lock
☑ update package.json

yarn install v1.22.10
[1/4] Resolving packages...
success Already up-to-date.
Done in 0.07s.

☑ run yarn
# multi install
$ fpms add react gatsby
...
# version specify
$ fpms add react@^16.0.0
...
```

_See code: [src/commands/add.ts](https://github.com/sh4869/fpms-client/blob/v0.0.1/src/commands/add.ts)_

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
