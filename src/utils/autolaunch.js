const Autolaunch = require('auto-launch');
const { app } = require('electron');

/**
 * Compose path to app
 */
const appPath = app.getPath('exe').replace(/\.app\/Content.*/, '.app');

/**
 * Get launch instance
 */
const launch = new Autolaunch({
    name: 'SSH Quick Connect',
    path: appPath,
    isHidden: false
});

/**
 * Toggle launch state
 */
const toggle = () => {
    launch.isEnabled().then(enabled => {
        if (!enabled) {
            launch.enable()
        } else {
            launch.disable()
        }
    })
};

module.exports = {
    toggle
};
