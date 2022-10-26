const userModel = require("../../models/user.model")
const emailHelper = require("../helper/sendMail.helper")
const otpGenerator = require('otp-generator')
const bcryptjs = require("bcryptjs")

/* //handle errors
const handleErrors=(err)=>{
    let errors={email:'',password:''};
     
    //duplicate error code email
    if(err.code===11000){
        errors.email='that email is already registered';
        return errors;
    }

    //validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path]=properties.message;
        });
    }
return errors;
} */

class User {
    static addUser = async (req, res) => {
        try {
             /* let userexist=await userModel.find({email:req.body.email});
             if(userexist) throw new Error("email exist") */
            let user = await userModel(req.body);
            user.otp = '1325';
            await user.save()
          //  emailHelper(user.email, `http://localhost:3000/user/activate/${user.otp}/${user._id}`)
            res.status(200).send({
                apiStatus: true,
                data: user,
                message: "data inserted successfuly"
            })
        }
        catch (e) {
           
            res.status(400).send({
                apiStatus: false,
                data: e.message,
                message: "user not created "
            })
        }
    }
    static sendOtp=async(req,res)=>{
        try{
            if(status) throw new Error("already active")
            req.user.otp = otpGenerator.generate(12);
            await req.user.save()
            emailHelper(req.user.email, `${req.user.otp}`)
            res.status(200).send({
                apiStatus: true,
                data: req.user.otp,
                message: "data inserted successfuly"
            })
        }
        catch (e) {
            res.status(500).send({
                apiStatus: false,
                data: e.message,
                message: "error adding user data"
            })
    }
}
    static activateUser = async(req,res)=>{
        try{
            let user = await userModel.findOne({otp:req.params.otp,_id:req.params.id})
            if(!user) throw new Error("not a user")
            user.status=true
            user.otp=""
            await user.save()
            res.send("done")
        }
        catch(e){
            res.send(e.message)
        }
    }
    static activateUserLoggedIN = async(req,res)=>{
        try{
            if(req.user.otp != req.body.otp) throw new Error("invalid code")
            req.user.status=true
            req.user.otp=""
            await req.user.save()
            res.send("done")
        }
        catch(e){
            res.send(e.message)
        }
    }
    static showAll = async (req, res) => {
        try {
            const allData = await userModel.find()
            res.status(200).send({
                apiStatus: true,
                data: allData,
                message: "data inserted successfuly"
            })
        }
        catch (e) {
            res.status(500).send({
                apiStatus: false,
                data: e.message,
                message: "error adding user data"
            })
        }
    }
    static showSingle = async (req, res) => {
        try {
            const user = await userModel.findById(req.params.id)
            let message= "data inserted successfuly"
            let mStatus = 200
            if(!user){ message="user not found"; mStatus=404 } 
            res.status(mStatus).send({
                apiStatus: true,
                data: user,
                message
            })
        }
        catch (e) {
            res.status(500).send({
                apiStatus: false,
                data: e.message,
                message: "error adding user data"
            })
        }

    }
    static deleteAll = async (req, res) => {
        try{
            const data = await userModel.deleteMany()
            res.status(200).send({apiStatus:true,data,message:"deleted"})
        }
        catch(e){
            res.status(500).send({apiStatus:false, data:e.message, message:"delete error"})
        }
    }
    static deleteSingle = async (req, res) => {
        try{
            const data = await userModel.findByIdAndDelete(req.params.id)
            let message="deleted"
            let mStatus=200
            if(!data){message="user Not Found"; mStatus=404}
            res.status(mStatus).send({apiStatus:true,data,message:message})
        }
        catch(e){
            res.status(500).send({apiStatus:false, data:e.message, message:"delete error"})
        }

    }
    static login = async(req, res)=>{
        try{
            let user = await userModel.loginUser(req.body.email, req.body.password)
            let token = await user.generateToken()
            res.status(200).send({apiStatus:true, data:{user, token}, message:"logged in"})
        }
        catch(e){
            res.status(500).send({apiStatus:false, data:e.message, message:"invalid data"})
        }
    }
    static me = async(req,res)=>{
        res.status(200).send({apiStatus:true, data:req.user, message:"data featched"})
    }
    static logOut = async(req,res)=>{
        try{
            req.user.tokens = req.user.tokens.filter(t=>{
                return t.token != req.token
            })
            await req.user.save()
            res.send("logged out")
        }
        catch(e){
            res.status(500).send({apiStatus:false, data:e.message})
        }
    
    }
    static logOutAll = async(req,res)=>{
        try{
            req.user.tokens = []
            await req.user.save()
            res.send("logged out")
        }
        catch(e){
            res.status(500).send({apiStatus:false, data:e.message})
        }
    }
    static changePass=async(req,res)=>{
        try{
    const isValidpass = await bcryptjs.compare( req.body.oldpassword,req.user.password);
    if(!isValidpass) throw new Error("error in password");
    req.user.password=req.body.newpassword;
    await req.user.save();
    res.status(200).send({apiStatus:true, data:req.user, message:"changepass"})

        }
        catch(e){
            res.status(500).send({apiStatus:false, data:e.message})
        }
    
    }
/*     static addAddress=async(req,res)=>{
        try{
           
            req.user.addresses.push({addrType:req.body.addrType});
            await req.user.save();
            res.status(200).send({apiStatus:true, data:req.user, message:"add address"})
        
                }
                catch(e){
                    res.status(500).send({apiStatus:false, data:e.message})
                }       
                
    }
    static deleteAddress=async(req,res)=>{
        try{
           
            req.user.addresses=req.user.addresses.filter((addr)=>addr._id!=req.params.id);
            await req.user.save();
            res.status(200).send({apiStatus:true, data:req.user, message:"add address"})
        
                }
                catch(e){
                    res.status(500).send({apiStatus:false, data:e.message})
                }       
                
    }
    static setDefaultAddr=async(req,res)=>{
        try{
            req.user.addresses.forEach((addr) => {
                if(addr._id==req.params.id) addr.default=true
                else
                addr.default=false;
            }); 
            await req.user.save();
            res.status(200).send({apiStatus:true, data:req.user, message:"default address"})
                }
                catch(e){
                    res.status(500).send({apiStatus:false, data:e.message})
                }       
                
    } */
    static uploadProfileimg=async(req,res)=>{
        try{
            req.user.img=req.file.path;
            await req.user.save()
            res.send(req.user);
    
        }catch(e){
            res.send(e)
        }
    }
}
module.exports = User