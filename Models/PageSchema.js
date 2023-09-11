const mongoose =require('mongoose')
const pageSchema=new mongoose.Schema({
    Tutorial_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'tutorial'
    },
    name:{
        type:String,
        required:true
    },
    Data:{
        type:Array,
        required:true
    },
    isSubmit:{
        type:Boolean,
        default:false
    },
    isVerify:{
        type:Boolean,
        default:false
    }
})
const model=mongoose.model('page',pageSchema)
module.exports=model