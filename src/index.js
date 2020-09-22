/**
 * Require tools
 */
const { app, Tray, Menu } = require('electron');
const path = require('path');

global.appFolder = app.getPath('userData');
global.logger = require('./utils/logger');

require("dotenv-json")({
    path: path.join(__dirname, 'env.json')
});

/**
 * Define global vars
 */
let tray;

/**
 *
 */
const createTray = () => {
    /**
     * Add app to tray
     */
    tray = new Tray(path.join(__dirname, 'assets', 'tray-icon-Template.png'));

    global.sshConfigFilePath = path.join(global.appFolder, 'config.js');

    tray.setContextMenu(Menu.buildFromTemplate(require('./menu')));
    //
    // tray.on('click', () => {
        // tray.popUpContextMenu();
    // })

    // tray.on('click', function (event) {
    //     global.logger.log('click!');
    // });

    // fs.watchFile(global.sshConfigFilePath, (curr, prev) => {
    //     global.logger.info('UpDATE');
    //
    //     tray.setContextMenu(Menu.buildFromTemplate([
    //         { type: 'separator' },
    //         {
    //             label: `Quit`,
    //             role: 'quit'
    //         }
    //     ]));
    // });
};

/**
 * Don't show app in the dock
 */
app.dock.hide();

/**
 * On ready initial function
 */
app.on('ready', () => {
    try {
        global.logger.info('App is ready');

        /**
         * Prepare tray icon
         */
        createTray();

        if (!require('electron-is-dev')) {
            require('./utils/autoupdater');
        }
    } catch (error) {
        global.logger.error(error);

        app.quit();
    }
});

process.on("uncaughtException", (err) => {
    throw err;
});
