const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Profile Model
const User = require("./../../models/User");
const Profile = require("./../../models/Profile");
const validateProfileInput = require("./../../validation/profile");

// @route GET /api/profile/
// @desc Get current user profile
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
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
// @route GET /api/profile/all
// @desc Get all profiles
// @access Public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles!";
        return res.status(404).json(errors);
      }
      res.status(200).json(profiles);
    })
    .catch(err => res.status(404).json(err));
});

// @route GET /api/profile/handle/:handle
// @desc Get  profile by handle
// @access Public
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There's not profile for this user!";
        res.status(404).json(errors);
      }
      res.status(200).json(profile);
    })
    .catch(err => res.status(404).json(err));
});
// @route GET /api/profile/user/:user_id
// @desc Get  profile by id
// @access Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There's not profile for this user!";
        res.status(404).json(errors);
      }
      res.status(200).json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There's not profile for this user!" })
    );
});

// @route Post /api/profile/
// @desc create/edit user profile
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //get all fields
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubUsername)
      profileFields.githubUsername = req.body.githubUsername;
    //skills- split into an array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    //social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //update profile
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.status(200).json(profile));
      } else {
        //create profile

        //check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            return res.status(400).json(errors);
          }
          //save profile
          new Profile(profileFields).save().then(profile => {
            res.status(200).json(profile);
          });
        });
      }
    });
  }
);

module.exports = router;
