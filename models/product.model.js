const mongoose=require('mongoose');
const productSchema=new mongoose.Schema({
name:{
    type:String,
    required:true
},
description:{
    type:String

},
imges:[],
price:{
    type:Number,
    required:true

},
address:{
    type:String
},
phone:{type:String},
///////////////////////////subcategry if car ==>model ,color,
   categories:[{
         catId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Category"
         }
  }
   ]
,
userId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
}


},{timestamps:true});

 
const Product=mongoose.model('Product',productSchema);
module.exports=Product;