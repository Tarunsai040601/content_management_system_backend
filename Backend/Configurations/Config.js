const mongoose = require("mongoose");
const dotenv = require("dotenv").config({ quiet: true });
const dataBaseURL = process.env.MONGODB_URL;
// console.log("dataBaseURL:", dataBaseURL);
const DataBaseConnection = () => {
  try {
    console.log(
      `DataBase connected Sucessfully on ${process.env.DATABASENAME} `,
    );
  } catch (error) {
    console.log(`DataBase connected issues on ${process.env.DATABASENAME} `);
  }
};
module.exports = DataBaseConnection;
