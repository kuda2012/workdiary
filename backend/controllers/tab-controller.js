const Tab = require("../models/Tab");
const Tag = require("../models/Tag");
const Post = require("../models/Post");

const { decodeJwt } = require("../helpers/decodeJwt");

exports.create = async (req, res) => {
  // if posts exist for the day, add tabs to the day
  // if post does not exist for the day, create post for the day, and then add tabs
  const { id } = decodeJwt(req.headers.authorization);
  let post = await Post.getPost(id, req.body.date);
  if (!post) {
    post = await Post.create(id, req.body);
  }
  const addTabs = await Tab.create(post, req.body);
  const tags = await Tag.getTags(id, req.body.date);
  if (post && tags.length > 0) {
    post.tags = tags;
  }
  res.send({ date: req.body.date, post: { ...post, tabs: addTabs } });
};

exports.getTabs = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const tabs = await Tab.getTabs(id, req.params.date);
  res.send({ date: req.params.date, tabs });
};

exports.update = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const post = await Post.getPost(id, req.body.date);
  console.log("why here");
  const updatedTabs = await Tab.bulkUpdate(
    req.body.tabs,
    id,
    post.id,
    req.body.date
  );
  const tags = await Tag.getTags(id, req.query.date);
  if (post && tags.length > 0) {
    post.tags = tags;
  }
  res.send({ date: req.body.date, post: { ...post, tabs: updatedTabs } });
};

exports.bulkDelete = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const post = await Post.getPost(id, req.query.date);
  const updatedTabs = await Tab.bulkDelete(post, req.query.tab_ids);
  const tags = await Tag.getTags(id, req.query.date);
  if (post && tags.length > 0) {
    post.tags = tags;
  }
  res.send({
    date: req.query.date,
    message: "Your tabs have been deleted",
    post: { ...post, tabs: updatedTabs },
  });
};

exports.delete = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const post = await Post.getPost(id, req.query.date);
  const updatedTabs = await Tab.delete(
    id,
    post.id,
    req.query.tab_id,
    req.query.date
  );
  const tags = await Tag.getTags(id, req.query.date);
  if (post && tags.length > 0) {
    post.tags = tags;
  }
  res.send({
    date: req.query.date,
    message: "Your tab has been deleted",
    post: { ...post, tabs: updatedTabs },
  });
};
