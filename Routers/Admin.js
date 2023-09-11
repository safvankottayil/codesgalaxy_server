const express = require("express");
const {verifyAdminToken}=require('../Middleweres/AdminAuth')
const {
  AdminLogin,
  ShowUsers,
  BanUsers,
  SearchUsers,
  GetTutrials,
  TutorialVerify,
  Getpage,Pageverify
} = require("../controllers/Admin/AdminControllers");
const router = express.Router();
router.post("/login", AdminLogin);
router.route("/users").get(verifyAdminToken,ShowUsers).patch(verifyAdminToken,BanUsers);
router.get("/searchUsers",verifyAdminToken, SearchUsers);
router.get("/tutorials",verifyAdminToken,GetTutrials);
router.patch('/tutorialVerify',verifyAdminToken,TutorialVerify)
router.get('/tutorialpage',verifyAdminToken,Getpage)
router.patch('/pageverify',verifyAdminToken,Pageverify)

module.exports = router;
