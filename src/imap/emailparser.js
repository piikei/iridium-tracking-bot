var getLon = exports.getLon = function(string) {
    const regex = /Lon([+-]+.[\S]+)/;
    const result = string.match(regex);
    return result && parseFloat(result[1]);
  };

var getLat = exports.getLat = function(string) {
    const regex = /Lat([+-]+.[\S]+)/;
    const result = string.match(regex);
    return result && parseFloat(result[1]);
  };

var getSats = exports.getSats = function(string) {
  // console.log("getSats", string)
    const regex = /Sats seen \d{2}/;
    const result = string.match(regex);
    return result;
};

var getHttp = exports.getHttp = function(string) {
  const regex = /http(.[\S]+)/;
  const result = string.match(regex);
  return result && result[0];
};

exports.isValid = function(string) {
    const latitude = getLat(string);
    const longitude = getLon(string);
    // console.log("isValid ", getSats(string), longitude, latitude)
    return (getSats(string) &&
    longitude > -47.0 &&
    longitude < 9.0 &&
    latitude > 48.0 &&
    latitude < 75.0);
};