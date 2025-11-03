const Listing= require("../models/listing");
const User= require("../models/User");

module.exports.signup= (req, res) => {
    res.render("signUp.ejs"); 
}
module.exports.signupRoute=async(req,res,next)=>{
    try{
 let{username,password,email}=req.body;
 let user1=new User({username,email});
 let Userdata=await User.register(user1,password);
 console.log("User1");
req.login(Userdata,(err)=>{
     if(err){
        next(err);
     }
     req.flash("success","Welcome to wanderlust");
     res.redirect("/listings");
})
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/user/signUp");
    }

}
module.exports.loginUser=async(req,res)=>{
   req.flash("success","Logged in succesfully");
   res.redirect("/listings");
}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success","You are logged out!");
            res.redirect("/listings");
        }
    })
}