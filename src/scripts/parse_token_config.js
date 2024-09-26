// IMPORTS //
const fs = require('fs')
const yaml = require('js-yaml')

// SCRIPT CONTENTS //
const config = yaml.load(fs.readFileSync('./configs/token_config.yaml', 'utf8'))
module.exports = {
    secret_key: config.tokens.secret_key,
    header_key: config.tokens.header_key
}