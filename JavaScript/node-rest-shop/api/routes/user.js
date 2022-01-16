const express = require("express");
const router = express.Router();
const UserController = require("../controllers/users");
const checkAuth = require("../middleware/check-auth");

router.get("/", UserController.get_all_users);

router.post("/signup", UserController.post_signup);
// it's post because we need to check if this user exists or not before creating a token to him
router.post("/login", UserController.post_login);
router.delete("/:userId", checkAuth, UserController.delete_user);

module.exports = router;
