const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const index = require("../controllers/users.js");

router.get("/signup", index.signupejs);

router.post("/signup", wrapAsync(index.signup));

router.get("/login", index.loginejs);

router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), index.login);
router.get("/logout", index.logout);
module.exports = router;
