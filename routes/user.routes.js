const router = require('express').Router()
const userController = require("../app/controller/user.controller")
const auth = require("../middleware/auth")
router.post("/register", userController.addUser)
router.post("/login", userController.login)
router.get("/all",auth,userController.showAll)
router.get("/all/:id",auth, userController.showSingle)
router.delete("/all",auth, userController.deleteAll)
router.delete("/all/:id",auth, userController.deleteSingle)
router.get("/me", auth, userController.me)
router.post("/logout", auth, userController.logOut)
router.post("/logoutAll", auth, userController.logOutAll)
router.get("/activate/:otp/:id", userController.activateUser)
router.post("/activateWithLogin",auth, userController.activateUserLoggedIN)
router.get("/sendOTP", auth, userController.sendOtp)
////change password
router.post('/changepass',auth,userController.changePass)
//router.post('/addaddress',auth,userController.addAddress);
//router.post('/deladdress/:id',auth,userController.deleteAddress);
//router.post('/defaultaddr/:id',auth,userController.setDefaultAddr)
///profile img
const uploadwithStorage=require('../middleware/uploadfilestorage');
router.post('/profile',auth,uploadwithStorage.single('img'),userController.uploadProfileimg)

module.exports = router