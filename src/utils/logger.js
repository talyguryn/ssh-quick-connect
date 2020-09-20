/**
 * Logger can save log to file in appData/logs dir
 *
 * @usage enable logger
 * global.logger = require('./utils/logger');
 *
 * @example logger.debug('my log %s', variable);
 * @example logger.info('my log');
 * @example logger.warn('my log');
 * @example logger.error('my log');
 */
const fs = require('fs');
const path = require('path');

/**
 * Logs will be stored in the app-data/logs
 * @type {string}
 */
const logsDirPath = path.join(global.appFolder, 'logs');

if (!fs.existsSync(logsDirPath)) {
    fs.mkdirSync(logsDirPath);
}

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const errorStackFormat = winston.format(info => {
    if (info instanceof Error) {
        return Object.assign({}, info, {
            stack: info.stack,
            message: info.message
        })
    }
    return info
})

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    format: winston.format.combine(
        winston.format.errors({ stack: true }), // <-- use errors format
        winston.format.timestamp({
            format: 'HH:mm:ss'
        }),
        winston.format.printf(info => `${info.timestamp} [${info.level}] ${info.message}`+(info.splat!==undefined?`${info.splat}`:" ")+(info.stack!==undefined?`\n${info.stack}`:""))
    ),
    transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
            dirname: logsDirPath,
            filename: '%DATE%.log'
        })
    ]
});

module.exports = {
    log: logger.debug.bind(logger),
    debug: logger.debug.bind(logger),
    info: logger.info.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger)
};