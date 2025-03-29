const User = require("../../models/User");
const bcryptjs = require("bcryptjs");
const zod = require("zod");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Zod schema for signup validation
const signUpBody = zod.object({
  username: zod.string().min(3).max(30),
  email: zod.string().email(),
  password: zod.string().min(8),
  progress: zod.string().min(6),
});

const signUpUser = async (req, res) => {
  const parsed = signUpBody.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten(),
    });
  }

  try {
    // Check for existing user by email or username
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          existingUser.email === req.body.email
            ? "Email already in use"
            : "Username already taken",
      });
    }

    const hashedPassword = await bcryptjs.hash(req.body.password, 10);

    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      progress: 0, // Initialize progress
    });

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    // Response without sensitive data
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      progress: user.progress,
    };

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: userResponse,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Zod schema for signin validation
const signInBody = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

const logInUser = async (req, res) => {
  const parsed = signInBody.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten(),
    });
  }

  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const passwordMatch = await bcryptjs.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    // Response with user data including progress
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      progress: user.progress,
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: userResponse,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { signUpUser, logInUser };
