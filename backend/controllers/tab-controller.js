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
    post = Post.create(id, body, summaryVoice);
  }
  const addTabs = await Tab.create(post, req.body);
  res.send({ tabs: addTabs });
};

exports.getTabs = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const tabs = await Tab.getTabs(id, req.params.date);
  res.send({ date: req.params.date, tabs });
};

exports.update = async (req, res) => {
  // const updateTabs = [];
  // for (let tab of req.body.tabs) {
  //   let updatedTab = await Tab.update(tab);
  //   updateTabs.push(updatedTab);
  // }
  // res.send({ tabs: updateTabs });
  const { id } = decodeJwt(req.headers.authorization);
  const post = await Post.getPost(id, req.body.date);
  const updatedTabs = await Tab.bulkUpdate(
    req.body.tabs,
    id,
    post.id,
    req.body.date
  );
  res.send({ date: req.body.date, tabs: updatedTabs });
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
