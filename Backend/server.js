const express = require("express");
const routerData = require("./Routers/AuthRouter.js");
const DataBaseConnection = require("./Configurations/Config.js");
const app = express();
const dotenv = require("dotenv").config({ quiet: true });
const port = process.env.PORT || 8090;
// auth Router
app.use("/api",routerData)
app.listen(port, () => {
  console.log(`Server is runing on port ${port}`);
});
DataBaseConnection()
