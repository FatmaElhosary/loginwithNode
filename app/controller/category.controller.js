
const categoryModel=require('../../models/category.model');

class Category{
 static addCategoryt=async(req,res)=>{
     try{
        const cate = new categoryModel({
                     name:req.body.name 
        })
        await cate.save()
        res.status(200).send({apiStatus:true, data:cate, message:"added cate successfully"})
    }
    catch(e){
        res.status(500).send({apiStatus:false, data:e.message, message:"invalid data"})
    } 
}
static addSubCategoryt=async(req,res)=>{
    try{
        
        const cate = new categoryModel({
            parent:req.params.id,    
            ...req.body 
        })
        await cate.save()
        res.status(200).send({apiStatus:true, data:cate, message:"added sub-cate successfully"})
    }
    catch(e){
        res.status(500).send({apiStatus:false, data:e.message, message:"invalid data"})
    } 
}
static showAll=async(req,res)=>{
    try{
        //main category
        const categories =await categoryModel.find({parent:null});     
        res.status(200).send({apiStatus:true, data:categories, message:"show all cate successfully"})
    }
    catch(e){
        res.status(500).send({apiStatus:false, data:e.message, message:"error data"})
    } 
}
//show all sub categories of one category
static showSingle=async(req,res)=>{
    try{
        const subCategories =await categoryModel.find({parent:req.params.id});  
        res.status(200).send({apiStatus:true, data:subCategories, message:"show all cate successfully"})
    }
    catch(e){
        res.status(500).send({apiStatus:false, data:e.message, message:"error data"})
    } 
}
////////////addAttribute
static addAttri=async(req,res)=>{
    try{
       // console.log(req.body.attributes);
        const subCategory =await categoryModel.findById(req.params.id);   
        if(!subCategory)  {res.status(404).send({apiStatus:false, data:subCategories, message:"subCategory not found"})}
     subCategory.attributes.push({attr:req.body.attributes});
     await subCategory.save();
        res.status(200).send({apiStatus:true, data:subCategory, message:"ubdated successfully"})
    }
    catch(e){
        res.status(500).send({apiStatus:false, data:e.message, message:"error data"})
    } 
}
static deleteCat=async(req,res)=>{
    try{
        const category =await categoryModel.findById(req.params.id); 
        if(!category){res.status(404).send({apiStatus:false, data:category, message:"Category not found"})}
        const subcategories=await categoryModel.find({parent:req.params.id});
        //del cate
        if(!subcategories) {
             // Delete the document by its _id
           await categoryModel.deleteOne({ _id: req.params.id });
           res.status(200).send({apiStatus:true, data:category, message:"deleted cat successfully"})
        }
        else{
            subcategories.forEach(async(sub) => {
                await categoryModel.deleteOne({ _id: sub._id});
             
            });
            //delete main 
            await categoryModel.deleteOne({ _id: req.params.id });
            res.status(200).send({apiStatus:true, data:category, message:"deleted cat successfully"})
        }
    
      
    }
    catch(e){
        res.status(500).send({apiStatus:false, data:e.message, message:"error data"})
    } 
}
static delAttr=async(req,res)=>{
    try{
        const category =await categoryModel.findById(req.params.catid);  
        //del Attr
        category.attributes=category.attributes.filter(attr=>attr._id!=req.params.attrid);
        await category.save();
        res.status(200).send({apiStatus:true, data:category.attributes, message:"delete attribute successfully"})
    }
    catch(e){
        res.status(500).send({apiStatus:false, data:e.message, message:"error data"})
    } 
}
///updat main cat
static updateCat=async(req,res)=>{
 try{
    let cat= await categoryModel.findById(req.params.catid);
    if(!cat) res.status(404).send({apiStatus:false,data:cat,message:"not found"})
    cat.name=req.body.name;
     await cat.save()
     res.status(200).send({apiStatus:true,data:cat,message:"cat updateed successfully"});
 }catch(e){
    res.status(500).send({apiStatus:false,data:e.message,message:"data err"});
 }
   
}
////////////////////////////////////////////////////////////////////////////////////////
 static updateAttr=async(req,res)=>{
    try{
        // console.log(req.body.attributes);
         //const subCategory =await categoryModel.findById(req.params.catid );
        // if(!subCategory) res.status(404).send({apiStatus:false,data:cat,message:"not found"});
   var x=  await   categoryModel.update({"_id": req.params.catid, "attributes._id": req.params.attrid},
         {$set: {"$attributes.attr.name":req.body.name}})
console.log(x);
       /*   subCategory.attributes.forEach((attr) => {
            if(attr._id==req.params.attrid) {attr.name=req.body.name; attr.values=req.body.values;}
           
        }); */
  // await subCategory.save(); 
  res.status(200).send({apiStatus:true, data:x, message:"ubdated successfully"})
     }
     catch(e){
         res.status(500).send({apiStatus:false, data:e.message, message:"error data"})
     } 
} 
static getAllAttributes=async(req,res)=>{
    try{
        const category =await categoryModel.findById(req.params.id);  

        res.status(200).send({apiStatus:true, data:category.attributes, message:"show all attributes successfully"})
    }
    catch(e){
        res.status(500).send({apiStatus:false, data:e.message, message:"error data"})
    } 
}
}
module.exports=Category;