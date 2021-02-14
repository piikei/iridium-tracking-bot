const { startTelegramBot } = require("./telegram/telegram.js");
const { getChatIds } = require("./chatId/getChatIds.js");

module.exports = {
  serverStartup: async () => {
    console.log("App started");
    var chatIds = await getChatIds();
    startTelegramBot({chatIds});
  },
};
