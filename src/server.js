// const { startTelegramBot } = require("./telegram/telegram.js");
// const { getChatIds } = require("./chatId/getChatIds.js");
const { updateIridiumLocation } = require("./telegram/getIridiumLocation.js");
// const { nextcloudKmlFile } = require("./kmlFile/nextcloudKmlFile.js");
const cron = require("cron");


module.exports = {
  serverStartup: async () => {
    console.log("AppServer started");

    const tracker = new cron.CronJob("0 * * * *", () => {
      // send scheduled message here
      console.log("track");
      updateIridiumLocation();
    });

    // nextcloudKmlFile("message");
    tracker.start();

    // var chatIds = await getChatIds();
    // startTelegramBot({chatIds});
  },
};
