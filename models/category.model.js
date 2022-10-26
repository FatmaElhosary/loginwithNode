const mongoose=require('mongoose');
const categorySchema=new mongoose.Schema({
name:
{type:String,required:true,unique:!this.parent?true:false},
parent:{
    type:mongoose.Schema.Types.ObjectId,
},
attributes:[{
    attr:{
        name:{type:String,unique:true
        }, 
        values:[{type:String}]
    }
}],


},{timestamps:true});
categorySchema.virtual('products',{
    ref:"Product",
    localField:"_id",
    foreignField:"categories.catId"
})  
const Category=mongoose.model('Category',categorySchema);
module.exports=Category;