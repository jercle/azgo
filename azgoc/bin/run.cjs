#!/usr/bin/env node

const oclif = require('@oclif/core')
require = require('esm')(module /*, options*/);

oclif.run().then(require('@oclif/core/flush')).catch(require('@oclif/core/handle'))
