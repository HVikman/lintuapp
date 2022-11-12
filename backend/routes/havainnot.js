const express = require("express");
const Havainto = require("../models/havainto");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

router.post("", checkAuth, (req, res) => {
  const havainto = new Havainto({
    laji: req.body.laji,
    maara: req.body.maara,
    date: req.body.date,
    paikkakunta: req.body.paikkakunta,
    info: req.body.info,
    osoite: req.body.osoite,
    creator: req.userData.userId,
  });
  havainto.save().then((result) => {
    res.status(201).json({ message: "post added", postId: result._id });
  });
});

router.get("/:date", checkAuth, (req, res, next) => {
  Havainto.find({ date: req.params.date, creator: req.userData.userId }).then(
    (documents) => {
      res.status(200).json({
        message: "posts fetched successfully",
        posts: documents,
      });
    }
  );
});

router.get("", checkAuth, (req, res, next) => {
  Havainto.find({
    creator: req.userData.userId,
  }).then((documents) => {
    res.status(200).json({
      message: "posts fetched successfully",
      posts: documents,
    });
  });
});

router.delete("/:id", (req, res, next) => {
  Havainto.deleteOne({ _id: req.params.id }).then((result) => {});
  res.status(200).json({ message: "post deleted" });
});

module.exports = router;
