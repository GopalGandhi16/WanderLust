const Listing = require("../models/listing");
module.exports.login=(req,res)=>{
    if(!req.isAuthenticated()){
        req.flash("error","Need to login before creating new listings");
        res.redirect("/user/login");
    }
   res.render("new.ejs");
}
module.exports.newFormRoute=async(req,res)=>{   
    let {title,description,image,price,location,country}=req.body;
    let newList=new Listing({
        title,
        description,
        image,
        price,
        location,
        country
    })
    newList.owner=req.user._id;
     await newList.save();
     req.flash("success","listings succesfully created");
     res.redirect("/listings"); 
}
module.exports.editFormRoute=async(req,res)=>{
     if(!req.isAuthenticated()){
        req.flash("error","Need to login before creating the listing");
        res.redirect("/user/login");
    }
    let {id}=req.params;
    let list= await Listing.findById(id);
    res.render("edit.ejs",{list});
}
module.exports.submitEditRoute =async(req,res)=>{
    let {id}=req.params;
    let {title,description,image,price,location,country}=req.body;
    await Listing.findByIdAndUpdate(id,{title,
        description,
        image,
        price,
        location,
        country})
        req.flash("success","Listing edited succesfully");
       res.redirect(`/listings/${id}`);

}
module.exports.showListings=async (req,res)=>{
    let{id}=req.params;
    let list = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        }
    }).populate("owner");
    res.render("show.ejs",{list});
}
module.exports.destroyRoute=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Deleted listing succesfully");
    res.redirect("/listings");
}