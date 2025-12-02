const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();

require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'public')));

const gardenRoutes = require("./routes/gardenRoutes");
app.use("/api/v1/gardens", gardenRoutes);

// Serve React app for any other route 
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});