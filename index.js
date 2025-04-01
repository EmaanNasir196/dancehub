const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const mustacheExpress = require("mustache-express");
const path = require("path");
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 9000;

// Setup Mustache
app.engine("mustache", mustacheExpress(path.join(__dirname, "views/partials")));
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views/pages"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.use("/", courseRoutes);
app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
