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
    console.log(newPost);
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
// @route POST /api/posts/like/:id
// @desc Like a  post
// @access private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyliked: "User already liked this post!" });
        }
        //add user id to likes array
        post.likes.unshift({ user: req.user.id });
        post
          .save()
          .then(post => res.status(200).json(post))
          .catch(err => res.json(err));
      });
    });
  }
);

// @route POST /api/posts/unlike/:id
// @desc unlike a  post
// @access private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0
        ) {
          return res
            .status(400)
            .json({ notliked: "You have not yet liked  this post!" });
        }
        //Get the remove index
        const removeIndex = post.likes
          .map(item => item.user.toString())
          .indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);
        post
          .save()
          .then(post => res.status(200).json(post))
          .catch(err => res.json(err));
      });
    });
  }
);
// @route POST /api/posts/comment/:id
// @desc comment on a  post
// @access private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };
        //add to comments array
        post.comments.unshift(newComment);
        post
          .save()
          .then(post => res.status(200).json(post))
          .catch(err =>
            res.status(400).json({ postnotfound: "No post found!" })
          );
      })
      .catch(err => res.json(res));
  }
);

// @route DELETE /api/posts/comment/:id/:comment_id
// @desc delete a comment from a  post
// @access private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexist: "Comment does not exist!" });
        }
        //get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);
        post.comments.splice(removeIndex, 1);
        post
          .save()
          .then(post => res.status(200).json(post))
          .catch(err =>
            res.status(400).json({ postnotfound: "No post found!" })
          );
      })
      .catch(err => res.json(err));
  }
);
module.exports = router;
