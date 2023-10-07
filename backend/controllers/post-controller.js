const Post = require("../models/Post");
const Tab = require("../models/Tab");
const Tag = require("../models/Tag");
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
    post = await Post.create(id, req.body, summaryVoice);
  }
  res.send({ post });
};

exports.getPost = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const post = await Post.getPost(id, req.query.date);
  const tabs = await Tab.getTabs(id, req.query.date);
  const tags = await Tag.getTags(id, req.query.date);
  if (tabs) {
    post.tabs = tabs;
  }
  if (tags) {
    post.tags = tags;
  }

  res.send({ date: req.query.date, post });
};

exports.getSharedPost = async (req, res) => {
  const post = await Post.getSharedPost(req.params.pointerId);
  const tabs = await Tab.getTabs(post.user_id, post.date);
  res.send({ post: { ...post, tabs: tabs } });
};

exports.generateShareLink = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const post = await Post.getPost(id, req.body.date);
  const shareLinkInfo = await Post.generateShareLink(post.id);
  res.send({ link: shareLinkInfo });
};

exports.deactivateShareLink = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const post = await Post.getPost(id, req.body.date);
  await Post.deactivateShareLink(post.id);
  res.send({
    post_id: post.id,
    message: "Access to your post has now been revoked from other users",
  });
};

exports.search = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const searchResults = await Post.search(id, req.query.query);
  res.send({ results: searchResults });
};

exports.update = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const post = await Post.getPost(id, req.body.date);
  if (req.file) {
    req.body.summary_text = req.body.summary_text.concat(`E'\\n'`);
    const summaryText = await speechToText(req.file.buffer);
    req.body.summary_text = req.body.summary_text
      .concat(`E'\\n'`)
      .concat(summaryText);
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
