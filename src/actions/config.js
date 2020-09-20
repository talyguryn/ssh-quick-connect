const { exec } = require('child_process');

let sshConfigFilePath = global.sshConfigFilePath;

const getConfig = function () {
    let sshConfigData = [];

    try {
        sshConfigData = require(sshConfigFilePath);
    } catch (e) {}

    return sshConfigData;
};

const editConfig = function () {
    exec(`touch "${sshConfigFilePath}"`);
    exec(`open -e "${sshConfigFilePath}"`)
};

module.exports = {
    get: getConfig,
    edit: editConfig
};