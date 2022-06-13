const {
  fetchIridiumMessages,
} = require("../imap/queries/fetchIridiumMessages.js");
const { Telegram } = require("telegraf");

const { updateKmlFile } = require("../kmlFile/updateKmlFile.js");
const { nextcloudKmlFile } = require("../kmlFile/nextcloudKmlFile.js");
const { getLon, getLat } =require("../imap/emailparser.js")

module.exports = {
  updateIridiumLocation: () => {
    console.log(
      "🚀 ~ file: getIridiumLocation.js ~ line 29"
    );
    fetchIridiumMessages()
      .then((messages) => {
        // update Kml File
        nextcloudKmlFile(messages);
      })
      .catch((err) => {
        console.log("🚀 ~ file: getIridiumLocation.js ~ line 20 ~ err", err);
      });
  },
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
