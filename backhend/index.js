require('dotenv').config()
const express = require("express");
const app=express();
const port=8080;
const mongoose=require("mongoose");
const methodOverride= require("method-override");
const path=require("path");
const Listing=require("./models/listing");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./Utils/wrapAsync");
const ExpressError=require("./Utils/ExpressError");
const Review=require("./models/Review");
const reviewValidate=require("./validateReview");
const listingRoute=require("./routes/listing");
const reviewRoute=require("./routes/review");
const session= require("express-session");
const flash=require("connect-flash");
const passport = require("passport");
const User=require("./models/User");
const LocalStrategy=require("passport-local");
const userRouter=require("./routes/User");
console.log(process.env.CLOUD_NAME)


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);
const sessionObj= {
    secret:"catisloading",
    resave:false,
    saveUninitialized:true,
    cookie :{
        expires: Date.now() + 14*24*60*60*1000,
        maxAge:14*24*60*60*1000,
        httpOnly:true,
    },
}
app.use(session(sessionObj));
app.use(flash());

//once the session is started we add all the methods in order to setup the passport i.e authentication process
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//upto this part 

app.use((req,res,next)=>{
   res.locals.success=req.flash("success");
   res.locals.error=req.flash("error");
   res.locals.currUser=req.user;
   next();
})
const url="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("Mongodb connected succesfully");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(url);
}


app.get("/",wrapAsync((req,res)=>{
    res.render("home.ejs");
}))

app.get("/demoUser",async(req,res)=>{
    let fakeUser= new User({
        email:"gopalgandhi@gmail.com",
        username:"Yash kalyani",
    })
    let newUser=  await User.register(fakeUser,"GopalGandhi@1234");
    res.send(newUser);
})

app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewRoute);
app.use("/user",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"))
})

app.use((err,req,res,next)=>{
    let{status=500,msg="some error"} =err;
    res.status(status).render("error.ejs",{err});
})

app.listen(port,()=>{
    console.log("Server is running on port :",port);
})