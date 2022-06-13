const togeojson = require("@mapbox/togeojson");
const tokml = require("tokml");
const DOMParser = require("xmldom").DOMParser;

module.exports = {
    replaceSinglePosition: (data, currentPosition) => {

        console.log("CurrentPos", currentPosition);
        const coordinatesRegex = /<coordinates>[-\d.,]+<\/coordinates>/;
        const newData = data.toString('utf-8').replace(coordinatesRegex, ["<coordinates>", currentPosition[0],",", currentPosition[1], "</coordinates>"].join(''))
        
        return newData;
    }
}