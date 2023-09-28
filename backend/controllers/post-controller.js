const Post = require("../models/Post");
const Tab = require("../models/Tab");
const { decodeJwt } = require("../helpers/decodeJwt");
const { Deepgram } = require("@deepgram/sdk");
const { DEEPGRAM_API_KEY } = require("../config");

exports.create = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const deepgram = new Deepgram(DEEPGRAM_API_KEY);
  const source = {
    buffer: req.file.buffer,
    mimetype: "audio/wav",
  };
  const response = await deepgram.transcription.preRecorded(source, {
    smart_format: true,
    model: "nova",
    summarize: "v2",
  });
  req.body.summary_text =
    response.results.channels[0].alternatives[0].transcript;
  console.log(response.results.summary);
  // if (req.body.is_new_voice_note) {
  //const response = await axios.post("http://deepgram", {voice:req.body.summary_voice});
  //req.body = { ...req.body, summary_text: response.data.text };
  // }
  const summaryVoice = req.file ? Buffer.from(req.file.buffer, "binary") : null;
  const getOrCreatePostForDay = await Post.getOrCreatePostForDay(
    id,
    req.body,
    summaryVoice
  );
  res.send({ post: getOrCreatePostForDay });
};

exports.getPost = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const post = await Post.getPost(id, req.params.date);
  const tabs = await Tab.getTabs(id, req.params.date);
  res.send({ post: { ...post, tabs: tabs } });
};

exports.update = async (req, res) => {
  // if (req.body.is_new_voice_note) {
  //const response = await axios.post("http://deepgram", {voice:req.body.summary_voice});
  //req.body = { ...req.body, summary_text: response.data.text };
  // }
  const { id } = decodeJwt(req.headers.authorization);
  const getOrCreatePostForDay = await Post.getOrCreatePostForDay(id, req.body);
  const summaryVoice = req.file
    ? Buffer.from(req.file.buffer, "binary")
    : undefined;
  const updatePost = await Post.update(
    getOrCreatePostForDay.id,
    req.body,
    summaryVoice
  );
  res.send({ post: updatePost });
};

exports.delete = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const post = await Post.getPost(id, req.body.date);
  await Post.delete(post.id);
  res.send({ message: `Your post for ${req.body.date} has been deleted` });
};
