const Listing= require("../models/listing");
const Review = require("../models/Review");

module.exports.newReview = async (req, res) => {
    if(!req.isAuthenticated()){
        req.flash("error","Need to login before creating new review");
       return res.redirect("/user/login");
    }
    const { id } = req.params;
    let listing = await Listing.findById(id);
    let review = new Review(req.body.review);
    review.author= req.user._id;
    console.log(review.author);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success","New review created succesfully");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async (req, res) => {
    if(!req.isAuthenticated()){
            req.flash("error","Need to login before deleting review");
           return  res.redirect("/user/login");
    }
    const { id, reviewId } = req.params;
    let user= await Review.findById(reviewId);
        if(!req.user._id.equals(user.author)  ){
            req.flash("error","Sorry you cannot delete this review");
            return res.redirect(`/listings/${id}`);
        }
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted succesfully");
    res.redirect(`/listings/${id}`);
}