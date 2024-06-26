const Tag = require("../models/Tag");
const Tab = require("../models/Tab");
const Post = require("../models/Post");
const { decodeJwt } = require("../helpers/decodeJwt");

exports.create = async (req, res, next) => {
  try {
    const { id } = decodeJwt(req.headers.authorization);
    let post = await Post.getPost(id, req.body.date);
    if (!post) {
      post = await Post.create(id, req.body);
    }
    const allTags = await Tag.create(post, req.body);
    const tabs = await Tab.getTabs(id, req.body.date);
    if (post && tabs.length > 0) {
      post.tabs = tabs;
    }
    res.send({ date: req.body.date, post: { ...post, tags: allTags } });
  } catch (error) {
    next(error);
  }
};

exports.getTags = async (req, res, next) => {
  try {
    const { id } = decodeJwt(req.headers.authorization);
    const tags = await Tag.getTags(id, req.params.date);
    res.send({ date: req.params.date, tags });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = decodeJwt(req.headers.authorization);
    const post = await Post.getPost(id, req.query.date);
    const updatedTags = await Tag.delete(
      id,
      post.id,
      req.query.tag_id,
      req.query.date
    );
    const postDeleted = await Post.deletePostIfEmpty(id, req.query.date);
    const allPostDates = await Post.getAllPostDates(id);
    if (postDeleted) {
      return res.send({
        date: req.query.date,
        post: null,
        message: "Your tag has been deleted",
        all_post_dates: [...allPostDates],
      });
    }
    const tabs = await Tab.getTabs(id, req.query.date);
    if (post && tabs.length > 0) {
      post.tabs = tabs;
    }
    res.send({
      date: req.query.date,
      message: "Your tag has been deleted",
      post: { ...post, tags: updatedTags },
    });
  } catch (error) {
    next(error);
  }
};
