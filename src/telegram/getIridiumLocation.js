const {
  fetchIridiumMessages,
} = require("../imap/queries/fetchIridiumMessages.js");
const { Telegram } = require("telegraf");

const { updateKmlFile } = require("../kmlFile/updateKmlFile.js");
const { nextcloudKmlFile } = require("../kmlFile/nextcloudKmlFile.js");
const { getLon, getLat } = require("../imap/emailparser.js")

const { getKmlFile, updateNextcloudFile } = require("./../nextcloud/getNextcloudFile.js");
const { updateGoogleFile, getGoogleFile } = require("./../storage/googleCloudStorage.js");
const { calculateKmlFile } = require("./../kmlFile/calculateKmlFile.js");
const { replaceSinglePosition } = require("./../kmlFile/replacePostion.js");

async function processMessages(messages) {
  const previousKmlData = await getKmlFile();
  console.log("Got KmlFile, Next Calculate new KML");
  const calculatedData = await calculateKmlFile(previousKmlData, messages);
  console.log("Got Calculated KML, next Upload Nextcloud:", calculatedData);
  await updateNextcloudFile(calculatedData);
  console.log("Upload Google");
  await updateGoogleFile(calculatedData.kmlFile, "Track2022.kml");
  await updateGoogleFile(JSON.stringify(calculatedData.geoJson, null, 2), "Track2022.json");
  console.log("Update Current Position");
  const currentPositionFile = await getGoogleFile("CurrentPosition.json");
  console.log("currentPositionFile:", currentPositionFile);
  currentPosObject = JSON.parse(currentPositionFile);
  console.log("currentPosObject:", currentPosObject.features[0].geometry);
  currentPosObject.features[0].geometry.coordinates = calculatedData.currentPosition;
  console.log("currentPosObject1:", currentPosObject.features[0].geometry);
  await updateGoogleFile(JSON.stringify(currentPosObject, null, 2), "CurrentPosition.json");
  // const currentPositionFile = await getGoogleFile("CurrentPosition.kml");
  // const newCurrentPosFile = await replaceSinglePosition(currentPositionFile, calculatedData.currentPosition);
  // await updateGoogleFile(newCurrentPosFile, "CurrentPosition.kml");
}

module.exports = {
  updateIridiumLocation: () => {
    console.log(
      "🚀 ~ file: getIridiumLocation.js ~ line 29"
    );
    fetchIridiumMessages()
      .then((messages) => {
        // update Kml File
        console.log(
          "Got Messages", messages
        );
        processMessages(messages);
        // nextcloudKmlFile(messages);
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
