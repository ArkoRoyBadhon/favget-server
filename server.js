const mongoose = require("mongoose")
const app = require("./app.js");
const config = require("./src/config/index.js");

async function main() {
  try {
    await mongoose.connect(config.database_url);
    console.log(`Database is connected successfully`);


  } catch (error) {
    console.log("Failed to connect database", error);
  }
}

main();
