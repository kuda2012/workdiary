const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user-controller");
const {
  tokenIsCurrent,
  userIsValidated,
} = require("../middleware/userMiddleware");

router.post("/login-google", UserController.loginGoogle);
router.post("/login", UserController.login);
router.post("/signup", userIsValidated, UserController.signup);
router.post("/change-alarm", tokenIsCurrent, UserController.changeAlarm);
router.patch("/change-password", tokenIsCurrent, UserController.changePassword);
router.patch("/reset-password", tokenIsCurrent, UserController.resetPassword);
router.post("/forgot-password", UserController.forgotPassword);
router.get("/account-info", tokenIsCurrent, UserController.getAccountInfo);
router.get(
  "/check-worksnap-token",
  tokenIsCurrent,
  UserController.checkedToken
);

router.delete("/delete", tokenIsCurrent, UserController.delete);

module.exports = router;
