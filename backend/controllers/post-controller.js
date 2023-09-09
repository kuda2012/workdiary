const Post = require("../models/Post");
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
  /// use token to get sub
  // if
  const { id } = jwt.decode(req.headers.worksnap_token);
  const getOrCreatePostForDay = await Post.getOrCreatePostForDay(id, req.body);
  res.send({ post: getOrCreatePostForDay });
};
