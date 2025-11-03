const express=require("express");
const app=express();
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(session({
    secret:"blackcatcalling",
    resave:false,
    saveUninitialized:true,
}))
app.use(flash());


app.get("/",(req,res)=>{
    res.send("Hello i am root");
})
app.get("/count",(req,res)=>{
     if(req.session.count){
            req.session.count++;
     }
     else{
          req.session.count=1;
     }
    res.send(`Total number of save is ${req.session.count}` );
    
})
app.get("/greeting", (req, res) => {
    let { name = "gopal" } = req.query;
    req.session.name = name;
    req.flash("info", "successfully login..");

    req.session.save(() => {
        res.redirect("/greet");
    });
});
app.get("/greet", (req, res) => {
    res.locals.successMsg= req.flash("info");
    res.render("hello.ejs", {
        name: req.session.name
    });
});



app.listen(3000,()=>{
    console.log("Server is started at port:",3000);
})