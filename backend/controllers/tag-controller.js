const Tag = require("../models/Tag");
const Tab = require("../models/Tab");
const Post = require("../models/Post");

const { decodeJwt } = require("../helpers/decodeJwt");

exports.create = async (req, res) => {
  // if posts exist for the day, add tags to the day
  // if post does not exist for the day, create post for the day, and then add tags
  const { id } = decodeJwt(req.headers.authorization);
  let post = await Post.getPost(id, req.body.date);
  if (!post) {
    post = Post.create(id, req.body);
  }
  const allTags = await Tag.create(post, req.body);
  const tabs = await Tab.getTabs(id, req.body.date);
  if (post && tabs.length > 0) {
    post.tabs = tabs;
  }
  res.send({ date: req.body.date, post: { ...post, tags: allTags } });
};

exports.getTags = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const tags = await Tag.getTags(id, req.params.date);
  res.send({ date: req.params.date, tags });
};

exports.delete = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const post = await Post.getPost(id, req.query.date);
  const updatedTags = await Tag.delete(
    id,
    post.id,
    req.query.tag_id,
    req.query.date
  );
  const tabs = await Tab.getTabs(id, req.query.date);
  if (post && tabs.length > 0) {
    post.tabs = tabs;
  }
  res.send({
    date: req.query.date,
    message: "Your tag has been deleted",
    post: { ...post, tags: updatedTags },
  });
};
