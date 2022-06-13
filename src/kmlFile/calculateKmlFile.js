const togeojson = require("@mapbox/togeojson");
const tokml = require("tokml");
const DOMParser = require("xmldom").DOMParser;
const { getLon, getLat, isValid } = require("../imap/emailparser.js")

function last(array) {
    return array[array.length - 1];
}

module.exports = {
    calculateKmlFile: (data, messages) => {

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
        console.log("New Coordinates: ", newCoordinates);
        console.log(
            "🚀 ~ file: updateKmlFile.js ~ line 95 ~ s3.getObject ~ geoJSON.features[0].geometry",
            geoJSON.features[0].geometry
        );

        geoJSON.features[0].geometry.coordinates = geoJSON.features[0].geometry.coordinates.filter((coordinate) => coordinate.length > 1)

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

        return ({ kmlFile: kmlData, geoJson: geoJSON, currentPosition: last(geoJSON.features[0].geometry.coordinates)});
    }
}