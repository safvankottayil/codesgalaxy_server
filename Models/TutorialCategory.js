const mongoose=require('mongoose')
const TutorialCategory=new mongoose.Schema({
    category:{
        type:String,
        required:true
    }
})
const model=mongoose.model('tutorialCategory',TutorialCategory)
module.exports=model