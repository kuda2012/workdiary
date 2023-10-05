const express = require("express");
const multer = require("multer");
const router = express.Router();
const postController = require("../controllers/post-controller");
const { tokenIsCurrent } = require("../middleware/userMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/shared-post/:pointerId", postController.getSharedPost);
router.get("/search", tokenIsCurrent, postController.search);

router.post(
  "/create",
  tokenIsCurrent,
  upload.single("summary_voice"),
  postController.create
);
router.post(
  "/generate-share-link",
  tokenIsCurrent,
  postController.generateShareLink
);
router.post(
  "/deactivate-share-link",
  tokenIsCurrent,
  postController.deactivateShareLink
);
router.patch(
  "/update",
  tokenIsCurrent,
  upload.single("summary_voice"),
  postController.update
);
router.delete("/delete", tokenIsCurrent, postController.delete);

module.exports = router;
