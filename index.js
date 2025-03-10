
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Import routes
const userRoutes = require("./routes/userRoutes");
const internshipRoutes = require("./routes/internshipRoutes")
const institutionRoutes = require("./routes/institutionRoutes");
const postRoutes = require("./routes/postRoutes")
const receiveRoutes = require("./routes/receiveRoutes")
const statsRoutes = require("./routes/statsRoutes")
const authRoutes = require("./routes/authRoutes");
const meRoutes = require("./routes/meRoutes");


// MongoDB connection string
const dbURI =
  "mongodb+srv://bolingo:sRm0aC7Ssr7fjR1f@cluster0.0xnua.mongodb.net/cumpus";

// Connect to MongoDB Atlas
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log("Error connecting to MongoDB Atlas:", err));

app.use(express.json());

app.use(cors());

// Use routes
// app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", internshipRoutes)
app.use("/api", institutionRoutes);
app.use("/api", postRoutes);
app.use("/api", receiveRoutes);
app.use("/api", statsRoutes);
app.use("/api", meRoutes);

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
