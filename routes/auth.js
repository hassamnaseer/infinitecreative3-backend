const express = require("express");
const { signup, login, logout } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { userSignupValidator } = require("../validator");

const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.post("/login", login);
router.get("/logout", logout);

router.param("userId", userById)

module.exports = router;
