const Usershema = require("../../Models/UserShema");
const TageShema = require("../../Models/tageShema");
const CommunitySchema = require("../../Models/CommunitySchema");
const QestionWishlist = require("../../Models/questionSaved");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
module.exports = {
  GetQestions: async (req, res) => {
    try {
      const questions = await CommunitySchema.find({})
        .sort({ _id: -1 })
        .populate("tags.tag_id").populate("UserId")
        console.log(questions);
      res.json({ status: true, questions });
    } catch (err) {
      console.log(err);
      res.json({ status: false, type: "err", err });
    }
  },
  GetSinglequestion: async (req, res) => {
    try {
      console.log(12);
      const { id } = req.params;
      const question = await CommunitySchema.findOne({ _id: id }).populate(
        "tags.tag_id"
      );
      
      res.json({ status: true, question });
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  AddCommunityQeustions: async (req, res) => {
    try {
      const User = req.User;
      const { title, show, tages } = req.body;
      const CommunityQes = await CommunitySchema.create({
        title: title,
        question: show,
        UserId: User._id,
      });
      if (CommunityQes) {
        tages.forEach(async (element) => {
          const tag = await TageShema.findOne({ Tage: element });
          if (tag) {
            await CommunitySchema.updateOne(
              { _id: CommunityQes._id },
              { $push: { tags: { tag_id: tag._id } } }
            );
          } else {
            const tag = await TageShema.create({ Tage: element });
            if (tag) {
              await CommunitySchema.updateOne(
                { _id: CommunityQes._id },
                { $push: { tags: { tag_id: tag._id } } }
              );
            }
          }
        });
      }
      res.json({ status: true });
    } catch (err) {
      res.josn({ status: false, type: "err", err });
    }
  },
  AddAnswer: async (req, res) => {
    try {
      const User = req.User;
      const { id, show } = req.body;
      const data = await CommunitySchema.updateOne(
        { _id: id },
        { $push: { answers: { UserId: User._id, answer: show } } }
      );
      console.log(data);
      res.json({ status: true });
    } catch (err) {
      res.josn({ status: false, type: "err", err });
    }
  },
  isVotedAndISaved: async (req, res) => {
    try {
      const User = req.User;
      const { id } = req.query;
      const votersCount = await CommunitySchema.aggregate([
        { $project: { count: { $size: "$voters" } } },
      ]);
      const isVoted = await CommunitySchema.aggregate([
        { $project: { voters: 1, count: { $size: "$voters" } } },
        { $match: { _id: new ObjectId(id) } },
        { $unwind: "$voters" },
        { $match: { "voters.UserId": new ObjectId(User._id) } },
      ]);
      console.log(votersCount);
      const Saved = await QestionWishlist.findOne({
        UserId: User._id,
        question: id,
      });
      if (isVoted[0]) {
        res.json({
          status: true,
          isvoted: true,
          count: votersCount[votersCount.length - 1]?.count,
          isSaved: Saved ? true : false,
        });
      } else {
        res.json({
          status: true,
          isvoted: false,
          count: votersCount[votersCount.length - 1]?.count,
          isSaved: Saved ? true : false,
        });
      }
    } catch (err) {
      console.log(err);
      res.json({ status: false, type: "err", err });
    }
  },
  AddAndRemoveVote: async (req, res) => {
    try {
      const User = req.User;
      const { id, type } = req.body;
      if (type) {
        await CommunitySchema.updateOne(
          { _id: id },
          { $push: { voters: { UserId: User._id } } }
        );
      } else {
        await CommunitySchema.updateOne(
          { _id: id },
          { $pull: { voters: { UserId: User._id } } }
        );
      }
      res.json({ status: true });
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  QestionSaved: async (req, res) => {
    try {
      const User = req.User;
      const { id, type } = req.body;
      if (type) {
        const question = await QestionWishlist.create({
          question: id,
          UserId: User._id,
        });
      } else {
        const question = await QestionWishlist.deleteOne({
          question: id,
          UserId: User._id,
        });
      }
      res.json({ status: true });
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  GetAnswerSaved: async (req, res) => {
    try {
      const User = req.User;
      const { id } = req.params; //answer_id
      console.log(id);
      const answer = await CommunitySchema.aggregate([
        { $match: { "answers._id": new ObjectId(id) } },
        { $project: { answers: 1 } },
        { $unwind: "$answers" },
        { $match: { "answers._id": new ObjectId(id) } },
        { $project: { "answers.answervoters": 1 } },
        { $unwind: "$answers.answervoters" },
        { $match: { "answers.answervoters.UserId": new ObjectId(User._id) } },
      ]);
      const count = await CommunitySchema.aggregate([
        { $match: { "answers._id": new ObjectId(id) } },
        { $project: { answers: 1 } },
        { $unwind: "$answers" },
        { $match: { "answers._id": new ObjectId(id) } },
        { $project: { count: { $size: "$answers.answervoters" } } },
      ]);
      console.log(count);
      console.log(answer);
      if (answer[0]) {
        res.json({ status: true, isSaved: true, count: count[0].count });
      } else {
        res.json({ status: true, isSaved: false, count: count[0].count });
      }
    } catch (err) {
      console.log(err);
      res.json({ status: false, type: "err", err });
    }
  },
  AddAnswerVote: async (req, res) => {
    try {
      const User = req.User;
      const { id, type } = req.body;
      let x;
      if (type) {
        x = await CommunitySchema.updateOne(
          { "answers._id": id },
          { $push: { "answers.$.answervoters": { UserId: User._id } } }
        );
      } else {
        x = await CommunitySchema.updateOne(
          { "answers._id": id },
          { $pull: { "answers.$.answervoters": { UserId: User._id } } }
        );
      }
      console.log(x);
      res.json({ status: true });
    } catch (err) {
      console.log(err);
      res.json({ status: false, type: "err", err });
    }
  },
  GetSavedQuestions: async (req, res) => {
    try {
      const User = req.User;
      const questions = await QestionWishlist.find({ UserId: User._id })
        .sort({ _id: -1 })
        .populate({
          path: "question",
          populate: {
            path: "tags.tag_id", // Specify the nested path to populate
          },
        });
      res.json({ status: true, questions });
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  GetTag: async (req, res) => {
    try {
      const tag = await TageShema.find();
      res.json({ status: true, tag });
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  CommunnitySearch: async (req, res) => {
    try {
      const { char } = req.query;
      const questions = await CommunitySchema.find(
        {
          title: { $regex: "^" + char },
        },
        { title: 1, UserId: 1 }
      ).populate("UserId");
      res.json({ status: true, questions });
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
};
