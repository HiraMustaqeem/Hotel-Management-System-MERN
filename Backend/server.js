// server.js
require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db_config");

connectDB();

app.listen(process.env.PORT, () => {
  console.log("Server running...");
});

