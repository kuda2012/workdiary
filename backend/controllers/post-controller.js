const Post = require("../models/Post");
const Tab = require("../models/Tab");
const jwt = require("jsonwebtoken");
const { decodeJwt } = require("../helpers/decodeJwt");
const { response } = require("express");

exports.create = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  // if (req.body.is_new_voice_note) {
  //const response = await axios.post("http://deepgram", {voice:req.body.summary_voice});
  //req.body = { ...req.body, summary_text: response.data.text };
  // }
  const getOrCreatePostForDay = await Post.getOrCreatePostForDay(id, req.body);
  res.send({ post: getOrCreatePostForDay });
};

exports.getPost = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const post = await Post.getPost(id, req.params.date);
  const tabs = await Tab.getTabs(id, req.params.date);
  res.send({ post: { ...post, tabs: tabs } });
};

exports.update = async (req, res) => {
  const getOrCreatePostForDay = await Post.update(req.body);
  res.send({ post: getOrCreatePostForDay });
};
