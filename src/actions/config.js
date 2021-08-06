const { exec } = require('child_process');
const appData = require('../utils/appData');
const importFresh = require('import-fresh');

const getConfig = function () {
    let sshConfigData = [];

    try {
        sshConfigData = importFresh(appData.configFile);
    } catch (e) {}

    return sshConfigData;
};

const editConfig = function () {
    exec(`touch "${appData.configFile}"`);
    exec(`open -e "${appData.configFile}"`)
};

module.exports = {
    get: getConfig,
    edit: editConfig
};
