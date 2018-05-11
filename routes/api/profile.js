const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Profile Model
const User = require("./../../models/User");
const Profile = require("./../../models/Profile");
// @route GET /api/profile/test
// @desc Test posts route
// @access public
router.get("/test", (req, res) => {
  res.json({
    message: "profile works"
  });
});

// @route GET /api/profile/
// @desc Get current user profile
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "Profile not found for this user!";
          return res.status(404).json(errors);
        }
        res.status(200).json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
