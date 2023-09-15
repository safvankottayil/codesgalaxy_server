const mongoose=require('mongoose')
const dotenv=require('dotenv').config();

const mongooseConnection=()=>{
    mongoose.connect(process.env.MONGO_URL).then(res=>{
        console.log('connected');
    })
}
module.exports={mongooseConnection}