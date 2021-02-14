import express from "express";
const app = express();
const port = 3000;

require("dotenv").config({ path: __dirname + "/.env" });

console.log('process.env.JOLLITY_GMAIL_PASSWORD,', process.env.JOLLITY_GMAIL_PASSWORD,)
import { serverStartup } from "./src/server.js";

app.get("/", async (req, res) => {
  res.send("This is the Jollity Bot");
});

app.listen(port, () => {
  serverStartup();
});
