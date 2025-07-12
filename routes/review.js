const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {valireview, isLoggedin , isreviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")

router.delete("/:reviewid",isLoggedin,isreviewAuthor,wrapAsync(reviewController.destroyReview));


router.post("/",valireview,isLoggedin,wrapAsync(reviewController.createReview));

module.exports = router;