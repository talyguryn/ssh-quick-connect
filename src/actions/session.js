const { exec } = require('child_process');

const session = function (command) {
    exec(`osascript -e 'tell application "Terminal" to (do script "${command}") activate'`);
}

module.exports = session;