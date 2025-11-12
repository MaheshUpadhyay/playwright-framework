const fs = require('fs');
const {get} = require('http');
function getConfig(env) {
    const configData = fs.readFileSync(`./dataSource/${env}.config.json`, 'utf-8');
    return JSON.parse(configData);
}

module.exports = {getConfig};
