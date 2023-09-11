const mongoose=require('mongoose')

const TageShema=new mongoose.Schema({
    Tage:{
        type:String,
        required:true,
        lowercase:true
    }
})
const model=mongoose.model('tage',TageShema)
module.exports=model