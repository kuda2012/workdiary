const express = require("express");
const multer = require("multer");
const router = express.Router();
const postController = require("../controllers/post-controller");
const { tokenIsCurrent } = require("../middleware/userMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/list-all-posts", tokenIsCurrent, postController.listAllPosts);
router.get("/get-post", tokenIsCurrent, postController.getPost);
router.get("/search", tokenIsCurrent, postController.search);

router.post(
  "/create",
  tokenIsCurrent,
  upload.single("summary_voice"),
  postController.create
);
router.patch(
  "/update",
  tokenIsCurrent,
  upload.single("summary_voice"),
  postController.update
);
router.delete("/delete", tokenIsCurrent, postController.delete);
router.delete("/multi-delete", tokenIsCurrent, postController.multiDelete);

// router.get("/shared-post/:pointerId", postController.getSharedPost);
// router.post(
//   "/generate-share-link",
//   tokenIsCurrent,
//   postController.generateShareLink
// );
// router.post(
//   "/deactivate-share-link",
//   tokenIsCurrent,
//   postController.deactivateShareLink
// );

module.exports = router;
