const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
      username: req.body.username,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User saved successfully",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Sähköposti on jo käytössä.",
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  user
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        throw new Error("Sähköposti tai salasana on väärin.");
      } else {
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      }
    })
    .then((result) => {
      if (!result) {
        throw new Error("Sähköposti tai salasana on väärin.");
      } else {
        const token = jwt.sign(
          {
            email: fetchedUser.email,
            userId: fetchedUser._id,
            username: fetchedUser.username,
          },
          process.env.KEY,
          { expiresIn: "24h" }
        );
        res.status(200).json({
          token: token,
          expiresIn: 86400,
          username: fetchedUser.username,
        });
      }
    })
    .catch((err) => {
      return res.status(401).json({ message: err.message });
    });
});

module.exports = router;
