const { app, shell, Menu } = require('electron');
const autolaunch = require('./utils/autolaunch');
const openSession = require('./actions/session');
const openBrowser = require('./actions/opener');
const config = require('./actions/config');
const path = require('path');

const checkInternetConnected = require('check-internet-connected');

const NAME = 'SSH Quick Connect';
const VERSION = '1.0.5';

const checkSite = require('./utils/checkSite');

const Logger = require('./utils/logger');
const log = Logger.getLogger();

const STATES = [
    'state-ok',
    'state-bad',
    'state-alert'
]

// let internetAvailable = false;

class AppMenu {
    async composeMenu() {
        let menuData = [
            {
                label: `${NAME} v${VERSION}`,
                click() {
                    shell.openExternal('https://github.com/talyguryn/ssh-quick-connect');
                }
            },
            { type: 'separator' },
        ];

        // try {
        //     await checkInternetConnected();
        //
        //     internetAvailable = true;
        // } catch (e) {}

        /**
         * Get and check config
         */
        const sshConfigData = config.get();
        const isGoodConfig = sshConfigData && sshConfigData.length;

        if (isGoodConfig) {
            const composeMenuItem = async function (hostData) {
                let data = Object.assign({
                    type: '',
                    options: {},
                    items: []
                }, hostData);

                let itemData = {};

                switch (data.type) {
                    case 'label':
                        itemData = {
                            label: data.options.label,
                            enabled: false
                        };
                        break;

                    case 'separator':
                        itemData = {
                            type: 'separator'
                        };
                        break;

                    case 'submenu':
                        const submenu = [];

                        for (let submenuItem of data.options.items) {
                            submenu.push(await composeMenuItem(submenuItem));
                        }

                        itemData = {
                            label: data.options.title,
                            submenu: submenu
                        }
                        break;

                    case 'command':
                        itemData.click = () => {
                            openSession(data.options.command);
                        }

                        itemData.label = data.options.title;
                        itemData.toolTip = data.options.description;
                        itemData.icon = path.join(__dirname, 'assets', `terminal-Template.png`);
                        break;

                    case 'link':
                        itemData.click = () => {
                            openBrowser(data.options.url);
                        };

                        // let state = 'state-ok';
                        // let message = '';
                        //
                        // if (internetAvailable) {
                        //     log.log(`Checking ${data.options.url}...`);
                        //     const siteHealth = await checkSite(data.options.url);
                        //     log.log(JSON.stringify(siteHealth, 2, 2));
                        //
                        //     if (siteHealth.sslExpireDays && (siteHealth.sslExpireDays < 11) && (siteHealth.sslExpireDays >= 0)) {
                        //         message = `SSL cert expires in ${siteHealth.sslExpireDays} day${siteHealth.sslExpireDays > 1 ? 's' : ''}\n`
                        //         state = 'state-alert';
                        //     }
                        //
                        //     if (siteHealth.sslExpireDays && (siteHealth.sslExpireDays < 0)) {
                        //         message = `SSL cert expired\n`
                        //         state = 'state-bad';
                        //     }
                        //
                        //     if (siteHealth.paidTillDays && (siteHealth.paidTillDays < 11)) {
                        //         message += `Domain payment expires in ${siteHealth.paidTillDays} day${siteHealth.paidTillDays > 1 ? 's' : '' }\n`
                        //         state = 'state-alert';
                        //     }
                        //
                        //     if (siteHealth.statusCode && siteHealth.statusCode !== 200) {
                        //         state = 'state-bad';
                        //         message += `Site responses with ${siteHealth.statusCode} code\n`
                        //     }
                        // } else {
                        //     state = 'state-bad';
                        // }
                        //
                        // message = message.trim();

                        itemData.label = data.options.title || data.options.url;
                        // itemData.toolTip = message || data.options.description;
                        // itemData.icon = path.join(__dirname, 'assets', `${state}.png`);
                        break;
                }

                return itemData;
            };

            for (let hostData of sshConfigData) {
                menuData.push(await composeMenuItem(hostData));
            }
        }

        /**
         * Link to config file
         */
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
                click: autolaunch.toggle,
            },
            { type: 'separator' },
            {
                label: `Quit`,
                role: 'quit'
            }
        );

        return menuData;
    }

    async getMenu() {
        return Menu.buildFromTemplate(await this.composeMenu())
    }
}

module.exports = new AppMenu();
