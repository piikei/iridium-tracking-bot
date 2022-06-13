const express = require("express");
const app = express();
const port = 8080;

console.log("Starting APPPPPPPPP");

require("dotenv").config({ path: __dirname + "/.env" });
const { updateIridiumLocation } = require("./src/telegram/getIridiumLocation.js");
// const { nextcloudKmlFile } = require("../kmlFile/nextcloudKmlFile.js");
const { getKmlFile, updateNextcloudFile } = require("./src/nextcloud/getNextcloudFile.js");
const { updateGoogleFile } = require("./src/storage/googleCloudStorage.js");
const { calculateKmlFile } = require("./src/kmlFile/calculateKmlFile.js");

// const { serverStartup } = require("./src/server.js");

app.get("/", async (req, res) => {
  // updateIridiumLocation();
  res.status(200).send("This is the Passage Bot").end();
  // res.status(200).send('Hello, world!').end();
});

updateIridiumLocation();

// app.listen(port, () => {
//   console.log("Starting Server: ", process.env.IMAP_USER);
//   serverStartup();
// });
