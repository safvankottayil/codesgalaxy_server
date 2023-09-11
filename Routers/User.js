const express = require("express");
const router = express.Router();
const {
  UserSignup,
  Emailverify,
  UserLogin,
  Editprofile,
  Updateimage,
  getEditdata,
  GoogleLogin,
  ForgotpasswordSentmail,
  ResetPassword,
} = require("../controllers/User/LoginAndSignupcontrollers");
const {
  AddDesigs,
  TagSuggutions,
  ShowUserDesigns,
  UpdateUserDesigns,
  ShowAllDesign,
  ShowSingleDesign,
  ShowCategorys,
  ShowCategory,
  ShowCategoryDesigns,
  Designlike,
  IsLiked,
  IsSaved,
  ManageWishlist,
  ShowUserSavedDesigns,
  reportUser,
  SaveDesign,
  GetSaveDesign,
  IsSavedDesign,
  UpdateSavedDesign,
  UpdateAndAddDeisgn,
  DeleteDesign,
  GetUserDeatials,
  UserFollow,
  isFollowed,
  GetFollowingDesigns,
  AddDesigsComment,
  DeleteComment,
  IsUser,
  EditComment,
  GetDesignComments,
} = require("../controllers/User/DesignControllers");
const {
  AddTutorial,
  SaveTutorial,
  DeleteTutorial,
  GetTutorials,
  GetPages,
  Getpage,
  AddPage,
  GetUserTutorials,
  GetTutorialCategory,
  GetShowCategoryTutorials,
  GetaothenrUserTutorials,
  AddTutorialreview,
  IsReviewedTutorials,
  ShowTutorialReviews,
} = require("../controllers/User/TutorialControllers");
const { verifyToken } = require("../Middleweres/UserAuth");
const { IsBlocked } = require("../Middleweres/IsBloked");
const { ChatingUsers, GetChat, UserSearch } = require("../controllers/User/ChatContollers");
const {
  AddCommunityQeustions,
  GetQestions,
  GetSinglequestion,
  AddAnswer,
  isVotedAndISaved,
  AddAndRemoveVote,
  QestionSaved,
  GetAnswerSaved,
  AddAnswerVote,
  GetSavedQuestions,
  GetTag,
  CommunnitySearch,
} = require("../controllers/User/CommunityController");

router.get("/Auth", verifyToken);

router.post("/signup", UserSignup);
router.patch("/verify", Emailverify);
router.post("/login", UserLogin);

router
  .route("/editprofile")
  .get(verifyToken, getEditdata)
  .patch(verifyToken, IsBlocked, Editprofile);
router.patch("/updateImage", verifyToken, IsBlocked, Updateimage);
router.post("/googlelogin", GoogleLogin);
router
  .route("/forgotpassword")
  .post(ForgotpasswordSentmail)
  .patch(ResetPassword);

router
  .route("/add-design")
  .post(verifyToken, IsBlocked, AddDesigs)
  .patch(verifyToken, IsBlocked, UpdateAndAddDeisgn);
router.get("/isSaveDesign", verifyToken, IsBlocked, IsSavedDesign);
router
  .route("/saveDesign")
  .post(verifyToken, IsBlocked, SaveDesign)
  .get(verifyToken, IsBlocked, GetSaveDesign);
router.patch("/saveDesignUpdate", verifyToken, IsBlocked, UpdateSavedDesign);
router.delete("/deleteDesign", verifyToken, IsBlocked, DeleteDesign);
router.get("/suggution", TagSuggutions);

router.get("/categorySuggution", ShowCategorys);
router.get("/profile/posts", verifyToken, IsBlocked, ShowUserDesigns);
router.get("/profile/saved", verifyToken, IsBlocked, ShowUserSavedDesigns);
router.patch("/profile/posts/viewUpdate", UpdateUserDesigns);
router.get("/designview", ShowSingleDesign);
router.get("/designs", ShowAllDesign);
router.get("/category", ShowCategory);
router.get("/showCategoryDesigns/:category", ShowCategoryDesigns);
router.patch("/designlike", verifyToken, IsBlocked, Designlike);
router.get("/isliked", verifyToken, IsBlocked, IsLiked);
router.get("/isSaved", verifyToken, IsBlocked, IsSaved);
router.patch("/add-wishlist", verifyToken, IsBlocked, ManageWishlist);
router.get("/user/:id", GetUserDeatials);
router.patch("/userfollow", verifyToken, IsBlocked, UserFollow);
router.get("/isfollow", verifyToken, IsBlocked, isFollowed);
router.get("/followingDesigns", verifyToken, IsBlocked, GetFollowingDesigns);
router.post("/add-comment", verifyToken, IsBlocked, AddDesigsComment);
router.delete("/deleteComment", DeleteComment),
  router.get("/isUser", verifyToken, IsBlocked, IsUser);
router.patch("/commentReport", verifyToken, IsBlocked, reportUser);
router.patch("/commentEdit", verifyToken, IsBlocked, EditComment);
router.get("/designComments", GetDesignComments);

// Tutorial management
router.get("/profile/tutorials", verifyToken, IsBlocked, GetUserTutorials);
router.route("/tutorial").get(GetTutorials).delete(DeleteTutorial);
router.get("/tutorial/:category", GetShowCategoryTutorials);
router.get("/pages/:id", GetPages);
router.post("/add-page", verifyToken, IsBlocked, AddPage);
router.get("/page/:id/:name", Getpage);
router.post("/add-tutorial", verifyToken, IsBlocked, AddTutorial);
router.post("/savetutorial", verifyToken, IsBlocked, SaveTutorial);
router.get("/tutorialcategory", GetTutorialCategory);
router.get("/usertutorials", GetaothenrUserTutorials);
router.route('/tutorials/review').post(verifyToken,IsBlocked,AddTutorialreview).get(ShowTutorialReviews)
router.get('/tutorials/isReviewed',verifyToken,IsBlocked,IsReviewedTutorials)

// chat
router.get("/chat/users", verifyToken, IsBlocked, ChatingUsers);
router.get("/chat", verifyToken, IsBlocked, GetChat);
router.get('/chat/usersearch',verifyToken,IsBlocked,UserSearch)

// community
router.get('/community/search',CommunnitySearch)
router.route("/community").get(GetQestions);
router
  .route("/community/ask")
  .post(verifyToken, IsBlocked, AddCommunityQeustions);
router.route("/community/question/:id").get(GetSinglequestion);
router.route("/community/add-answer").post(verifyToken, IsBlocked, AddAnswer);
router
  .route("/community/questions/isVoted")
  .get(verifyToken, IsBlocked, isVotedAndISaved)
  .patch(verifyToken, IsBlocked, AddAndRemoveVote);
router
  .route("/community/questions/isSaved")
  .patch(verifyToken, IsBlocked, QestionSaved);
router.get(
  "/community/questions/answer/:id",
  verifyToken,
  IsBlocked,
  GetAnswerSaved
);
router.patch('/community/questions/ansVoted',verifyToken,IsBlocked, AddAnswerVote)
router.get('/community/saved',verifyToken,IsBlocked,GetSavedQuestions)
router.get('/tag',GetTag)

module.exports = router;
