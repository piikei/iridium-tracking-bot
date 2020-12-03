const express = require("express");
const app = express();
const port = 3000;

require("dotenv").config({ path: __dirname + "/.env" });

const { serverStartup } = require("./src/server.js");

app.get("/", (req, res) => {
  res.send(process.env["TELEGRAM_TOKEN"]);
});

app.listen(port, () => {
  serverStartup();
});
