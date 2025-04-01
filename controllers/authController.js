const fs = require("fs");
const path = require("path");
const mustache = require("mustache");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Render Signup Page
exports.getSignup = (req, res) => {
  const page = fs.readFileSync("views/pages/signup.mustache", "utf8");
  const layout = fs.readFileSync("views/layouts/main.mustache", "utf8");

  const html = mustache.render(layout, {
    title: "Sign Up",
    body: page,
    user: req.cookies?.name || null, // Pass user name to layout
    isInstructor: req.cookies?.role === "instructor",
  });

  res.send(html);
};

// Handle Signup Form Submission
exports.postSignup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.send("User already exists");
    }

    const newUser = await User.insertUser({ name, email, password, role });
    console.log("User created:", newUser);
    res.redirect("/login");
  } catch (err) {
    console.error("Signup failed:", err);
    res.status(500).send("Signup failed");
  }
};

// Render Login Page
exports.getLogin = (req, res) => {
  const page = fs.readFileSync("views/pages/login.mustache", "utf8");
  const layout = fs.readFileSync("views/layouts/main.mustache", "utf8");
  console.log("Cookies received:", req.cookies);

  const html = mustache.render(layout, {
    title: "Login",
    body: page,
    user: req.cookies?.name || null,
    isInstructor: req.cookies?.role === "instructor",
  });

  res.send(html);
};

// Handle Login Form Submission
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findUserByEmail(email);
    if (!user) return res.status(401).send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Invalid credentials");

    // Set cookies for name and email
    res.cookie("name", user.name, { httpOnly: true });
    res.cookie("email", user.email, { httpOnly: true });
    res.cookie("role", user.role, { httpOnly: true });

    res.redirect("/");
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).send("Login failed");
  }
};

// Logout User
exports.logout = (req, res) => {
  res.clearCookie("name");
  res.clearCookie("email");
  res.redirect("/");
};
