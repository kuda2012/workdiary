const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user-controller");
const { tokenIsCurrent } = require("../middleware/userMiddleware");

router.post("/login", UserController.login);
router.post("/change-alarm", tokenIsCurrent, UserController.changeAlarm);
router.get("/account-info", tokenIsCurrent, UserController.getAccountInfo);
router.get(
  "/check-worksnap-token",
  tokenIsCurrent,
  UserController.checkedToken
);

router.delete("/delete", tokenIsCurrent, UserController.delete);

module.exports = router;
