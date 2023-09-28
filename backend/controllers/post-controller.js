const Post = require("../models/Post");
const Tab = require("../models/Tab");
const { decodeJwt } = require("../helpers/decodeJwt");
const { speechToText } = require("../helpers/speechToText");

exports.create = async (req, res) => {
  if (req.file) {
    req.body.summary_text = await speechToText(req);
  }
  const summaryVoice = req.file ? Buffer.from(req.file.buffer, "binary") : null;
  const { id } = decodeJwt(req.headers.authorization);
  let post = await Post.getPost(id, req.body.date);
  if (!post) {
    post = Post.create(id, body, summaryVoice);
  }
  res.send({ post });
};

exports.getPost = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const post = await Post.getPost(id, req.params.date);
  const tabs = await Tab.getTabs(id, req.params.date);
  res.send({ post: { ...post, tabs: tabs } });
};

exports.update = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const post = await Post.getPost(id, req.body.date);
  if (req.file) {
    req.body.summary_text = await speechToText(req);
  }
  const summaryVoice = req.file ? Buffer.from(req.file.buffer, "binary") : null;
  const updatePost = await Post.update(post.id, req.body, summaryVoice);
  res.send({ post: updatePost });
};

exports.delete = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const post = await Post.getPost(id, req.body.date);
  await Post.delete(post.id);
  res.send({ message: `Your post for ${req.body.date} has been deleted` });
};
