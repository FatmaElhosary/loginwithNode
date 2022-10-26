const router=require('express').Router();
const productController=require('../app/controller/product.controller');
const auth=require('../middleware/auth');
const uploadMany=require('../middleware/uploadfilestorage');
router.post("/add",auth, productController.addProduct);
router.get('/myproducts', auth, productController.showMyProducts);
router.get('/all',productController.showAll);
router.get('/all/:id',productController.showSingle);
router.post('/:id',auth,uploadMany.array('imgs'),productController.uploadProductImgs);

module.exports=router;