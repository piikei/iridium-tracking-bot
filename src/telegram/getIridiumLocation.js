const {
  fetchIridiumMessages,
} = require("../imap/queries/fetchIridiumMessages.js");
const { Telegram } = require("telegraf");

const { updateKmlFile } = require("../kmlFile/updateKmlFile.js");

const getHTTP = (string) => {
  const regex = /http(.[\S]+)/;
  const result = string.match(regex);
  return result && result[0];
};

const getLon = (string) => {
  const regex = /Lon([+-]+.[\S]+)/;
  const result = string.match(regex);
  return result && result[1];
};

const getLat = (string) => {
  const regex = /Lat([+-]+.[\S]+)/;
  const result = string.match(regex);
  return result && result[1];
};

module.exports = {
  getIridiumLocation: (chatIds, telegram) => {
    console.log(
      "🚀 ~ file: getIridiumLocation.js ~ line 28 ~ chatIds",
      chatIds
    );
    fetchIridiumMessages()
      .then((messages) => {
        // update Kml File
        updateKmlFile(messages);

        // send new locations and messages to Telegram
        messages.map((message) => {
          const Lon = getLon(message.text);
          const Lat = getLat(message.text);
          chatIds.map((chatId) => {
            if (Lon && Lat) {
              telegram.sendLocation(chatId, Lat, Lon);
            } else {
              telegram.sendMessage(chatId, message.text);
            }
          });
        });
      })
      .catch((err) => {
        console.log("🚀 ~ file: getIridiumLocation.js ~ line 20 ~ err", err);
      });
    return;
  },
};
