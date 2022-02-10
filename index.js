const express = require("express");
const mongoose = require("mongoose");
require("./db/mongoose");
const Char = require("./char-info/character-model");
const Trait = require("./char-info/character-traits");
const charRouter = require("./char-routers/char");
const traitRouter = require("./char-routers/trait");

const app = express();
const port = 3443;

app.use(express.json());
app.use(charRouter);
app.use(traitRouter);

console.log(mongoose.connection.readyState);

app.listen(port, () => {
  console.log("server is connected on port " + port);
});
