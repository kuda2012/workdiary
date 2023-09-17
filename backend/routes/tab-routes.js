const express = require("express");
const router = express.Router();
const tabController = require("../controllers/tab-controller");
const { tokenIsCurrent } = require("../middleware/userMiddleware");

router.get("/:date", tokenIsCurrent, tabController.getTabs);
router.post("/create", tokenIsCurrent, tabController.create);
router.get("/update", tokenIsCurrent, tabController.update);

module.exports = router;
