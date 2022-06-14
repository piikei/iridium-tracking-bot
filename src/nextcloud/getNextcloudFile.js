const togeojson = require("@mapbox/togeojson");
const { default: Client } = require("nextcloud-node-client");
const tokml = require("tokml");
const DOMParser = require("xmldom").DOMParser;
require("nextcloud-node-client");
const { getLon, getLat, isValid } = require("../imap/emailparser.js")

/* const getLon = (string) => {
  const regex = /Lon([+-]+.[\S]+)/;
  const result = string.match(regex);
  return result && result[1];
};
const getLat = (string) => {
  const regex = /Lat([+-]+.[\S]+)/;
  const result = string.match(regex);
  return result && result[1];
}; */

const foldername = "/Medien/2022";
const kmlFilename = "Track2022.kml"
const jsonFilename = "Track2022.json"

async function getKmlFile() {
    // console.log("nextcloudKmlFile with: ", messages);

    // get old track
    const nextcloud = new Client();



    const folder = await nextcloud.getFolder(foldername)
    // console.log("folder getFiles", await folder.getFiles());
    // console.log("folder contains", await folder.containsFile(kmlFilename));
    // console.log("file", await nextcloud.getFile('/Temp/track.json'));
    const kmlfile = await folder.getFile(kmlFilename);
    const jsonfile = await folder.getFile(jsonFilename);
    console.log("getKmlFile:", kmlfile);

    const data = (await kmlfile?.getContent()) || "";
    return data;
}

async function updateNextcloudFile(fileContent) {
    // console.log("nextcloudKmlFile with: ", messages);

    // get old track
    const nextcloud = new Client();


    const folder = await nextcloud.getFolder(foldername)
    // console.log("folder getFiles", await folder.getFiles());
    // console.log("folder contains", await folder.containsFile(kmlFilename));
    // console.log("file", await nextcloud.getFile('/Temp/track.json'));
    const kmlfile = await folder.getFile(kmlFilename);
    const jsonfile = await folder.getFile(jsonFilename);


    console.log(
        "🚀 ~ Nextcloud file written", fileContent.kmlFile
    );

    await kmlfile?.delete();
    await folder.createFile(kmlFilename, Buffer.from(fileContent.kmlFile));

    await jsonfile?.delete();
    await folder.createFile(jsonFilename, Buffer.from(JSON.stringify(fileContent.geoJson, null, 2)));

}



module.exports.getKmlFile = getKmlFile
module.exports.updateNextcloudFile = updateNextcloudFile
