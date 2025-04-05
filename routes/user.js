const express = require("express");
const app = express.Router();
const bodyparser = require("body-parser");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
const nodemailer = require("nodemailer");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const transporterData = {
  host: process.env.MAIL_HOST,
  port: 465, // SSL mode
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASWORD, // App Password
  },
  tls: {
    rejectUnauthorized: false, // Bypass certificate validation
  },
};

const transporter = nodemailer.createTransport(transporterData);

app.post(
  "/register",
  [
    body("username", "Invalid Username").isLength({ min: 1 }),
    body("email", "Invalid Email").isEmail(),
    body("password", "Invalid Pass").notEmpty(),
  ],
  async (req, res) => {
    const { username, email, password } = req.body;

    try {
      // Check if the email already exists
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ error: result.array() });
      }
      const existingUser = await User.findOne({ email });
      const existingname = await User.findOne({ username });

      if (existingUser || existingname) {
        return res
          .status(400)
          .json({
            error: "Account already exists with same email or username",
          });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = Math.floor(Math.random() * (999999 - 100000) + 100000);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        // random x max - min + min ==> random number between 100000 - 999999
        data: otp,
        goals: "",
      });
// ***code to send code to user
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: `Verify Your OTP`,
        text: JSON.stringify(otp),
      });
      await newUser.save();
      
      res.status(200).json({
        message: "Registration successful! You can now verify your OTP.",
      });
    } catch (err) {
      res.status(400).json({
        error: "Some issue occurred! Please try again later",
        message: "Some issue occurred! Please try again later",
      });
    }
  }
);

app.post(
  "/login",
  [
    body("email", "Invalid Email").isEmail(),
    body("password", "Invalid Pass").notEmpty(),
  ],
  async (req, res) => {
    const { email, password } = req.body;

    try {
      // Check if the email already exists
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ error: result.array() });
      }
      const account = await User.findOne({ email });

      if (!account || /^\d{6}$/.test(account.data)) {
        return res
          .status(400)
          .json({ error: "This account does not exist! Register now" });
      }

      if (!(await bcrypt.compare(password, account.password))) {
        return res.status(400).json({ error: "Wrong Password" });
      }
      const jwtData = {
        user: {
          id: account.email,
        },
      };
      const jwtResponse = jwt.sign(jwtData, "SNCL");
      res
        .status(200)
        .json({ authToken: jwtResponse, message: "Login Successful!" });
    } catch (err) {
      res.status(400).json({
        error: "Some issue occurred! Please try again later",
        message: "Some issue occurred! Please try again later",
      });
    }
  }
);

app.post(
  "/update",
  [
    body("jwtToken", "Invalid JWT").notEmpty(),
    body("mood", "Invalid Data").notEmpty(),
  ],
  async (req, res) => {
    const { jwtToken, mood } = req.body;
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ error: result.array() });
      }

      const id = jwt.decode(JSON.parse(jwtToken)).user.id;

      const data = await User.findOne({ email: id }).select("-password");
      if (data) {
        await User.updateOne({ email: data.email }, { $set: { data: mood } });
        return res.status(200).json({ message: "EMood Updated" });
      }

      if (!data) {
        throw new Error("");
      }

      res.status(200).json({ message: "Saved" });
    } catch (err) {
      res.status(400).json({
        error: "Some issue occurred! Please try again later",
        message: "Some issue occurred! Please try again later",
      });
    }
  }
);

app.post(
  "/goal",
  [
    body("jwtToken", "Invalid JWT").notEmpty(),
    body("goal", "Invalid Data").notEmpty(),
  ],
  async (req, res) => {
    const { jwtToken, goal } = req.body;
    console.log(jwtToken);
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ error: result.array() });
      }

      const id = jwt.decode(JSON.parse(jwtToken)).user.id;

      const data = await User.findOne({ email: id }).select("-password");
      if (data) {
        await User.updateOne({ email: data.email }, { $set: { goals: goal } });
        return res.status(200).json({ message: "Goal Updated" });
      }

      if (!data) {
        throw new Error("");
      }

      res.status(200).json({ message: "Saved" });
    } catch (err) {
      res.status(400).json({
        error: "Some issue occurred! Please try again later",
        message: "Some issue occurred! Please try again later",
      });
    }
  }
);

app.post(
  "/tag",
  [
    body("jwtToken", "Invalid JWT").notEmpty(),
    body("tag", "Invalid Data").notEmpty(),
  ],
  async (req, res) => {
    const { jwtToken, tag } = req.body;
    console.log(jwtToken);
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ error: result.array() });
      }

      const id = jwt.decode(JSON.parse(jwtToken)).user.id;

      const data = await User.findOne({ email: id }).select("-password");
      if (data) {
        await User.updateOne({ email: data.email }, { $set: { tags: tag } });
        return res.status(200).json({ message: "Tag Updated" });
      }

      if (!data) {
        throw new Error("");
      }

      res.status(200).json({ message: "Saved" });
    } catch (err) {
      res.status(400).json({
        error: "Some issue occurred! Please try again later",
        message: "Some issue occurred! Please try again later",
      });
    }
  }
);

module.exports = app;
