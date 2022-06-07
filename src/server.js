// const { startTelegramBot } = require("./telegram/telegram.js");
// const { getChatIds } = require("./chatId/getChatIds.js");
const { getIridiumLocation } = require("./getIridiumLocation");
const cron = require("cron");


module.exports = {
  serverStartup: async () => {
    console.log("App started");

    const tracker = new cron.CronJob("0 * * * *", () => {
      // send scheduled message here
      console.log("track");
      updateIridiumLocation();
    });

    // var chatIds = await getChatIds();
    // startTelegramBot({chatIds});
  },
};
