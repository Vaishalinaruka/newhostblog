const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

const bcrypt = require("bcrypt");

//CREATE POST
router.post("/", async (req, res) => {
  const newPost = await new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//DELETE POST

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.username === req.body.username) {
      try {
        await post.deleteOne(); //we can also use findByIdAndDelete
        res.status(200).json("Post has been deleted");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET SINGLE POST

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET ALL POSTS

//example : localhost:5000/api/posts?user=Angela

router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat; //catName means category name
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username: username }); //      posts = await Post.find({username}); bcoz username(spelling) has same name here and in Post model. this happened in ES6.
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        }, //It means look inside categories array in post model and if inside it includes this catName then find it and assign it to this posts.
      });
    } else {
      posts = await Post.find(); // If there is no username or category name then just fetch all posts.
    }

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
