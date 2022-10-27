const router = require('express').Router()
const userController = require("../app/controller/user.controller")
const auth = require("../middleware/auth")
router.post("/register", userController.addUser)
router.post("/login", userController.login)
router.post("/logout", auth, userController.logOut)
router.post("/logoutAll", auth, userController.logOutAll)
router.post('/changepass',auth,userController.changePass)
const uploadwithStorage=require('../middleware/uploadfilestorage');
router.post('/profile',auth,uploadwithStorage.single('img'),userController.uploadProfileimg)

module.exports = router