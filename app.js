const express = require("express");
const app = express();
const port = 3000;

console.log("Starting APPPPPPPPP");

require("dotenv").config({ path: __dirname + "/.env" });

const { serverStartup } = require("./src/server.js");

app.get("/", async (req, res) => {
  res.send("This is the Jollity Bot");
});

app.listen(port, () => {
  serverStartup();
});
