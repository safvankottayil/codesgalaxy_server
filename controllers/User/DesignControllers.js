const Usershema = require("../../Models/UserShema");
const TageShema = require("../../Models/tageShema");
const DesignShema = require("../../Models/DesignShema");
const DesignCategory = require("../../Models/DesignCategory");
const WishlistSchema = require("../../Models/Wishlist");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

async function isUserReport(comment_id, design_id, User_id) {
  const data = await DesignShema.aggregate([
    { $project: { comment: 1 } },
    { $match: { _id: new ObjectId(design_id) } },
    { $unwind: "$comment" },
    { $match: { "comment._id": new ObjectId(comment_id) } },
    { $unwind: "$comment.report" },
    { $match: { "comment.report.UserId": new ObjectId(User_id) } },
  ]);
  if (data[0]) {
    return true;
  } else {
    return false;
  }
}
module.exports = {
  AddDesigs: async (req, res) => {
    try {
      const User = req.User;
      let Category_id;
      const { Htmlvalue, jsvalue, Cssvalue, tages, category, title } = req.body;
      const Category = await DesignCategory.findOne({ category: category });
      if (!Category) {
        const creteCategory = await DesignCategory.create({
          category: category,
        });
        Category_id = creteCategory._id;
      } else {
        Category_id = Category._id;
      }
      console.log(Category_id);
      const Design = await DesignShema.create({
        UserId: User._id,
        html: Htmlvalue,
        css: Cssvalue,
        js: jsvalue,
        title: title.toLowerCase(),
        category: Category_id,
        isSubmit: true,
      });
      tages.forEach(async (element, i) => {
        const Data = await TageShema.findOne({ Tage: element }, { _id: 1 });
        if (Data) {
          const update = await DesignShema.updateOne(
            { _id: Design._id },
            { $push: { tages: { tage_id: Data._id } } }
          );
        } else {
          const Tage = await TageShema.create({
            Tage: tages[i],
          });
          if (Tage) {
            const update = await DesignShema.updateOne(
              { _id: Design._id },
              { $push: { tages: { tage_id: Tage._id } } }
            );
           
          }
        }
      });
      res.json({ status: true });
    } catch (err) {
      res.json({ status: false, type:'err', err: err });
    }
  },
  UpdateAndAddDeisgn: async (req, res) => {
    try {
      
      let Category_id;
      const { Htmlvalue, id, jsvalue, Cssvalue, tages, category, title } =
        req.body;
      const Category = await DesignCategory.findOne({ category: category });
      if (!Category) {
        const creteCategory = await DesignCategory.create({
          category: category,
        });
        Category_id = creteCategory._id;
      } else {
        Category_id = Category._id;
      }
      await DesignShema.updateOne(
        { _id: id },
        {
          $set: {
            category: Category_id,
            html: Htmlvalue,
            css: Cssvalue,
            js: jsvalue,
            title: title.toLowerCase(),
            isSubmit: true,
          },
        }
      );
      tages.forEach(async (element, i) => {
        const Data = await TageShema.findOne({ Tage: element }, { _id: 1 });
        if (Data) {
          await DesignShema.updateOne(
            { _id: id },
            { $push: { tages: { tage_id: Data._id } } }
          );
        } else {
          const Tage = await TageShema.create({
            Tage: tages[i],
          });
          if (Tage) {
            const update = await DesignShema.updateOne(
              { _id: id },
              { $push: { tages: { tage_id: Tage._id } } }
            );
           
          }
        }
      });
      res.json({ status: true });
    } catch (err) {
      res.json({ status: false,type:'err' });
    }
  },
  IsSavedDesign: async (req, res) => {
    try {
      const Design = await DesignShema.findOne(
        { isSubmit: false, UserId: req.User._id },
        { _id: 1 }
      )
      if (Design) {
        res.json({ status: true, Design });
      }
    } catch (err) {
      res.json({ status: false, err });
    }
  },
  SaveDesign: async (req, res) => {
    try {
     
      const User = req.User;
      const { Htmlvalue, jsvalue, Cssvalue } = req.body;
      const Design = await DesignShema.create({
        UserId: User._id,
        html: Htmlvalue,
        css: Cssvalue,
        js: jsvalue,
      });
      if (Design) {
        res.json({ status: true, Design_id: Design._id });
      }
    } catch (err) {
      res.json({ status: false, err ,type:'err'});
    }
  },
  GetSaveDesign: async (req, res) => {
    try {
      const { id } = req.query;

      const Design = await DesignShema.findOne({
        _id: id,
        UserId: req.User._id,
      });
      if (Design) {
        res.json({ status: true, Design });
      }
    } catch (err) {
      res.json({ status: false, err ,type:'err'});
    }
  },
  UpdateSavedDesign: async (req, res) => {
    try {
      const { Htmlvalue, jsvalue, Cssvalue, id } = req.body;
      const update = await DesignShema.updateOne(
        { _id: id },
        { $set: { html: Htmlvalue, css: Cssvalue, js: jsvalue } }
      );
      if (update) {
        req.json({ status: true });
      }
    } catch (err) {
      res.json({ status: false, err,type:'err' });
    }
  },
  DeleteDesign: async (req, res) => {
    try {
      const User = req.User;
      const { id } = req.query;

      await WishlistSchema.deleteOne({ design: id, UserId: User._id });
      const deleted = await DesignShema.deleteOne({ _id: id });
      if (deleted) {
        res.json({ status: true });
      }
    } catch (err) {
      res.json({ status: false, err,type:'err' });
    }
  },
  TagSuggutions: async (req, res) => {
    try {
      const { char } = req.query;
      const Tages = await TageShema.find(
        { Tage: { $regex: "^" + char } },
        { Tage: 1, _id: 0 }
      );
      res.json({ Tages,status:true });
    } catch (err) {
      res.json({ status: false, err,type:'err' });
    }
  },
  ShowUserDesigns: async (req, res) => {
    try {
      const User = req.User;
      const Designs = await DesignShema.find({
        UserId: User._id,
        isSubmit: true,
      }).populate("UserId");
      if (Designs) {
        res.json({ status: true, Designs });
      }
    } catch (err) {
      res.json({status:false,type:'err',err})
    }
  },
  ShowUserSavedDesigns: async (req, res) => {
    try {
      const User = req.User;
      console.log(User);
      const Designs = await WishlistSchema.find({ UserId: User._id }).populate({
        path: "design",
        populate: {
          path: "UserId",
          model: "user",
        },
      });

      if (Designs) {
        res.json({ status: true, Designs });
      }
    } catch (err) {
      res.json({status:false,type:'err',err})
    }
  },
  UpdateUserDesigns: async (req, res) => {
    try {
 
      const { html, css, js, Design_id } = req.body;
      const x = await DesignShema.updateOne(
        { _id: Design_id },
        { $set: { html, css, js } }
      );
      console.log(x);
      res.json({ status: true });
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  ShowAllDesign: async (req, res) => {
    try {
      const Alldesigns = await DesignShema.find({ isSubmit: true }).populate(
        "UserId"
      );
      res.json({ Data: Alldesigns.reverse()})
    } catch (err) {
      res.json({status:false,type:'err',err})
    }
  },
  ShowCategorys: async (req, res) => {
    try {
      const { char } = req.query;
      const Category = await DesignCategory.find({
        category: { $regex: "^" + char },
      }).limit(5);
      res.json({ Category });
    } catch (err) {
      res.json({status:false,type:'err',err})
    }
  },
  ShowCategory: async (req, res) => {
    try {
      const Category = await DesignCategory.find();
      res.json(Category);
    } catch (err) {
      res.json({status:false,type:'err',err})
    }
  },
  ShowCategoryDesigns: async (req, res) => {
    try {
      const { category } = req.params;
      const data = await DesignCategory.findOne({ category: category });

      if (data) {
        const Designs = await DesignShema.find({
          category: data._id,
          isSubmit: true,
        }).populate("UserId");
        res.json({ Designs: Designs.reverse() });
      } else {
        if (category == "all") {
          const Designs = await DesignShema.find({ isSubmit: true }).populate(
            "UserId"
          );
          res.json({ Designs: Designs.reverse() });
        } else if (category == "") {
          res.json({ Designs: [] });
        } else {
          if (category.startsWith("search")) {
            let char = category.substring(7);
            char = char.toLowerCase();
            const Design = await DesignShema.find({
              $or: [{ title: { $regex: `^${char}` } }],
            });
            if (Design) {
              console.log(Design);
              console.log(1);
              res.json({ Designs: Design });
            }
          } else {
            const Data = await Usershema.findOne(
              { _id: category },
              { UserFollowing: 1 }
            );
            let value = [];
            for (let i = 0; i < Data.UserFollowing.length; i++) {
              value[i] = await DesignShema.find(
                { UserId: Data.UserFollowing[i].UserId, isSubmit: true },
                { html: 1, css: 1, js: 1, title: 1, UserId: 1 }
              ).populate("UserId");
            }
            const Design = value.flat();
            res.json({ Designs: Design });
          }
        }
      }
    } catch (err) {
      console.log(err);
      res.json({ Designs: [], err });
    }
  },
  ShowSingleDesign: async (req, res) => {
    try {
      const { id } = req.query;
      const Design = await DesignShema.findOne({ _id: id }).populate("UserId");
      if (Design) {
        res.json({ status: true, Design });
      }
    } catch (err) {
      res.json({status:false,type:'err',err})
    }
  },
  Designlike: async (req, res) => {
    try {
      const { like, id } = req.body;
      if (like) {
        const x = await DesignShema.updateOne(
          { _id: id },
          { $inc: { like: 1 }, $push: { Likes: { UserId: req.User._id } } }
        );
      } else {
        const x = await DesignShema.updateOne(
          { _id: id },
          { $inc: { like: -1 }, $pull: { Likes: { UserId: req.User._id } } }
        );
      }
      res.json({ status: true });
    } catch (err) {
      res.json({ status: false, err,type:'err' });
    }
  },
  IsLiked: async (req, res) => {
    try {
      const User = req.User;
      const { design_id } = req.query;
      const data = await DesignShema.findOne(
        { _id: design_id, "Likes.UserId": User._id },
        { like: 1 }
      );
      if (data) {
        res.json({ status: true, likes: data.like, isliked: true });
      } else {
        const like = await DesignShema.findOne({ _id: design_id }, { like: 1 });
        res.json({ status: true, likes: like.like, isliked: false });
      }
    } catch (err) {
      res.json({ status: false, err ,type:'err'});
    }
  },
  IsSaved: async (req, res) => {
    try {
      const User = req.User;
      const { design_id } = req.query;
      const data = await WishlistSchema.findOne(
        { UserId: User._id, design: design_id },
        { _id: 1 }
      );
      const count = await WishlistSchema.find({ design: design_id }).count();
      res.json({ status: true, saves: count, isSaved: data ? true : false });
    } catch (err) {
      res.json({ status: false, err ,type:'err'});
    }
  },
  ManageWishlist: async (req, res) => {
    try {
      const User = req.User;
      const { save, id } = req.body;
      if (save) {
        await WishlistSchema.create({ UserId: User._id, design: id });
      } else {
        await WishlistSchema.deleteOne({ UserId: User._id, design: id });
      }
      res.json({ status: true });
    } catch (err) {
      res.json({ status: false, err ,type:'err'});
    }
  },
  GetUserDeatials: async (req, res) => {
    try {
      const { id } = req.params;
      if (id) {
        const User = await Usershema.findOne(
          { _id: id },
          { name: 1, email: 1, image: 1 }
        );
        const Designs = await DesignShema.find({ UserId: id, isSubmit: true });
        res.json({ status: true, User, Designs });
      }
    } catch (err) {
      res.json({ status: false, err ,type:'err'});
    }
  },
  UserFollow: async (req, res) => {
    try {
      const User = req.User;
      const { value, id } = req.body;
      if (value) {
        const update = await Usershema.updateOne(
          { _id: User._id },
          { $push: { UserFollowing: { UserId: id } } }
        );
        res.json({ status: true });
      } else {
        await Usershema.updateOne(
          { _id: User._id },
          { $pull: { UserFollowing: { UserId: id } } }
        );
        res.json({ status: true });
      }
    } catch (err) {
      res.json({ status: false, err ,type:'err'});
    }
  },
  isFollowed: async (req, res) => {
    try {
      const User = req.User;
      const { id } = req.query;
      if (id == User._id) {
        res.json({ status: false, isUser: true });
      } else {
        const user = await Usershema.findOne({
          _id: User._id,
          "UserFollowing.UserId": id,
        });
        if (user) {
          res.json({ status: true });
        } else {
          res.json({ status: false, isUser: false });
        }
      }
    } catch (err) {
      res.json({ status: false, err, isUser: false });
    }
  },
  GetFollowingDesigns: async (req, res) => {
    try {
      const User = req.User;
      res.json({ status: true, id: User._id });
    } catch (err) {
      console.log(err);
      res.json({ status: false, err ,type:'err'});
    }
  },
  AddDesigsComment: async (req, res) => {
    try {
      const { Comment, id } = req.body;
      const update = await DesignShema.updateOne(
        { _id: id },
        { $push: { comment: { comment: Comment, UserId: req.User._id } } }
      );
      if (update) {
        res.json({ status: true });
      }
    } catch (err) {
      res.json({ status: false, err ,type:'err'});
    }
  },
  DeleteComment: async (req, res) => {
    try {
      const { comment_id, design_id } = req.query;
       await DesignShema.updateOne(
        { _id: design_id },
        { $pull: { comment: { _id: comment_id } } }
      );
      res.json({ status: true });
    } catch (err) {
      res.json({ status: false, err ,type:'err'});
    }
  },
  IsUser: async (req, res) => {
    try {
      const User = req.User;
      const { id, comment_id, design_id } = req.query;
      if (User._id == id) {
        res.json({ status: true });
      } else {
        const value = await isUserReport(comment_id, design_id, User._id);
        res.json({ status: false, type: "user", isreported: value });
      }
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  reportUser: async (req, res) => {
    try {
      const User = req.User;
      const { id, design_id } = req.body;
      const data = await DesignShema.aggregate([
        { $match: { _id: new ObjectId(design_id) } },
        { $unwind: "$comment" },
        { $match: { "comment._id": new ObjectId(id) } },
        { $project: { count: { $size: "$comment.report" } } },
      ]);
      if (data[0].count >= 10) {
        await DesignShema.updateOne(
          { _id: design_id },
          { $pull: { comment: { _id: id } } }
        );
      } else {
        await DesignShema.updateOne(
          { _id: design_id, "comment._id": new ObjectId(id) },
          { $push: { "comment.$.report": { UserId: new ObjectId(User._id) } } }
        );
      }
      res.json({ status: true });
    } catch (err) {
      res.json({ status: false, err ,type:'err'});
    }
  },
  GetDesignComments: async (req, res) => {
    try {
      const { design_id } = req.query;

      const Comments = await DesignShema.aggregate([
        { $match: { _id: new ObjectId(design_id) } },
        { $project: { comment: 1 } },
        { $unwind: "$comment" }, // Unwind the comment array
        {
          $lookup: {
            from: "users", // Replace with the actual name of the user collection
            localField: "comment.UserId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            "user.image": 1,
            'user.name':1,
            "comment":1
          },
        },
      ]);
      if(Comments){
        res.json({status:true,Comments:Comments.reverse()})
      }
    } catch (err) {
      res.json({ status: false, err, type: "err" });
    }
  },
  EditComment: async (req, res) => {
    try {
      const { comment_id, design_id, comment } = req.body;
      const update = await DesignShema.updateOne(
        {
          _id: new ObjectId(design_id),
          "comment._id": new ObjectId(comment_id),
        },
        { $set: { "comment.$.comment": comment } }
      );
      if (update) {
        res.json({ status: true });
      }
    } catch (err) {
      res.json({ status: false, err, type: "err" });
    }
  },
};
