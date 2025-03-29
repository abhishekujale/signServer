const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
const authRoutes = require("./routes/auth-route");

app.use(express.json());

// ✅ Apply CORS Middleware (Allow All Origins for Testing)
app.use(cors());

// If you want to allow only your frontend, use this instead:
// app.use(cors({
//   origin: "http://localhost:5177", // Set your frontend URL
//   methods: "GET,POST,PUT,DELETE",
//   allowedHeaders: "Content-Type,Authorization"
// }));

// Connect to Database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Error with mongoose connection:", err);
    process.exit(1);
  }
};

connectDB();

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// ✅ Apply CORS to All Routes (In Case It’s Not Applied Globally)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins (or specify frontend URL)
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Handle preflight requests
  }

  next();
});

// Use authentication routes
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
