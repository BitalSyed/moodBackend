const express = require("express");
const app = express.Router();
const bodyparser = require("body-parser");
const { body, validationResult } = require("express-validator");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
const User = require("../models/user");
const jwt = require("jsonwebtoken");

app.post(
  "/verify",
  [body("otp", "Invalid OTP").isLength({ min: 6 })],
  async (req, res) => {
    const { otp } = req.body;

    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ error: result.array() });
      }
      const data = await User.findOne({ data: otp }).select("-password");

      if (data) {
        const jwtData = {
          user: {
            id: data.email,
          },
        };
        const jwtResponse = jwt.sign(jwtData, "SNCL");
        await User.updateOne({ data: otp }, { $set: { data: "" } });
        return res.status(200).json({
          message: "Email verified Successfully! Logging you in",
          data: jwtResponse,
        });
      }

      res.status(400).json({
        error: "Invalid OTP.",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        error: "Some issue occurred! Please try again later",
        message: "Some issue occurred! Please try again later",
      });
    }
  }
);

app.post(
  "/authenticate",
  [body("jwtToken", "Invalid JWT").notEmpty()],
  async (req, res) => {
    const { jwtToken } = req.body;
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ error: result.array() });
      }

      const id = jwt.decode(JSON.parse(jwtToken)).user.id;

      const data = await User.findOne({ email: id }).select("-password");

      if (!data) {
        throw new Error("");
      }

      res.status(200).json({ data: data });
    } catch (err) {
      res.status(400).json({
        error: "Some issue occurred! Please try again later",
        message: "Some issue occurred! Please try again later",
      });
    }
  }
);

module.exports = app;
