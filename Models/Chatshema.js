const mongoose=require('mongoose')
const chatSchema = new mongoose.Schema(
    {
      user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      messages: [
        {
          text: {
            type: String,
            required: true,
          },
          ID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
          },
          is_read: {
            type: Boolean,
            default: false
        },
        read_at: {
            type: Date
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
  
        },
      ],
    },
  );
  
  const ChatModel = mongoose.model("Chat", chatSchema);
  
  module.exports = ChatModel;