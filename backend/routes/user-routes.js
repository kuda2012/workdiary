const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user-controller");
const { tokenIsCurrent } = require("../middleware/userMiddleware");

router.post("/login", UserController.login);
router.get("/account-info", tokenIsCurrent, UserController.getAccountInfo);
router.delete("/delete", tokenIsCurrent, UserController.delete);

module.exports = router;
