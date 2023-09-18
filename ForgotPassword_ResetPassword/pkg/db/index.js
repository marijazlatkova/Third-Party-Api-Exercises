const mongoose = require("mongoose");
const config = require("../config");

const { MONGO_USERNAME, MONGO_PASSWORD } = config.getSection("development");

const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.tonpgxf.mongodb.net/tp-apis?retryWrites=true&w=majority`;

(async function () {
  try {
    await mongoose.connect(uri);
    console.log("Successfully connected to DataBase");
  } catch (err) {
    console.log("Error connecting to DataBase", err);
  }
})();