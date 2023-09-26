const Tag = require("../models/Tag");
const Post = require("../models/Post");

const { decodeJwt } = require("../helpers/decodeJwt");

exports.create = async (req, res) => {
  // if posts exist for the day, add tags to the day
  // if post does not exist for the day, create post for the day, and then add tags
  const { id } = decodeJwt(req.headers.authorization);
  const getOrCreatePostForDay = await Post.getOrCreatePostForDay(id, req.body);
  const allTags = await Tag.create(getOrCreatePostForDay, req.body);
  res.send({ date: req.body.date, tags: allTags });
};

exports.getTags = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const tags = await Tag.getTags(id, req.params.date);
  res.send({ date: req.params.date, tags });
};

exports.delete = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const getOrCreatePostForDay = await Post.getOrCreatePostForDay(id, req.body);
  const updatedTags = await Tag.delete(
    id,
    getOrCreatePostForDay.id,
    req.body.tag_id,
    req.body.date
  );
  res.send({
    date: req.body.date,
    message: "You tag has been deleted",
    tags: updatedTags,
  });
};
