const open = require('open');

const WAITING_DELAY = 5000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const opener = function (url) {
  (async () => {
    await sleep(WAITING_DELAY);
    await open(url);
  })();
};

module.exports = opener;
