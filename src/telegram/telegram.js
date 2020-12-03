const { Telegraf } = require("telegraf");
const { getIridiumLocation } = require("./getIridiumLocation");
const cron = require("cron");

const getTracker = (ctx) =>
  new cron.CronJob("0,20,40 * * * * *", () => {
    // send scheduled message here
    console.log("track");
    getIridiumLocation(ctx);
  });

module.exports = {
  startTelegramBot: () => {
    var tracker;
    const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

    bot.start((ctx) => {
      tracker = getTracker(ctx);
      tracker.start();
      return ctx.reply("Welcome to the Jollity tracker");
    });

    bot.command("startTracker", (ctx) => {
      tracker = getTracker(ctx);
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
