const mongoose = require("mongoose");
const RegisterSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  role: { type: String, require: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
});

const user = mongoose.model("Cms_authRegister", RegisterSchema);
module.exports = user;
