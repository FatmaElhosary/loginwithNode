const userModel = require("../../models/user.model")
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
    //login
    static addUser = async (req, res) => {
        try {
             
            let user = await userModel(req.body);
            await user.save();
            res.status(200).send({
                status: true,
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


    static login = async(req, res)=>{
        try{
            let user = await userModel.loginUser(req.body.email, req.body.password);
            let token = await user.generateToken();
            res.status(200).send({apiStatus:true, data:{user, token}, message:"logged in"});
        }
        catch(e){
            res.status(500).send({apiStatus:false, data:e.message, message:"invalid data"});
        }
    }

    
/*     static me = async(req,res)=>{
        res.status(200).send({apiStatus:true, data:req.user, message:"data featched"})
    } */
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