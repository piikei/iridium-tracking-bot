const togeojson = require("@mapbox/togeojson");
const tokml = require("tokml");
const DOMParser = require("xmldom").DOMParser;
const {Storage} = require('@google-cloud/storage');

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
  updateKmlFile: (messages) => {
    // get old track
    const s3 = new Storage();

    const getParams = {
      Bucket: "jollity-track",
      Key: "track.kml",
    };

    s3.getObject(getParams, (err, data) => {
      if (err) {
        console.log("err", err);
        return;
      } else {
        console.log("your file", data);
        const oldKmlString = data.Body.toString();
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

        const uploadKmlParams = {
          Bucket: "jollity-track",
          Key: "track.kml",
          Body: kmlData,
          ACL: "public-read",
          Expires: expireDate,
          ContentType: "application/vnd.google-earth.kml+xml",
        };

        s3.upload(uploadKmlParams, (err, data) => {
          if (err) console.log(err);
          else {
            console.log("file uploadet to", data.Location);
          }
        });

        const uploadGeoParams = {
          Bucket: "jollity-track",
          Key: "track.json",
          Body: JSON.stringify(geoJSON, null, 2),
          ACL: "public-read",
          Expires: expireDate,
          ContentType: "application/json",
        };

        s3.upload(uploadGeoParams, (err, data) => {
          if (err) console.log(err);
          else {
            console.log("file uploadet to", data.Location);
          }
        });
      }
    });

    return;
  },
};
