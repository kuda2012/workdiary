const Post = require("../models/Post");
const Tab = require("../models/Tab");
const Tag = require("../models/Tag");
const { decodeJwt } = require("../helpers/decodeJwt");
const { speechToText } = require("../helpers/speechToText");
const TranscribeLog = require("../models/TranscribeLog");

exports.create = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  let post = await Post.getPost(id, req.body.date);
  let summaryVoice;
  let updatedLog;
  let getLog;
  let transcriptionErrorMsg;
  if (!post) {
    if (req.body.summary_voice && req.body.audio_duration < 180) {
      getLog = await TranscribeLog.getLog(id);
      if (!getLog || getLog?.count < 180) {
        const summaryText = await speechToText(req.body.summary_voice);
        req.body.summary_text = req.body.summary_text
          ? req.body.summary_text.concat(`<p>${summaryText}</p>`)
          : `<p>${summaryText}</p>`;
        updatedLog = await TranscribeLog.updateLog(id);
      } else {
        transcriptionErrorMsg =
          "You have maxed out the amount of transcriptions you can do per day";
      }
    } else if (req.body.summary_voice && req.body.audio_duration > 180) {
      transcriptionErrorMsg =
        "Your voice transcription is too long. It must be less than 180s";
    }
    summaryVoice = req.body.summary_voice
      ? Buffer.from(req.body.summary_voice.split(",")[1], "base64")
      : null;
    post = await Post.create(id, req.body, summaryVoice);
  }
  const allPostDates = await Post.getAllPostDates(id);
  res.send({
    post,
    date: req.body.date,
    all_post_dates: [...allPostDates],
    log: updatedLog ? updatedLog : getLog,
    transcriptior_error_msg: transcriptionErrorMsg,
  });
};

exports.getPost = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const post = await Post.getPost(id, req.query.date);
  const tabs = await Tab.getTabs(id, req.query.date);
  const tags = await Tag.getTags(id, req.query.date);
  if (post && tabs.length > 0) {
    post.tabs = tabs;
  }
  if (post && tags.length > 0) {
    post.tags = tags;
  }
  res.setHeader("Content-Type", "audio/wav");
  res.send({ date: req.query.date, post });
};

exports.getAllPostDates = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const allPostDates = await Post.getAllPostDates(id);
  res.send({ all_post_dates: [...allPostDates] });
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
  let summaryVoice;
  let updatedLog;
  let getLog;
  let transcriptionErrorMsg;
  if (req.body.summary_voice && req.body.audio_duration < 180) {
    getLog = await TranscribeLog.getLog(id);
    if (!getLog || getLog?.count < 180) {
      const summaryText = await speechToText(req.body.summary_voice);
      req.body.summary_text = req.body.summary_text
        ? req.body.summary_text.concat(`<p>${summaryText}</p>`)
        : `<p>${summaryText}</p>`;
      updatedLog = await TranscribeLog.updateLog(id);
    } else {
      transcriptionErrorMsg =
        "You have maxed out the amount of transcriptions you can do per day";
    }
  } else if (req.body.summary_voice && req.body.audio_duration > 180) {
    transcriptionErrorMsg =
      "Your voice transcription is too long. It must be less than 180s";
  }

  summaryVoice = req.body.summary_voice
    ? Buffer.from(req.body.summary_voice.split(",")[1], "base64")
    : null;
  const updatePost = await Post.update(post.id, req.body, summaryVoice);
  const tabs = await Tab.getTabs(id, req.body.date);
  const tags = await Tag.getTags(id, req.body.date);
  if (updatePost && tabs.length > 0) {
    updatePost.tabs = tabs;
  }
  if (updatePost && tags.length > 0) {
    updatePost.tags = tags;
  }
  res.send({
    date: req.body.date,
    post: { ...updatePost },
    log: updatedLog ? updatedLog : getLog,
    transcription_error_msg: transcriptionErrorMsg,
  });
};

exports.delete = async (req, res) => {
  const { id } = decodeJwt(req.headers.authorization);
  const post = await Post.getPost(id, req.query.date);
  if (post) await Post.delete(post.id);
  res.send({ message: `Your post for ${req.query.date} has been deleted` });
};
