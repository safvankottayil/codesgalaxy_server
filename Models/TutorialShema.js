const mongoose =require('mongoose')
const TutorialShema= new mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title:{
        type:String,
        required:true,
        lowercase: true
        
    },
    rating:{
        type:Number,
        required:true,
        default:0
    },
    reviews:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        rate:{
            type:Number,
        },
        review:{
            type:String,
            lowercase:true
        }
    }]
    ,
    image:{
        type:String,
        required:true
    },
    isVerify:{
        type:Boolean,
        default:false
    },
    description:{
        type:String,
        required:true,
        lowercase: true
    },
    date:{
        type:Date,
        default:Date.now
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'tutorialCategory'
    }
})
const model=mongoose.model('tutorial',TutorialShema)
module.exports=model