const { updateKmlFile } = require("./kmlFile/updateKmlFile.js");
const { startTelegramBot } = require("./telegram/telegram.js");
const cron = require("cron");
const {
  fetchIridiumMessages,
} = require("./imap/queries/fetchIridiumMessages.js");

module.exports = {
  serverStartup: async () => {
    console.log("App started");
    startTelegramBot();
  },
};
