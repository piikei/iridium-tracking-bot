const togeojson = require("@mapbox/togeojson");
const tokml = require("tokml");
const DOMParser = require("xmldom").DOMParser;
const NEXTCLOUD = require("nextcloud-node-client");

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
  nextcloudKmlFile: (messages) => {
    // get old track
    const nextcloud = new NEXTCLOUD();

    const foldername = "/Temp";
    const kmlFilename = "track.kml"
    const jsonFilename = "track.json"

    const folder = await nextcloud.getFolder(foldername)
    const kmlfile = await folder.getFile(kmlFilename);
    const jsonfile = await folder.getFile(jsonFilename);
    const data = await kmlfile.getContent();

        console.log("your file", data);
        const oldKmlString = data.toString('utf-8');
        const oldKmlDom = new DOMParser().parseFromString(
          oldKmlString,
          "text/xml"
        );

        var geoJSON = togeojson.kml(oldKmlDom);

        const newCoordinates = messages
          .map((message) => {
            const longitude = getLon(message.text);
            const latitude = getLat(message.text);
            return (
              longitude &&
              latitude && [parseFloat(longitude), parseFloat(latitude)]
            );
          })
          .filter((coordinate) => !!coordinate);
        console.log(
          "🚀 ~ file: updateKmlFile.js ~ line 95 ~ s3.getObject ~ geoJSON.features[0].geometry",
          geoJSON.features[0].geometry
        );

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
        folder.createFile(kmlFilename, new Buffer(kmlData));

        await jsonfile.delete();
        folder.createFile(jsonFilename,new Buffer(JSON.stringify(geoJSON, null, 2)));

    return;
  },
};
