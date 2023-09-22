const Userschema = require("../../Models/UserShema");
const TutorialSchema = require("../../Models/TutorialShema");
const TutorialCategorySchema = require("../../Models/TutorialCategory");
const pageSchema = require("../../Models/PageSchema");

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

async function CreateFolder(id) {
  try {
    fs.mkdirSync(`./public/Tutorial/${id}`);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  AddTutorial: async (req, res) => {
    try {
      const User = req.User;
      const { Title, Category, Description, img } = req.body;
      const category = await TutorialCategorySchema.findOne({
        category: Category,
      });
      if (category) {
        const tutorial = await TutorialSchema.create({
          UserId: User._id,
          category: category._id,
          description: Description,
          image: img,
          title: Title,
        });
        const homepage = await pageSchema.create({
          name: "home",
          Tutorial_id: tutorial._id,
        });

        res.json({
          status: true,
          id: tutorial._id,
          pagename: homepage.name,
        });
      } else {
        const category = await TutorialCategorySchema.create({
          category: Category,
        });
        const tutorial = await TutorialSchema.create({
          UserId: User._id,
          category: category._id,
          description: Description,
          image: img,
          title: Title,
        });

        const homepage = await pageSchema.create({
          name: "home",
          Tutorial_id: tutorial._id,
        });
        res.json({
          status: true,
          id: tutorial._id,
          pagename: homepage.name,
        });
      }
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  SaveTutorial: async (req, res) => {
    try {
      console.log(111);
      const { Totorial_id, page_id, data } = req.body;
       await pageSchema.updateOne(
        { Tutorial_id: Totorial_id, name: page_id },
        { $set: { Data: data } }
      );
      res.json({ status: true });
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  GetTutorials: async (req, res) => {
    try {
      const Tutorials = await TutorialSchema.find({isVerify:true}).populate('UserId');
      res.json({ status: true, Tutorials });
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  GetPages: async (req, res) => {
    try {
      const { id } = req.params;
      const pages = await pageSchema.find({ Tutorial_id: id }, { name: 1 });
      res.json({ status: true, pages });
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  Getpage: async (req, res) => {
    try {
      const { id, name } = req.params;
      const page = await pageSchema.findOne(
        { Tutorial_id: id, name },
        { Data: 1 }
      );
      const Table = [];
      page.Data.forEach((value, i) => {
        if (value.type == "table") {
          Table.push({ i: i, data: value.data });
        }
      });
      res.json({ status: true, page, Table });
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  AddPage: async (req, res) => {
    try {
      const { search, id } = req.body;
      const page = await pageSchema.findOne({
        Tutorial_id: id,
        name: search.toLowerCase(),
      });
      if (page) {
        res.json({
          status: false,
          type: "success",
          msg: "This page alredy Exist",
        });
      } else {
        const page = await pageSchema.create({ name: search, Tutorial_id: id });
        if (page) {
          res.json({ status: true });
        }
      }
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  GetUserTutorials: async (req, res) => {
    try {
      const User = req.User;
      const Tutorials = await TutorialSchema.find({ UserId: User._id }).populate('UserId');
      res.json({ status: true, Tutorials });
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  GetTutorialCategory: async (req, res) => {
    try {
      console.log(3456);
      const category = await TutorialCategorySchema.find();
      res.json({ status: true, category });
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  GetShowCategoryTutorials: async (req, res) => {
    try {
      const {category} = req.params;
      const Category = await TutorialCategorySchema.findOne({
        category: category,
      });
      if (Category) {
        const Tutorials = await TutorialSchema.find({ category: Category._id }).populate('UserId')
        console.log(Tutorials);
        res.json({ status: true, Tutorials });
      } else {
        if (category.startsWith("search=")) {
          const char = category.slice(7);
          console.log(char);
          const Tutorials = await TutorialSchema.find({
            $or: [{ title: { $regex: `^${char}` } }],
          }).populate('UserId')
          res.json({ status: true, Tutorials });
        }else{
          res.json({status:false,type:'err',err})
        }
      }
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  DeleteTutorial:async(req,res)=>{
    try{
      const { id } = req.query
    await TutorialSchema.deleteOne({_id:id})
    await pageSchema.deleteMany({Tutorial_id:id})
    res.json({status:true})
    }catch(err){
      res.json({status:true,type:'err',err})
    }
  },
  GetaothenrUserTutorials:async(req,res)=>{
    try{
     const {id}=req.query
     const Tutorials=await TutorialSchema.find({UserId:id}).populate('UserId')
     res.json({status:true,Tutorials})
    }catch(err){
      res.json({status:false,type:'err',err})
    }
  },
  AddTutorialreview:async(req,res)=>{
    try{
      const User=req.User
      const {ID,review,rating}=req.body
      console.log(req.body);
      await TutorialSchema.updateOne({_id:ID},{$inc:{rating:rating},$push:{reviews:{user:User._id,review:review,rate:Number(rating)}}})
      res.json({status:true})
    }catch(err){
      console.log(err);
      res.json({status:false,type:'err',err})
    }
  },
  IsReviewedTutorials:async(req,res)=>{
    try{
     const User=req.User
     const {id}=req.query
     const isReviewed= await TutorialSchema.aggregate([
      {$match:{_id:new ObjectId(id)}},
      {$match:{'reviews.user':new ObjectId(User._id)}}
     ])
     if(isReviewed[0]){
      res.json({status:true,isReview:true})
     }else{
      res.json({status:true,isReview:false})
     }
    }catch(err){
      res.json({status:false,type:'err',err})
    }
  },
  ShowTutorialReviews:async(req,res)=>{
    try{
      const {id}=req.query
      const reviews= await TutorialSchema.findOne({_id:id},{reviews:1}).populate('reviews.user')
      res.json({status:true,reviews:reviews.reviews})
    }catch(err){
      res.json({status:false,type:'err',err})
    }
  }
};
