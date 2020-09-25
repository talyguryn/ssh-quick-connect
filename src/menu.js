const { app, shell } = require('electron');
const autoLaunch = require('./auto-launch');
const openSession = require('./actions/session');
const openBrowser = require('./actions/opener');
const config = require('./actions/config');

let menuData = [
    {
        label: `${process.env.npm_package_build_productName} v${process.env.npm_package_version}`,
        click() {
            shell.openExternal(process.env.npm_package_repository_url);
        }
    },
    { type: 'separator' },
];

const sshConfigData = config.get();

const isGoodConfig = sshConfigData && sshConfigData.length;

if (isGoodConfig) {
    const composeMenuItem = function (hostData) {
        if (hostData.items) {
            return {
                label: hostData.name,
                submenu: hostData.items.map(composeMenuItem),
            }
        }

        let data = Object.assign({
            name: '',
            host: '',
            user: 'root',
            port: 22,
            localTunnelPort: null,
            remoteHost: 'localhost',
            action: '',
            remoteTunnelPort: null
        }, hostData);

        let command = `ssh ${data.user}@${data.host}`;

        if (data.localTunnelPort && data.remoteTunnelPort) {
            command = `ssh -L ${data.localTunnelPort}:${data.remoteHost}:${data.remoteTunnelPort} ${data.user}@${data.host}`;
        }

        if (data.port) {
            command += ` -p ${data.port}`;
        }

        return {
            label: data.name,
            toolTip: command,
            click() {
                openSession(command);
                if (data.action === "url") {
                    openBrowser(`http://localhost:${data.localTunnelPort}`)
                }
            }
        };
    };

    menuData.push({
        label: 'Hosts',
        enabled: false
    });

    sshConfigData.forEach((hostData) => {
        menuData.push(composeMenuItem(hostData));
    });
} else {
    menuData.push({
        label: 'No hosts found',
        enabled: false
    });
}

if (isGoodConfig) {
    menuData.push(
        { type: 'separator' },
        {
            label: `Edit configuration`,
            click: config.edit,
        }
    );
} else {
    menuData.push(
        {
            label: `Add configuration`,
            click: config.edit,
        },
        { type: 'separator' }
    );
}


menuData.push(
    {
        label: 'Open at Login',
        type: 'checkbox',
        checked: app.getLoginItemSettings().openAtLogin,
        click: autoLaunch.toggle,
    },
    { type: 'separator' },
    {
        label: `Quit`,
        role: 'quit'
    }
);

module.exports = menuData;
