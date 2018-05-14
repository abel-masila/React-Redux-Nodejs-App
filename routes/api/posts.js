const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Post = require("./../../models/Post");
const Profile = require("./../../models/Profile");

const validatePostInput = require("./../../validation/post");

// @route GET /api/posts
// @desc get posts
// @access public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(404).json({ nopostfound: "No posts found" }));
});

// @route GET /api/posts/:id
// @desc get post by id
// @access public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .sort({ date: -1 })
    .then(post => res.status(200).json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that id" })
    );
});

// @route POST /api/posts
// @desc Create a  post
// @access private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    //Create post
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost
      .save()
      .then(post => {
        res.status(200).json(post);
      })
      .catch(err => res.json(err));
  }
);
// @route DELETE /api/posts/:id
// @desc delete a  post
// @access private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        //Get Post owner
        if (post.user.toString() !== req.user.id) {
          return res
            .status(401)
            .json({ notauthorized: "User not authorized!" });
        }
        post
          .remove()
          .then(() => res.json({ success: true }))
          .catch(() =>
            res.status(404).json({ postnotfound: "Post not found!" })
          );
      });
    });
  }
);

module.exports = router;
