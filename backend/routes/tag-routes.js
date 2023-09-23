const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tag-controller");
const { tokenIsCurrent } = require("../middleware/userMiddleware");

router.get("/:date", tokenIsCurrent, tagController.getTags);
router.post("/create", tokenIsCurrent, tagController.create);
router.patch("/update", tokenIsCurrent, tagController.update);

module.exports = router;
