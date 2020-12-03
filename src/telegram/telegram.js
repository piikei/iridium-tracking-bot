const { Telegraf, Telegram } = require("telegraf");
const { getIridiumLocation } = require("./getIridiumLocation");
const cron = require("cron");

module.exports = {
  startTelegramBot: () => {
    
    const telegram = new Telegram(process.env.TELEGRAM_TOKEN);
    const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
    
    var chatIds = [];
    
    const tracker = new cron.CronJob("0,20,40 * * * * *", () => {
      // send scheduled message here
      console.log("track");
      getIridiumLocation(chatIds, telegram);
    });

    tracker.start();

    bot.start((ctx) => {
      chatIds.push(ctx.chat.id)
      return ctx.reply("Welcome to the Jollity tracker");
    });

    bot.command("startTracker", (ctx) => {
      tracker.start();
      return ctx.reply("Tracker started");
    });

    bot.command("stopTracker", (ctx) => {
      if (tracker) {
        tracker.stop();
        console.log("tracker stopped");
      }
      return ctx.reply("Tracker stopped");
    });

    bot.help((ctx) =>
      ctx.reply("JollityBot sends you jollitys location every 4 houres")
    );

    bot.launch();
    return bot;
  },
};
