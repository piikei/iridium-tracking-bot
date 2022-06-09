// const { startTelegramBot } = require("./telegram/telegram.js");
// const { getChatIds } = require("./chatId/getChatIds.js");
const { updateIridiumLocation } = require("./telegram/getIridiumLocation.js");
const { nextcloudKmlFile } = require("./kmlFile/nextcloudKmlFile.js");
const cron = require("cron");


module.exports = {
  serverStartup: async () => {
    console.log("App started2");

    const tracker = new cron.CronJob("* * * * *", () => {
      // send scheduled message here
      console.log("track");
      updateIridiumLocation();
    });

    updateIridiumLocation();

    // nextcloudKmlFile("message");
    // tracker.start();

    // var chatIds = await getChatIds();
    // startTelegramBot({chatIds});
  },
};
