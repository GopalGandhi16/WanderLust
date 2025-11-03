const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/Review");
const wrapAsync = require("../Utils/wrapAsync");
const reviewValidate = require("../validateReview");
const ExpressError = require("../Utils/ExpressError");
const flash=require("connect-flash");
const User=require("../models/User");
const reviewController = require("../Controllers/review");
// ✅ Validation middleware
let reviewValidation = (req, res, next) => {
    let { error } = reviewValidate.validate(req.body);
    if (error) {
        let msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

//reviews
// POST /listings/:id/reviews
router.post("/", reviewValidation, wrapAsync(reviewController.newReview));

// DELETE /listings/:id/reviews/:reviewId/delete
router.delete("/:reviewId/delete", wrapAsync(reviewController.destroyReview));

module.exports=router;