const express = require("express");
const router = express.Router();
const postController = require("../controllers/post-controller");
const { tokenIsCurrent } = require("../middleware/userMiddleware");

router.post("/create", tokenIsCurrent, postController.create);

module.exports = router;
