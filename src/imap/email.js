function eMail(message) {
    this.message = message;
    this.getLon = (string) => {
        const regex = /Lon([+-]+.[\S]+)/;
        const result = string.match(regex);
        return result && result[1];
    }
    this.getLat = (string) => {
        const regex = /Lat([+-]+.[\S]+)/;
        const result = string.match(regex);
        return result && result[1];
    }
    this.getSats = (string) => {
        const regex = /Sats seen \d{2}/;
        const result = string.match(regex);
        return result[0];
    }
    this.isValid = (Boolean) => {
        this.getSats &&
        this.getLon > -47.0 && 
        this.getLon < 9.0 && 
        this.getLat > 48.0 && 
        this.getLat < 75.0
    }
}