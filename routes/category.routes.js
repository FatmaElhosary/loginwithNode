const router=require('express').Router();
const categoryController=require('../app/controller/category.controller');
const auth=require('../middleware/auth');

router.post("/addcategory",auth, categoryController.addCategoryt);
router.post("/addsubcategory/:id",auth, categoryController.addSubCategoryt);
//show all categories
router.get('/all', categoryController.showAll);
//show all subcategories of a single one 
router.get('/all/:id',categoryController.showSingle);
///////////////////add attributes////////////////////////
router.patch('/all/:id',categoryController.addAttri);
router.delete('/delete/:id',auth,categoryController.deleteCat);
///get all attributes of cat 

router.get('/attr/:id',auth,categoryController.getAllAttributes);
//del attr
router.delete('/attr/:catid/:attrid',auth,categoryController.delAttr);
//update attr
router.patch('/attr/:catid/:attrid',auth,categoryController.updateAttr);
//update cat
router.patch('/:catid',auth,categoryController.updateCat)
//delete cat
//router.delete('/all/:id',categoryController.delCat);
module.exports=router;