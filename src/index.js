/**
 * Require tools
 */
const { app, Tray, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const appData = require('./utils/appData');
const appMenu = require('./menu');

const Logger = require('./utils/logger');
const log = Logger.getLogger();

/**
 * Define global vars
 */
let tray;

/**
 *
 */
const createTray = async () => {
    let menu = await appMenu.getMenu();

    /**
     * Add app to tray
     */
    tray = new Tray(path.join(__dirname, 'assets', 'tray-icon-Template.png'));

    tray.setContextMenu(menu);

    /**
     * Watch for a config file changes and menu items list
     */
    fs.watchFile(appData.configFile, async (curr, prev) => {
        menu = await appMenu.getMenu();

        tray.setContextMenu(menu);
    });
};

/**
 * On ready initial function
 */
app.on('ready',  async () => {
    try {
        log.info('App is ready');

        /**
         * Do not try to check for updates in dev mode
         */
        if (!require('electron-is-dev')) {
            require('./utils/autoupdater');
        }

        /**
         * Prepare tray icon
         */
        await createTray();

        /**
         * Don't show app in the dock
         */
        app.dock.hide();

        // setInterval(async () => {
        //     tray.setContextMenu(await appMenu.getMenu());
        // }, 5 * 60 * 1000)
    } catch (error) {
        log.error(error);

        app.quit();
    }
});

/**
 * Catch runtime exceptions and rethrow them to "app's onready catch"
 */
process.on("uncaughtException", (err) => {
    log.error('uncaughtException');
    log.error(err.toString());

    // throw err;
});

process.on("unhandledRejection", (err) => {
    log.error('unhandledRejection');
    log.error(err.toString());

    // throw err;
});
