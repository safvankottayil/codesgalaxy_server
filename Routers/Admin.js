const express = require("express");
const {verifyAdminToken}=require('../Middleweres/AdminAuth')
const {
  AdminLogin,
  ShowUsers,
  BanUsers,
  SearchUsers,
  GetTutrials,
  TutorialVerify,
  Getpage,Pageverify, GetDashbordData
} = require("../controllers/Admin/AdminControllers");
const router = express.Router();
router.get('/',GetDashbordData)
router.post("/login", AdminLogin);
router.route("/users").get(verifyAdminToken,ShowUsers).patch(verifyAdminToken,BanUsers);
router.get("/searchUsers",verifyAdminToken, SearchUsers);
router.get("/tutorials",verifyAdminToken,GetTutrials);
router.patch('/tutorialVerify',verifyAdminToken,TutorialVerify)
router.get('/tutorialpage',verifyAdminToken,Getpage)
router.patch('/pageverify',verifyAdminToken,Pageverify)
router.get('/adminAuth',verifyAdminToken,(req,res)=>{
  res.json({status:true})
})

module.exports = router;
