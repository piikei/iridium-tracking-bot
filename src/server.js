const { startTelegramBot } = require("./telegram/telegram.js");

module.exports = {
  serverStartup: () => {
    console.log('App started')
    startTelegramBot();
  },
};
