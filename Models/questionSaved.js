const mongoose=require('mongoose')
const wishlistSchema=new mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    question:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'community',
        required:true
    }
})
const model=mongoose.model('questionWishlist',wishlistSchema)
module.exports=model