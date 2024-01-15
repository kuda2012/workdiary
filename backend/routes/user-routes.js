const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user-controller");
const {
  tokenIsCurrent,
  forgotPasswordRateLimiter,
  resetPasswordRateLimiter,
  verifyAccountVerificationToken,
  resetPasswordToken,
  userIsValidatedSignup,
  changePasswordValidated,
  resetPasswordValidated,
} = require("../middleware/userMiddleware");

router.get("/account-info", tokenIsCurrent, UserController.getAccountInfo);
router.get(
  "/verify-account",
  verifyAccountVerificationToken,
  UserController.verifyAccount
);
router.post(
  "/check-workdiary-token",
  tokenIsCurrent,
  UserController.checkedToken
);
router.post("/login-signup-google", UserController.loginOrSignupGoogle);
router.post("/login", UserController.login);
router.post("/signup", userIsValidatedSignup, UserController.signup);
router.post("/change-alarm", tokenIsCurrent, UserController.changeAlarm);
router.post("/other-settings", tokenIsCurrent, UserController.otherSettings);
router.post("/contact-us", UserController.contactUs);
router.post(
  "/forgot-password",
  forgotPasswordRateLimiter,
  UserController.forgotPassword
);
router.patch(
  "/change-password",
  tokenIsCurrent,
  changePasswordValidated,
  UserController.changePassword
);
router.patch(
  "/reset-password",
  resetPasswordToken,
  resetPasswordValidated,
  resetPasswordRateLimiter,
  UserController.resetPassword
);
router.delete("/delete", tokenIsCurrent, UserController.delete);

module.exports = router;
