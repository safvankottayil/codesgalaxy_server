const Usershema = require("../../Models/UserShema");
const chatSchema = require("../../Models/Chatshema");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

module.exports = {
  ChatingUsers: async (req, res) => {
    try {
        const User=req.User
      const Users = await Usershema.find({},{image:1,name:1,email:1});
      res.json({ status: true, Users,UserID:User._id });
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  GetChat: async (req, res) => {
    try {
      const { id } = req.query;
      const user1 = req.User._id;
      const chatRoom = await chatSchema.findOne({ user1: user1, user2: id });
      if (chatRoom) {
        res.json({ status: true, ChatId: chatRoom._id ,messages:chatRoom.messages });
      } else {
        const room = await chatSchema.findOne({ user2: user1, user1: id });
        if (room) {
          res.json({ status: true, ChatId: room._id ,messages:room.messages});
        } else {
          const room = await chatSchema.create({
            user1:user1,
            user2:id
          });
          if(room){
            res.json({status: true, ChatId: room._id ,messages:[] })
          }
        }
      }
    } catch (err) {
      res.json({ status: false, type: "err", err });
    }
  },
  UserSearch:async(req,res)=>{
    try{
      const {char}=req.query
      const Users= await Usershema.find({
        name: { $regex: "^" + char },
      })
      res.json({status:true,Users})
    }catch(err){
      res.json({ status: false, type: "err", err });
    }
  }
};
