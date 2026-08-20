const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ quiet: true });

const dataBaseURL = process.env.MONGODB_URL;

const DataBaseConnection = async () => {
  try {
    await mongoose.connect(dataBaseURL);

    console.log(
      `DataBase connected Successfully on ${process.env.DATABASENAME}`,
    );
  } catch (error) {
    console.log(`DataBase connection issues on ${process.env.DATABASENAME}`);

    console.log("Error:", error.message);
  }
};

module.exports = DataBaseConnection;
