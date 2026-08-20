const express = require("express");
const multer = require("multer");
const routerData = require("./Routers/AuthRouter.js");
const DataBaseConnection = require("./Configurations/Config.js");
const Postrouter = require("./Routers/postRouter.js");
const app = express();
const dotenv = require("dotenv").config({ quiet: true });
const port = process.env.PORT || 8090;
// json middleware
app.use(express.json());
// urlencoder
app.use(express.urlencoded());
// auth Router
app.use("/api", routerData);
// post Route
app.use("/api",Postrouter)

// Global error handler for Multer (and other errors)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ 
        success: false, 
        message: "Unexpected file upload field. Please check that your form-data field name matches what the backend expects (e.g., 'images')." 
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
  }
  next();
});

app.listen(port, () => {
  console.log(`Server is runing on port ${port}`);
});
DataBaseConnection();
