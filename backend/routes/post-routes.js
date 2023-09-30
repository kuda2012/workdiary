const express = require("express");
const multer = require("multer");
const router = express.Router();
const postController = require("../controllers/post-controller");
const { tokenIsCurrent } = require("../middleware/userMiddleware");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/search", tokenIsCurrent, postController.search);
router.get("/:date", tokenIsCurrent, postController.getPost);

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

module.exports = router;
