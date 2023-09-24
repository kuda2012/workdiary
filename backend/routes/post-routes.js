const express = require("express");
const router = express.Router();
const postController = require("../controllers/post-controller");
const { tokenIsCurrent } = require("../middleware/userMiddleware");

router.get("/:date", tokenIsCurrent, postController.getPost);
router.post("/create", tokenIsCurrent, postController.create);
router.patch("/update", tokenIsCurrent, postController.update);
router.delete("/delete/:date", tokenIsCurrent, postController.delete);

module.exports = router;
