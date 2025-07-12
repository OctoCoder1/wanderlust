const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.destroyReview = async(req,res)=>{
    let { id , reviewid} = req.params;
    await Listing.findByIdAndUpdate(id ,{$pull : {reviews : reviewid}});
    await Review.findByIdAndDelete(reviewid);
     req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}

module.exports.createReview = async(req,res)=>{
    let list = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
     list.reviews.push(newReview);
     await newReview.save();
     await list.save();
    req.flash("success","New Review Created");
    res.redirect(`/listings/${list._id}`);
}