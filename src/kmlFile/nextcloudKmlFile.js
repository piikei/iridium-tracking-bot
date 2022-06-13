const togeojson = require("@mapbox/togeojson");
const { default: Client } = require("nextcloud-node-client");
const tokml = require("tokml");
const DOMParser = require("xmldom").DOMParser;
require("nextcloud-node-client");
const { getLon, getLat, isValid } =require("../imap/emailparser.js")

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

async function nextcloudKmlFile(messages) {
    // console.log("nextcloudKmlFile with: ", messages);

    // get old track
    const nextcloud = new Client();

    const foldername = "/Temp";
    const kmlFilename = "track.kml"
    const jsonFilename = "track.json"

    const folder = await nextcloud.getFolder(foldername)
    console.log("folder getFiles", await folder.getFiles());
    console.log("folder contains", await folder.containsFile(kmlFilename));
    console.log("file", await nextcloud.getFile('/Temp/track.json'));
    const kmlfile = await folder.getFile(kmlFilename);
    const jsonfile = await folder.getFile(jsonFilename);
    console.log("kmlfile", kmlfile);
    
    const data = await kmlfile?.getContent() ?? "";

        console.log("your file", data);
        const oldKmlString = data.toString('utf-8');
        console.log("your file to string", data.toString('utf-8'));
        const oldKmlDom = new DOMParser().parseFromString(
          oldKmlString,
          "text/xml"
        );

        var geoJSON = togeojson.kml(oldKmlDom);

        const newCoordinates = messages
          .filter((message) => isValid(message.text))
          .map((message) => {
              return ([getLon(message.text), getLat(message.text)])
          });
        console.log(
          "🚀 ~ file: updateKmlFile.js ~ line 95 ~ s3.getObject ~ geoJSON.features[0].geometry",
          geoJSON.features[0].geometry
        );

        // cgitonsole.log("inValidMessages:", messages.filter((message) => !isValid(message.text)));

        geoJSON.features[0].geometry = {
          ...geoJSON.features[0].geometry,
          coordinates: geoJSON.features[0].geometry.coordinates.concat(
            newCoordinates
          ),
        };
        console.log(
          "🚀 ~ file: updateKmlFile.js ~ line 95 ~ s3.getObject ~ geoJSON.features[0].geometry",
          geoJSON.features[0].geometry
        );

        // generate KML
        const kmlData = tokml(geoJSON);

        console.log(
          "🚀 ~ file: updateKmlFile.js ~ line 41 ~ updateKmlFile: ~ kmlData",
          kmlData
        );

        const currentDate = new Date();
        const expireDate = new Date(currentDate.getTime() + 5 * 60000);
        console.log(
          "🚀 ~ file: updateKmlFile.js ~ line 89 ~ s3.getObject ~ expireDate",
          currentDate,
          expireDate
        );

        await kmlfile.delete();
        folder.createFile(kmlFilename, Buffer.from(kmlData));

        await jsonfile.delete();
        folder.createFile(jsonFilename, Buffer.from(JSON.stringify(geoJSON, null, 2)));

    return;
}

module.exports.nextcloudKmlFile = nextcloudKmlFile
