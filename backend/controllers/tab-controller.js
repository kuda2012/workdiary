const Tab = require("../models/Tab");
const Post = require("../models/Post");

const { decodeJwt } = require("../helpers/decodeJwt");

exports.create = async (req, res) => {
  // if posts exist for the day, add tabs to the day
  // if post does not exist for the day, create post for the day, and then add tabs
  const { id } = decodeJwt(req.headers.authorization);
  const getOrCreatePostForDay = await Post.getOrCreatePostForDay(id, req.body);
  const addTabs = await Tab.create(getOrCreatePostForDay, req.body);
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
  const getOrCreatePostForDay = await Post.getOrCreatePostForDay(id, req.body);
  const updatedTabs = await Tab.bulkUpdate(
    req.body.tabs,
    id,
    getOrCreatePostForDay.id,
    req.body.date
  );
  res.send({ date: req.body.date, tabs: updatedTabs });
};

exports.delete = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const getOrCreatePostForDay = await Post.getOrCreatePostForDay(id, req.body);
  await Tab.delete(getOrCreatePostForDay.id, req.body.tab_id);
  res.send({ message: "Your tab has been deleted" });
};
