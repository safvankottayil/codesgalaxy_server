const mongoose=require('mongoose')

const Usershema= new mongoose.Schema({
 name:{
    type:String,
    required:true
 },
 email:{
    type:String,
    required:true
 },
 username:{
   type:String,
   // required:true
 },
 password:{
    type:String,
    required:true
 },
 image:{
    type:String,
    default:''
 },
 isverify:{
    type:Boolean,
    default:false
 },
 isAdmin:{
    type:Boolean,
    default:false
 },
 isBanned:{
    type:Boolean,
    default:false
 },
 UserFollowing:[
    {  
     UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
    }
 ],
 TageFollowing:[
    {  
     tage_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'tage'
    }
    }
 ]
})
const model=mongoose.model('user',Usershema)
module.exports=model