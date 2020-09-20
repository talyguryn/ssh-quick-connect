const fs = require('fs');
const path = require('path');

const pathToEnv = path.join(__dirname, '..', 'env.json');

let content = {
    npm_package_build_productName: process.env.npm_package_build_productName,
    npm_package_version: process.env.npm_package_version,
    npm_package_repository_url: process.env.npm_package_repository_url,
};

fs.writeFileSync(pathToEnv, JSON.stringify(content, null, 2));