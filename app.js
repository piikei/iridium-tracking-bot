const express = require("express");
const app = express();
const port = 8080;

console.log("Starting APPPPPPPPP");

require("dotenv").config({ path: __dirname + "/.env" });

const { serverStartup } = require("./src/server.js");

app.get("/", async (req, res) => {
  res.status(200).send("This is the Passage Bot").end();
  // res.status(200).send('Hello, world!').end();
});

app.listen(port, () => {
  console.log("Starting Server");
  serverStartup();
});
