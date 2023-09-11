const mongoose=require('mongoose')
const DesignShema=new mongoose.Schema({
    UserId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user'
    },
    title:{
      type:String,
      lowercase: true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'designCategory'
    },
    html:{
       type:String,
      
    },
    css:{
        type:String,
        
     },
     js:{
        type:String,
       
     },
     like:{
         type:Number,
         default:0
     },
     isSubmit:{
      type:Boolean,
      default:false
     }
     ,date:{
      type:Date,
      default:Date.now
     }
     ,
     tages:[{
        tage_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'tege'
        }
     }],
     Likes:[{
      UserId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'user'
      }
     }],
     comment:[{
      UserId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'user'
      },
      comment:{
         type:String,
         required:true,
         lowercase: true
      },
      date:{
         type:Date,
         default:Date.now
      },
      report:[{
         UserId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'user'
         }
      }]
     }]
})
const model=mongoose.model('design',DesignShema)
module.exports=model