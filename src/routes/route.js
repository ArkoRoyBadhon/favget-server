const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup", authController.createUser);
router.post("/getUser", authController.getUser);
router.patch("/updateUser", authController.updateUser);

module.exports = router;
