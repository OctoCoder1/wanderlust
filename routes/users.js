const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js")

router.route("/signup")
.get(userController.signupForm)
.post(wrapasync(userController.signUp));

router.route("/login")
.get(userController.loginForm)
.post(saveredirectUrl,passport.authenticate("local" , {
    failureRedirect : "/login",
    failureFlash : true
}), userController.logIn);

router.get("/logout",userController.logout);

module.exports = router;