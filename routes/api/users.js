const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//Load user model
const User = require("./../../models/User");
const keys = require("./../../config/keys");

// @route GET /api/users/test
// @desc Test posts route
// @access public
router.get("/test", (req, res) => {
  res.json({
    message: "Users works"
  });
});

// @route GET /api/users/register
// @desc Register user
// @access public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({
        email: "Email already exists!"
      });
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

// @route GET /api/users/login
// @desc Login user /Return JWT
// @access public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({
        user: "User not found"
      });
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
          { expiresIn: 3600 },
          (err, token) => {
            res.json({ success: true, token: "Bearer " + token });
          }
        );
      } else {
        return res.status(400).json({ password: "Password incorrect!" });
      }
    });
  });
});
module.exports = router;
