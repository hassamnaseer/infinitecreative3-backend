const express = require("express");
const { userById,userByReferral, userByEmail, allUsers, getUser, updateUser, deleteUser } = require("../controllers/user");
const { requireLogin } = require("../controllers/auth");

const router = express.Router();

router.get("/users", allUsers);
router.get("/user/:userId", getUser);
router.get("/referral-user/:referralLink", getUser);
router.get("/user-email/:email", getUser);
router.put("/user/update/:userId", updateUser);
router.delete("/user/delete/:userId", requireLogin, deleteUser);

router.param("userId", userById);
router.param("referralLink", userByReferral);
router.param("email", userByEmail);

module.exports = router;
