const registerModel = require("../Models/RegisterSchema.js");
const bcryptjs = require("bcryptjs");
const JwtData = require("jsonwebtoken");

// ================= REGISTER =================

const Register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("req.body:", req.body);

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Something went wrong",
        details: "All fields are required",
      });
    }

    // Check user already exists
    const existingUser = await registerModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Hash password
    const HashingPassword = await bcryptjs.hash(password, 10);

    console.log("HashingPassword:", HashingPassword);

    // Create user
    const insertData = await registerModel.create({
      name,
      email,
      password: HashingPassword,
      role,
    });

    console.log("insertData:", insertData);

    return res.status(201).json({
      message: "User registered successfully",
      details: {
        id: insertData._id,
        name: insertData.name,
        email: insertData.email,
        role: insertData.role,
      },
    });
  } catch (error) {
    console.log("Register Error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ================= LOGIN =================

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await registerModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = JwtData.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.MYTOKEN,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Login Error:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  Register,
  Login,
};
