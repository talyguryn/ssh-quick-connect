const { exec } = require('child_process');

const session = function (command) {
    const scriptName = Math.random().toString(36).substr(2, 9),
        scriptPath = `${require('temp-dir')}/${scriptName}`,
        scriptContent = `#! /bin/bash\n` +
                        `\n` +
                        `${command}`;

    exec(`echo "${scriptContent}" > ${scriptPath}`);
    exec(`chmod +x ${scriptPath}`);
    exec(`open ${scriptPath}`, (code, stdout, stderr) => {
        /**
         * Check if command execution was failed
         */
        if (code !== 0) {
            global.logger.error(stderr);
            return;
        }
    });
}

module.exports = session;