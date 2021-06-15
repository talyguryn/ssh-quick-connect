/**
 * Module for saving required environment variables to separate file
 */

const fs = require('fs');
const path = require('path');

/**
 * Path for a new environment file
 * @type {string}
 */
const pathToEnv = path.join(__dirname, '..', 'env.json');

/**
 * Get variables which are required in production
 */
let content = {
    npm_package_build_productName: process.env.npm_package_build_productName,
    npm_package_version: process.env.npm_package_version,
    npm_package_repository_url: process.env.npm_package_repository_url,
};

/**
 * Save json data to env file
 */
fs.writeFileSync(pathToEnv, JSON.stringify(content, null, 2));