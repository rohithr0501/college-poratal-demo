const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(express.json());

// User routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("College Portal API is running");
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Server startup failed:", error.message);
  }
};

startServer();
