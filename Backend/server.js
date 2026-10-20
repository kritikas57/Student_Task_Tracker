
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", taskRoutes);

app.get("/", (req, res) => {
  res.send("Student Task Tracker API is running");
});

connectDB()
  .then(() => {
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err.message);
  });
