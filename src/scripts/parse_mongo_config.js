// IMPORTS //
const fs = require('fs');
const yaml = require('js-yaml');

// SCRIPT CONTENTS //
const config = yaml.load(fs.readFileSync('./configs/mongo_config.yaml', 'utf8'));
module.exports = {
    uri: config.mongodb.uri,
    db: config.mongodb.db
  };