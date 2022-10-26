
const productModel=require('../../models/product.model');

class Product{
 static addProduct=async(req,res)=>{
    try{
        const pro = new productModel({
            userId:req.user._id,
            ...req.body 
        })
        await pro.save()
        res.status(200).send({apiStatus:true, data:pro, message:"added product successfully"})
    }
    catch(e){
        res.status(500).send({apiStatus:false, data:e.message})
    }
}

static showMyProducts =async(req,res)=>{
    await req.user.populate("myProducts")
    //if(req.user.myProducts)
    res.status(200).send({apiStatus:true, data:req.user.myProducts, message:"show my product"})
   // res.send(req.user.myProducts)
}
static showAll=async(req,res)=>{
try {
    let allProduct=await productModel.find();
    res.status(200).send({
        apiStatus: true,
        data: allProduct,
        message: "data get successfuly"
    })
}
catch (e) {
    res.status(500).send({
        apiStatus: false,
        data: e.message,
        message: "error getting product"
    })
}
}
static showSingle = async (req, res) => {
    try {
      let product=await productModel.findById(req.params.id);
      let message= "data got successfuly"
      let mStatus = 200
      if(!product){ message="product not found"; mStatus=404 } 
        res.status(mStatus).send({
            apiStatus: true,
            data: product,
            message
        })
    }
    catch (e) {
        res.status(500).send({
            apiStatus: false,
            data: e.message,
            message: "error getting data"
        })
    }

}
static uploadProductImgs=async(req,res)=>{
    try{
        // res.send(req.files)
        let product=await productModel.findById(req.params.id);
        let message= "data updated successfuly"
        let mStatus = 200
        if(!product){}
        req.files.forEach(file => {
            product.imges.push(file.path);
        });
        await product.save();
        res.status(mStatus).send({apiStatus:true,data:product,message:message});

    }catch(e){
        res.status(500).send({
            apiStatus: false,
            data: e.message,
            message: "error updating data"
        })
    }
}
}
module.exports=Product;