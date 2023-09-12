const mongoose=require('mongoose')
const mongooseConnection=()=>{
    mongoose.connect('mongodb+srv://safvankottayil:safvankottayil@cluster0.bv7cs5g.mongodb.net/codesgalexy?retryWrites=true&w=majority').then(res=>{
        console.log('connected');
    })
}
module.exports={mongooseConnection}