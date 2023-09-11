const mongoose=require('mongoose')

const categoryShema=new mongoose.Schema({
    category:{
        type:String,
        required:true
    }
})
const model=mongoose.model('designCategory',categoryShema)
module.exports=model