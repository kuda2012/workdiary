const Tag = require("../models/Tag");
const Post = require("../models/Post");

const { decodeJwt } = require("../helpers/decodeJwt");

exports.create = async (req, res) => {
  // if posts exist for the day, add tags to the day
  // if post does not exist for the day, create post for the day, and then add tags
  const { id } = decodeJwt(req.headers.authorization);
  const getOrCreatePostForDay = await Post.getOrCreatePostForDay(id, req.body);
  const addtags = await Tag.create(getOrCreatePostForDay, req.body);
  res.send({ tags: addtags });
};

exports.gettags = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const tags = await Tag.gettags(id, req.params.date);
  res.send({ date: req.params.date, tags });
};

exports.update = async (req, res) => {
  // const updatetags = [];
  // for (let tag of req.body.tags) {
  //   let updatedtag = await tag.update(tag);
  //   updatetags.push(updatedtag);
  // }
  // res.send({ tags: updatetags });
  const { id } = decodeJwt(req.headers.authorization);
  const getOrCreatePostForDay = await Post.getOrCreatePostForDay(id, req.body);
  const updatedtags = await Tag.bulkUpdate(
    req.body.tags,
    id,
    getOrCreatePostForDay.id,
    req.body.date
  );
  res.send({ date: req.body.date, tags: updatedtags });
};
