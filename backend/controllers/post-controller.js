const { decodeJwt } = require("../helpers/decodeJwt");
const { speechToText } = require("../helpers/speechToText");
const { ENCRYPTION_KEY } = require("../config");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const Post = require("../models/Post");
const Tab = require("../models/Tab");
const Tag = require("../models/Tag");
const TranscribeLog = require("../models/TranscribeLog");
const ExpressError = require("../expressError");

exports.create = async (req, res, next) => {
  try {
    const { id } = decodeJwt(req.headers.authorization);
    let post = await Post.getPost(id, req.body.date);
    if (!post) {
      req.body.summary_text = req.body.summary_text
        ? CryptoJS.AES.decrypt(req.body.summary_text, ENCRYPTION_KEY).toString(
            CryptoJS.enc.Utf8
          )
        : null;
      if (req.body.summary_voice && req.body.audio_duration <= 180) {
        const getLog = await TranscribeLog.getLog(id);
        if (!getLog || getLog?.count < 100) {
          const summaryText = await speechToText(req.body.summary_voice);
          req.body.summary_text = req.body.summary_text
            ? req.body.summary_text.concat(
                `<p>[${moment().format("h:mm A")}] ${summaryText}</p>`
              )
            : `<p>[${moment().format("h:mm A")}] ${summaryText}</p>`;
          await TranscribeLog.create(id, summaryText);
        } else {
          throw new ExpressError(
            "You have maxed out the amount of transcriptions you can do per day",
            403
          );
        }
      } else if (req.body.summary_voice && req.body.audio_duration > 180) {
        throw new ExpressError(
          "Your voice transcription is too long. It must be less than 180s",
          403
        );
      }
      if (req.body?.summary_text?.replace(/<[^>]+>/g, "")?.length > 20000) {
        throw new ExpressError("Entry is too long (20000 characters)", 403);
      }
      req.body.summary_text = req.body.summary_text
        ? CryptoJS.AES.encrypt(req.body.summary_text, ENCRYPTION_KEY).toString()
        : null;
      post = await Post.create(id, req.body);
    }
    const allPostDates = await Post.getAllPostDates(id);
    res.send({
      post,
      date: req.body.date,
      all_post_dates: [...allPostDates],
    });
  } catch (error) {
    next(error);
  }
};

exports.getPost = async (req, res, next) => {
  try {
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
    const allPostDates = await Post.getAllPostDates(id);
    res.send({ date: req.query.date, post, all_post_dates: [...allPostDates] });
  } catch (error) {
    next(error);
  }
};

exports.listAllPosts = async (req, res, next) => {
  try {
    const { id } = decodeJwt(req.headers.authorization);
    const postsList = await Post.listAllPosts(
      id,
      Number(req.query.current_page || 1)
    );
    res.send({
      posts_list: [...postsList.posts],
      pagination: postsList.pagination,
    });
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { id } = decodeJwt(req.headers.authorization);
    const searchResults = await Post.search(
      id,
      req.query.query,
      req.query.current_page
    );
    res.send({
      results: searchResults.results,
      query: req.query.query,
      pagination: searchResults.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// exports.search = async (req, res, next) => {
//   try {
//     const { id } = decodeJwt(req.headers.authorization);
//     const searchResults = await Post.search(
//       id,
//       req.query.query,
//       req.query.current_page
//     );
//     res.send({ results: searchResults, query: req.query.query });
//   } catch (error) {
//     next(error);
//   }
// };

exports.update = async (req, res, next) => {
  try {
    const { id } = decodeJwt(req.headers.authorization);
    const post = await Post.getPost(id, req.body.date);
    req.body.summary_text = req.body.summary_text
      ? CryptoJS.AES.decrypt(req.body.summary_text, ENCRYPTION_KEY).toString(
          CryptoJS.enc.Utf8
        )
      : null;
    if (req.body.summary_voice && req.body.audio_duration < 180) {
      const getLog = await TranscribeLog.getLog(id);
      if (!getLog || getLog?.count < 100) {
        const summaryText = await speechToText(req.body.summary_voice);
        req.body.summary_text = req.body.summary_text
          ? req.body.summary_text.concat(
              `<p>[${moment().format("h:mm A")}] ${summaryText}</p>`
            )
          : `<p>[${moment().format("h:mm A")}] ${summaryText}</p>`;
        await TranscribeLog.create(id, summaryText);
      } else {
        throw new ExpressError(
          "You have maxed out the amount of transcriptions you can do per day",
          403
        );
      }
    } else if (req.body.summary_voice && req.body.audio_duration > 180) {
      throw new ExpressError(
        "You have maxed out the amount of transcriptions you can do per day",
        403
      );
    }
    if (req.body?.summary_text?.replace(/<[^>]+>/g, "")?.length > 20000) {
      throw new ExpressError(
        "Entry is too long (20000 characters). Any extra characters will not be saved",
        403
      );
    }
    req.body.summary_text = req.body.summary_text
      ? CryptoJS.AES.encrypt(req.body.summary_text, ENCRYPTION_KEY).toString()
      : null;
    const updatePost = await Post.update(post.id, req.body);
    const tabs = await Tab.getTabs(id, req.body.date);
    const tags = await Tag.getTags(id, req.body.date);
    if (updatePost && tabs.length > 0) {
      updatePost.tabs = tabs;
    }
    if (updatePost && tags.length > 0) {
      updatePost.tags = tags;
    }
    const allPostDates = await Post.getAllPostDates(id);
    res.send({
      date: req.body.date,
      post: { ...updatePost },
      all_post_dates: [...allPostDates],
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = decodeJwt(req.headers.authorization);
    const post = await Post.getPost(id, req.query.date);
    if (post) await Post.delete(post.id);
    const allPostDates = await Post.getAllPostDates(id);
    res.send({
      message: `Your post for ${req.query.date} has been deleted`,
      all_post_dates: [...allPostDates],
    });
  } catch (error) {
    next(error);
  }
};

// exports.getSharedPost = async (req, res, next) => {
//   const post = await Post.getSharedPost(req.params.pointerId);
//   const tabs = await Tab.getTabs(post.user_id, post.date);
//   res.send({ post: { ...post, tabs: tabs } });
// };

// exports.generateShareLink = async (req, res, next) => {
//   const { id } = decodeJwt(req.headers.authorization);
//   const post = await Post.getPost(id, req.body.date);
//   const shareLinkInfo = await Post.generateShareLink(post.id);
//   res.send({ link: shareLinkInfo });
// };

// exports.deactivateShareLink = async (req, res, next) => {
//   const { id } = decodeJwt(req.headers.authorization);
//   const post = await Post.getPost(id, req.body.date);
//   await Post.deactivateShareLink(post.id);
//   res.send({
//     post_id: post.id,
//     message: "Access to your post has now been revoked from other users",
//   });
// };
