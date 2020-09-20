const { autoUpdater } = require('electron-updater');

/**
 * Autoupdater events
 */
autoUpdater.on('checking-for-update', () => {
    global.logger.log('Checking for update');
});

autoUpdater.on('error', (error) => {
    global.logger.error('Error while checking for updates', error);
});

autoUpdater.on('update-available', (updateInfo) => {
    global.logger.log('Update is available:', updateInfo);
});

autoUpdater.on('update-not-available', (updateInfo) => {
    global.logger.log('No updates are available', updateInfo);
});

autoUpdater.on('download-progress', (progressInfo) => {
    let logMessage = `speed ${progressInfo.bytesPerSecond} b/s; progress ${progressInfo.percent}%; downloaded ${progressInfo.transferred} out of ${progressInfo.total} bytes`;

    global.logger.log(logMessage);
});

autoUpdater.on('update-downloaded', (updateInfo) => {
    global.logger.log('Update is ready', updateInfo);

    /* Notify user about ready to be installed update */
    // ...

    /* Or force quit app and install update */
    autoUpdater.quitAndInstall();
});

/* Check for updates manually */
autoUpdater.checkForUpdates();

/* Check updates every minute */
setInterval(() => {
    autoUpdater.checkForUpdates();
}, 10 * 60 * 1000);