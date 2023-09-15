const UserShema = require("../../Models/UserShema");
const TutorialSchema = require("../../Models/TutorialShema");
const pageSchema = require("../../Models/PageSchema");
const CommunitySchema = require("../../Models/CommunitySchema");
const DesignSchema = require("../../Models/DesignShema");

const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const GenerateToken = async ({ _id, email }) => {
  try {
    const jwtsrecretcode = process.env.ADMIN_TOKEN_KEY;
    const token = jwt.sign({ _id, email }, jwtsrecretcode);
    if (token) {
      return token;
    }
  } catch (err) {
    res.json({ status: false, err: err });
  }
};
module.exports = {
  AdminLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(req.body);
      console.log(456);
      const User = await UserShema.findOne({ email: email, isAdmin: true });
      console.log(User);
      if (User) {
        const passwordmatch = await bycrypt.compare(password, User.password);
        console.log(passwordmatch);
        if (passwordmatch) {
          const token = await GenerateToken(User);
          res.json({ status: true, token });
        } else {
          res.json({
            status: false,
            msg: "Invalid Password",
            type: "password",
          });
        }
      } else {
        res.json({ status: false, msg: "Only access in Admin", type: "email" });
      }
    } catch (err) {
      console.log(45678);
      res.json({ status: false, err });
    }
  },
  ShowUsers: async (req, res) => {
    try {
      const Users = await UserShema.find();
      if (Users) {
        res.json({ status: true, Users });
      }
    } catch (err) {
      res.json({ status: false });
    }
  },
  BanUsers: async (req, res) => {
    try {
      const { value, id } = req.body;
      console.log(typeof value);
      const update = await UserShema.updateOne(
        { _id: id },
        { $set: { isBanned: value } }
      );
      console.log(update);
      res.json({ status: true });
    } catch (err) {
      res.json({ status: false, err });
    }
  },
  SearchUsers: async (req, res) => {
    try {
      const { char } = req.query;
      const Users = await UserShema.find({
        $or: [
          { name: { $regex: `^${char}` } },
          { email: { $regex: `^${char}` } },
        ],
      });
      console.log(Users);
      res.json({ status: true, Users });
    } catch (err) {
      res.json({ status: false });
    }
  },
  GetTutrials: async (req, res) => {
    try {
      const Tutorials = await TutorialSchema.find()
        .populate("UserId")
        .sort({ isVerify: 1 });
      res.json({ status: true, Tutorials });
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  TutorialVerify: async (req, res) => {
    try {
      const { id, type } = req.body;
      await TutorialSchema.updateOne({ _id: id }, { $set: { isVerify: type } });
      await pageSchema.updateMany(
        { Tutorial_id: id },
        { $set: { isVerify: type } }
      );
      res.json({ status: true });
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  Getpage: async (req, res) => {
    try {
      const { id } = req.query;
      const tutorial = await TutorialSchema.findOne({ _id: id }, { title: 1 });
      const page = await pageSchema.find({ Tutorial_id: id });
      const table = [];
      page.forEach((value, j) => {
        const Table = [];
        value.Data.forEach((data, i) => {
          if (data.type == "table") {
            Table.push({ i: i, data: data.data });
          } else {
            Table.push({});
          }
        });
        table[j] = Table;
      });
      res.json({ status: true, page, name: tutorial.title, Table: table });
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  Pageverify: async (req, res) => {
    try {
      const { id, type } = req.body;
      await pageSchema.updateOne({ _id: id }, { $set: { isVerify: type } });
      res.json({ status: true });
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  GetDashbordData: async (req, res) => {
    try {
      const users = await UserShema.find({}, { name: 1, image: 1, email: 1 })
        .sort({ _id: -1 })
        .limit(6);
      const designscount = await DesignSchema.find().count();
      const publishedcount = await DesignSchema.find({
        isSubmit: true,
      }).count();
      const tutorial_count = await TutorialSchema.find().count();
      const tutorialverifyed_count = await TutorialSchema.find({
        isVerify: true,
      }).count();
      const tutorial = await TutorialSchema.find({}, { date: 1 }).sort({
        _id: -1,
      });

      res.json({
        tutorial,
        users,
        designs: {
          total: designscount,
          published: publishedcount,
          saved: designscount - publishedcount,
        },
        tutorials:{
            total:tutorial_count,
            verifyed:tutorialverifyed_count,
            reported:tutorial_count-tutorialverifyed_count
        }
      });
    } catch (err) {
      console.log(err);
      res.json({ status: false, type: "err", err });
    }
  },
};
