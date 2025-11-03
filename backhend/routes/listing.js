const express= require("express");
const router= express.Router();
const wrapAsync=require("../Utils/wrapAsync");
const ExpressError=require("../Utils/ExpressError");
const methodOverride= require("method-override");
const path=require("path");
const Listing=require("../models/listing");
const flash= require("connect-flash");
const {isOwner}=require("../MiddleWares");
const listingController=require("../Controllers/listing");
const multer=require("multer");
const {storage}=require("../cloudConfig");
const upload = multer({ storage });

router.get("/",wrapAsync(async(req,res)=>{
  let AllListings= await Listing.find();
  res.render("index.ejs",{AllListings});
}))

//new route 
router.get("/new",wrapAsync(listingController.login));
// router.post("/",wrapAsync(listingController.newFormRoute));
router.post("/", upload.single('image'), function (req, res, next) {
   res.send(req.file);
})
//edit route
router.get("/:id/edit",isOwner,wrapAsync(listingController.editFormRoute))

//re-direct after an edit 
router.patch("/:id",isOwner,wrapAsync(listingController.submitEditRoute))
//show listing route
router.get("/:id",wrapAsync(listingController.showListings))



//delete listing
router.delete("/:id/delete",isOwner,wrapAsync(listingController.destroyRoute));

module.exports=router;