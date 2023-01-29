const mongoose = require("mongoose");
const uri = process.env.ATLAS_URI;

// db
async function connection() {
  try {
    await mongoose.connect(uri);
  } catch(e) {
    console.error("Error: ", e);
  } 
}

module.exports = connection;
