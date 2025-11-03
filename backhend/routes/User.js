const express=require("express");
const router= express.Router();
const User=require("../models/User");
const wrapAsync=require("../Utils/wrapAsync");
const flash=require("connect-flash");
const passport=require("passport")
const userController = require("../Controllers/user");

router.get("/signUp",(userController.signup));

router.post("/signUp",wrapAsync(userController.signupRoute));

router.get("/login",(req,res)=>{
    res.render("Login.ejs");
})
router.post("/login",passport.authenticate("local",{ failureRedirect: '/user/login',failureFlash:true}),
wrapAsync(userController.loginUser));

router.get("/logout",userController.logout);



module.exports=router;