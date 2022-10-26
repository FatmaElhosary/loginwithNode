const mongoose = require("mongoose")
const validator = require('validator');
const {isEmail} = require('validator');
const bcryptjs = require("bcryptjs")
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    password:{
        type:String,
        minlength:[6,'Minimum password length is 6 characters'],
        trim:true,
        required:[true,'Please enter a password']
    },
    email:{
        type:String,
        trim:true,
        required:[true,'Please enter an email'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please enter a valid email']
    },
    phone:{
      type:String,
      trim:true,
      validate(value){
       if(!validator.isMobilePhone(value,'ar-EG')) throw new Error("invalid phone format")
    }
    },
    gender:{
        type:String,
        trim:true,
        required:[true,'Please enter a gender'],
        enum:["male", "female"]
    },
    status:{
        type:Boolean,
        default:false
    },
    img:{
        type:String
    },
    tokens:[ {token:{type:String, required:true}} ],
    otp:{
        type:String,
        default:Date.now()
    },
    type:{
         type:String,
         enum:["admin","user"],
         default:"user"
    }
},
{timestamps:true}
)
userSchema.virtual('myProducts',{
    ref:"Product",
    localField:"_id",
    foreignField:"userId"
})
//handle response
userSchema.methods.toJSON = function(){
    const user = this.toObject()
    delete user.__v
    delete user.password
    delete user.tokens
    return user
}

// fire before update save
userSchema.pre("save", async function(){
    const user = this
    if(user.isModified("password")){
        user.password = await bcryptjs.hash(user.password, 12);
    }
       
})

//login user
userSchema.statics.loginUser = async(email,password)=>{
    const user = await User.findOne({email})
    if(!user) throw new Error("invalid user email")
    const isValid = await bcryptjs.compare(password, user.password)
    if(!isValid) throw new Error("invalid password")
    return user
}

//generate token
const jwt = require("jsonwebtoken")
userSchema.methods.generateToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id}, "123") //user{_id:1}
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
const User = mongoose.model("User", userSchema)
module.exports = User