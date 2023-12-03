const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user-controller");
const {
  tokenIsCurrent,
  userIsValidated,
  emailResetLimiter
} = require("../middleware/userMiddleware");

router.get("/account-info", tokenIsCurrent, UserController.getAccountInfo);
router.get(
  "/check-workdiary-token",
  tokenIsCurrent,
  UserController.checkedToken
);
router.post("/login-google", UserController.loginGoogle);
router.post("/login", UserController.login);
router.post("/signup", userIsValidated, UserController.signup);
router.post("/change-alarm", tokenIsCurrent, UserController.changeAlarm);
router.post("/contact-us", UserController.contactUs);
router.post(
  "/forgot-password",
  emailResetLimiter,
  UserController.forgotPassword
);
router.patch("/change-password", tokenIsCurrent, UserController.changePassword);
router.patch("/reset-password", tokenIsCurrent, UserController.resetPassword);
router.delete("/delete", tokenIsCurrent, UserController.delete);

module.exports = router;
