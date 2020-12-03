const {
  fetchIridiumMessages,
} = require("../imap/queries/fetchIridiumMessages.js");

const getHTTP = (string) => {
  const regex = /http(.[\S]+)/;
  const result = string.match(regex);
  return result && result[0];
};

module.exports = {
  getIridiumLocation: (ctx) => {
    fetchIridiumMessages()
      .then((messages) => {
        messages.map((message) => {
          console.log(
            "🚀 ~ file: getIridiumLocation.js ~ line 17 ~ messages.map ~ message",
            message
          );
          const locationLink = getHTTP(message.text);
          ctx.reply(locationLink || message.text);
        });
      })
      .catch((err) => {
        console.log("🚀 ~ file: getIridiumLocation.js ~ line 20 ~ err", err);
        ctx.reply(err);
      });
    return ctx.reply("...loading");
  },
};
