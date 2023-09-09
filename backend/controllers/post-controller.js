const Post = require("../models/Post");
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
  const { id } = jwt.decode(req.headers.worksnap_token);
  const getOrCreatePostForDay = await Post.getOrCreatePostForDay(id, req.body);
  res.send({ post: getOrCreatePostForDay });
};

exports.update = async (req, res) => {
  const getOrCreatePostForDay = await Post.update(req.body);
  res.send({ post: getOrCreatePostForDay });
};
