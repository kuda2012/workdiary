const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const { decodeJwt } = require("../helpers/decodeJwt");

exports.create = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const getOrCreatePostForDay = await Post.getOrCreatePostForDay(id, req.body);
  res.send({ post: getOrCreatePostForDay });
};

exports.getPost = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const post = await Post.getPost(id, req.params.date);
  res.send({ post });
};

exports.update = async (req, res) => {
  const getOrCreatePostForDay = await Post.update(req.body);
  res.send({ post: getOrCreatePostForDay });
};
