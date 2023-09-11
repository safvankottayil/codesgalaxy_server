const Usershema = require('../../Models/UserShema')
const bycrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken')

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {

        user:process.env.VERIFY_EMAIL,
        pass: 'srchjrozopzykqtl'
    }
});

async function main(email, name, html) {
    try {
        const info = await transporter.sendMail({
            from: process.env.VERIFY_EMAIL, // sender address
            to: email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello" + name, // plain text body
            html: html // html body
        });
        return true
    } catch (err) {
        return false
    }
}
const passwordHashing = async (password) => {
    const data = await bycrypt.hash(password, 10)
    return data
}
const GenerateToken = async ({ _id, email }) => {
    try {
        const jwtsrecretcode = process.env.TOKEN_KEY
        const token = jwt.sign({ _id, email }, jwtsrecretcode)
        if (token) {
            return token
        }
    } catch (err) {
        res.json({ status: 'err', err: err,type:'err' })
    }
}
module.exports = {
    UserSignup: async (req, res) => {
        try {

            const { name, email, password } = req.body
            const User=await Usershema.findOne({email:email})
            const hashpassword = await passwordHashing(password)
            if(User){
                if(User.isverify){
                    res.json({success:false,msg:'Email already exist'})
                }else{
                    const hash=await passwordHashing(password)
                    await Usershema.updateOne({_id:User._id},{$set:{name:name,password:hash}})
             const html = `  <a href='http://localhost:3000?id=${User._id}'>verify</a>`
            const success = await main(email, name, html)
            res.json({success })
                }
            }else{
                const Data = await Usershema.create({
                    name, email, password: hashpassword
                })
            const html = `  <a href='http://localhost:3000?id=${Data._id}'>verify</a>`
            const success = await main(email, name, html)
            res.json({ success })
            }
           
            
        } catch (err) {
            res.json({ success:false,type:'err', err })
        }
    },
    Emailverify: async (req, res) => {
        try {
            const { id } = req.body
            if (id) {
                await Usershema.updateOne({ _id: id }, { $set: { isverify: true } })
                res.json({ success: true })
            }
        } catch (err) {
            res.json({ success:false,type:'err', err })
        }
    },
    UserLogin: async (req, res) => {
        try {
            const { email, password } = req.body
            const User = await Usershema.findOne({ email: email })
            if (User) {
                const match = await bycrypt.compare(password, User.password)
                console.log(match);
                if (match) {
                    const token = await GenerateToken(User)
                    console.log(token);
                    res.json({ status: true, token, image: User.image, id: User._id })
                } else {
                    res.json({ status: 'err', type: 'password' })
                }
            } else {
                res.json({ status: 'err', type: 'email' })
            }

        } catch (err) {
            res.json({status:'err',type:'err',err})
        }
    },
    Editprofile: async (req, res) => {
        try {
            const user = req.User
            const { name, userName, password1, password2, image } = req.body
            const User = await Usershema.findOne({ _id: user._id }, { password: 1 })
            const match = await bycrypt.compare(password1, User.password)
            if (match) {
                const hash = await passwordHashing(password2)
                const isUpdate = await Usershema.updateOne({ _id: user._id }, { $set: { name: name, username: userName, password: hash, image } })
                if (isUpdate) {
                    res.json({ status: true })
                }
            } else {
                res.json({ status: false, msg: 'incorruct in your password', type:'password' })
            }
        } catch (err) {
           res.json({status:false,type:'err',err})
        }
    },
    Updateimage: async (req, res) => {
        try {
            const User = req.User
            const { image } = req.body
            const data = await Usershema.updateOne({ _id: User._id }, { $set: { image } })
            if (data) {
                res.json({ status: true })
            }
        } catch (err) {
            res.json({ status: false, err: err,type:'err' })
        }
    },
    getEditdata: async (req, res) => {
        try {
            const User = req.User
            const user = await Usershema.findOne({ _id: User._id })
            if (user) {
                res.json({ status: true, User: user })
            }
        } catch (err) {
            res.json({ status: false,type:'err',err })
        }
    }
    // GoogleSignup:async (req,res)=>{
    //     try{
    //        console.log(req.body);
    //        const {name,email}=req.body
    //        const User=await Usershema.findOne({email:email})
    //        if(User){
    //           res.json({status:false,msg:'Email already exist'})
    //        }else{
    //           const Data= await Usershema.create({name,email})
    //        }
    //     }catch(err){

    //     }
    // }
    ,
    GoogleLogin: async (req, res) => {
        try {
            console.log(req.body);
            const { email } = req.body
            const User = await Usershema.findOne({ email: email })
            if (User) {
                const token = await GenerateToken(User)
                console.log(token);
                res.json({ status: true, token, image: User.image, id: User._id })
            } else {
                res.json({ status: false, type: 'email' })
            }
        } catch (err) {
                res.json({status:false,type:'err',err})
        }
    },
    ForgotpasswordSentmail: async (req, res) => {
        try {
            const { email } = req.body
            console.log(email);
            const User = await Usershema.findOne({ email: email })
            if (User) {
                const html = `
         <style>
         .aa{
             background-color: blue;
             width: fit-content;
             padding: 10px 8px;
             color: aliceblue;
             font-weight: bold;
         }
     </style>
         <a class="aa" href='http://localhost:3000/forgotpassword?id=${User._id}'>Forgout Password</a>
         
         `
                const success = main(User.email, User.name, html)
                res.json({ status: success })
            } else {
                res.json({ status: false, type: 'email', msg: 'Email not found' })
            }
        } catch (err) {
            res.json({ status: false, err, type: 'err' })
        }
    },
    ResetPassword: async (req, res) => {
        try {
            const { id, password } = req.body
            const hash = await passwordHashing(password)
            await Usershema.updateOne({ _id: id }, { $set: { password: hash } })
            res.json({ status: true })
        } catch (err) {
            res.json({ status: false, type: 'err', err })
        }
    },
    

}


