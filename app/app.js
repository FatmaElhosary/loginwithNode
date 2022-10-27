const express = require("express")
const app = express()
const cors=require('cors');
//const cookieParser=require(cookie-parser);
require("dotenv").config();
require("../models/dbconnection/dbconnection")
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//app.use(cookieParser());

const userRoutes = require("../routes/user.routes");
const productRoutes=require('../routes/product.routes');


app.use("/api/user",userRoutes);
app.use('/api/product',productRoutes);

const path=require('path');
app.get('/images/:imgPath',async(req,res)=>{
let filePath=`../images/${req.params.imgPath}`;
res.sendFile(path.join(__dirname,filePath));
})
///cookie
/* app.get('/set-cookies',(req,res)=>{

    res.cookie('newUser',false);
}) */
module.exports = app