const mongoose = require("mongoose");
const CommunitQes = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    lowercase: true,
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  question: {
    type: String,
    required: true,
  },
  tags: [
    {
      tag_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tage",
      },
    },
  ],
  vote: {
    type: Number,
    default: 0,
  },
  voters: [
    {
      UserId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
  answers: [
    {
        answervoters: [
            {
              UserId:               {
                 type: mongoose.Schema.Types.ObjectId,
                  ref: "user" 
                },
            },
          ],
      answer: {
        type: String,
      },
      UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      vote: {
        type: Number,
        default: 0,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});
const model = mongoose.model("community", CommunitQes);
module.exports = model;
