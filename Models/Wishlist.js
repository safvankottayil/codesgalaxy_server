const mongoose=require('mongoose')
const wishlistSchema=new mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    design:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'design',
        required:true
    }
})
const model=mongoose.model('wishlist',wishlistSchema)
module.exports=model