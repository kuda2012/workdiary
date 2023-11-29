const express = require("express");
const router = express.Router();
const tabController = require("../controllers/tab-controller");
const { tokenIsCurrent } = require("../middleware/userMiddleware");

router.get("/:date", tokenIsCurrent, tabController.getTabs);
router.post("/create", tokenIsCurrent, tabController.create);
router.patch("/update", tokenIsCurrent, tabController.update);
router.delete("/bulk-delete", tokenIsCurrent, tabController.bulkDelete);
router.delete("/delete", tokenIsCurrent, tabController.delete);

module.exports = router;
