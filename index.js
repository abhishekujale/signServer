
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-route")
require("dotenv").config();
try {
    mongoose.connect(process.env.MONGO_URI, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true
    });
    console.log("Database connected successfully");
}

catch (err) {
    console.log("Error with mongoose connection");
}
// mongoose
// .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
app.use(express.json());
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the API"
    })
});

app.listen(port, () => {
    console.log("Server is running on port " + port);
});