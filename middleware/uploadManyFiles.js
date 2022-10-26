const multer = require('multer')
const path=require('path')
const fs = require("fs");
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"images/product_images")
    },
    filename:function(req,file,cb){
            myFileNames=(Date.now().toString()+path.extname(file.originalname));
cb(null,myFileNames);
    }
})

const upload=multer({
    storage,
    limits:{fieldSize:2000000000},
    fileFilter:function(req,file,cb){
        if(path.extname(file.originalname)!='.jpg') return cb('invalid',null)
        cb(null,true)
    }
})

module.exports=upload;