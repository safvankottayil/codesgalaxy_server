const UserSchema = require("../Models/UserShema");
module.exports = {
  IsBlocked: async (req, res, next) => {
    try {
      console.log('iam block');
      const User = req.User;
      const user = await UserSchema.findOne({ _id: User._id });
      if (user.isBanned) {
        res.json({ status: false, type: "block" });
      } else {
        next();
      }
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
};
