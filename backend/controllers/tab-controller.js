const Tab = require("../models/Tab");
const Tag = require("../models/Tag");
const Post = require("../models/Post");
const { decodeJwt } = require("../helpers/decodeJwt");

exports.create = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

exports.getTabs = async (req, res, next) => {
  try {
    const { id } = decodeJwt(req.headers.authorization);
    const tabs = await Tab.getTabs(id, req.params.date);
    res.send({ date: req.params.date, tabs });
  } catch (error) {
    next(error);
  }
};

exports.bulkDelete = async (req, res, next) => {
  try {
    const { id } = decodeJwt(req.headers.authorization);
    const post = await Post.getPost(id, req.query.date);
    const updatedTabs = await Tab.bulkDelete(post, req.query.tab_ids);
    const postDeleted = await Post.deletePostIfEmpty(id, req.query.date);
    const allPostDates = await Post.getAllPostDates(id);
    if (postDeleted) {
      return res.send({
        date: req.query.date,
        post: null,
        message: "Your tabs have been deleted",
        all_post_dates: [...allPostDates],
      });
    }
    const tags = await Tag.getTags(id, req.query.date);
    if (post && tags.length > 0) {
      post.tags = tags;
    }
    res.send({
      date: req.query.date,
      message: "Your tabs have been deleted",
      post: { ...post, tabs: updatedTabs },
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = decodeJwt(req.headers.authorization);
    const post = await Post.getPost(id, req.query.date);
    const updatedTabs = await Tab.delete(
      id,
      post.id,
      req.query.tab_id,
      req.query.date
    );
    const postDeleted = await Post.deletePostIfEmpty(id, req.query.date);
    const allPostDates = await Post.getAllPostDates(id);
    if (postDeleted) {
      return res.send({
        date: req.query.date,
        post: null,
        message: "Your tab has been deleted",
        all_post_dates: [...allPostDates],
      });
    }
    const tags = await Tag.getTags(id, req.query.date);
    if (post && tags.length > 0) {
      post.tags = tags;
    }
    res.send({
      date: req.query.date,
      message: "Your tab has been deleted",
      post: { ...post, tabs: updatedTabs },
    });
  } catch (error) {
    next(error);
  }
};
