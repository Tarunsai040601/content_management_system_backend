const express = require("express");
const { Register, Login } = require("../Controllers/AuthController");
const routerData = express.Router();
const perfix = "/registerRouter";
// register router
routerData.post(`${perfix}/register`, Register);
// login router
routerData.post(`${perfix}/login`, Login);

module.exports = routerData;
