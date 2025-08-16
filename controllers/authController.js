const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, username: user.username, verified: user.verified },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// Register
exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const exists = await User.findOne({ username }).select("+password");
    if (exists)
      return res
        .status(400)
        .json({ suceess: false, message: "Username already taken" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({
      user: {
        username: user.username,
        _id: user._id,
      },
      token: generateToken(user),
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user and select the password field (hashed password)
    const user = await User.findOne({ username }).select("+password");

    // If the user doesn't exist or password doesn't match, return an error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Return a response with the user data (excluding password) and a token
    res.json({
      success: true,
      message: "Logged in successfully",
      user: {
        username: user.username,
        _id: user._id,
      },
      token: generateToken(user), // Generate JWT token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
