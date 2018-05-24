const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
//Load user model
const User = require("./../../models/User");
const keys = require("./../../config/keys");

//Load input validation
const validateRegisterInput = require("./../../validation/register");
const validateLoginInput = require("./../../validation/login");

// @route POST /api/users/register
// @desc Register user
// @access public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists!";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              res.json({
                user
              });
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST /api/users/login
// @desc Login user /Return JWT
// @access public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const { errors, isValid } = validateLoginInput(req.body);
  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //Find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found!";
      return res.status(404).json(errors);
    }
    //check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User matched
        //sign the token
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };
        jwt.sign(
          payload,
          keys.secretOrKey,
          (err, token) => {
            res.json({ success: true, token: "Bearer " + token });
          }
        );
      } else {
        errors.password = "Password incorrect!";
        return res.status(400).json(errors);
      }
    });
  });
});
// @route GET /api/users/current
// @desc return current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);
module.exports = router;
