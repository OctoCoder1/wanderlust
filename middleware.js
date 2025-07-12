const Listing = require("./models/listing.js");
const {schemaList } = require("./schema.js");
const expressError = require("./utils/expressError.js");
const {schemareview} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedin = (req,res,next)=>{
 if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","You must be loggedIn!");
 return  res.redirect("/login");
 }
 next();
};

module.exports.saveredirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner =async (req,res,next)=>{
   const { id } = req.params;
   let listing = await Listing.findById(id);
   if(!listing.owner._id.equals(res.locals.curUser._id)){
    req.flash("error","You are not the Owner");
    return res.redirect(`/listings/${id}`);
   }
   next();
}

module.exports.valiSchema = (req,res,next)=>{
   let result = schemaList.validate(req.body);
    if(result.error){
        throw new expressError(400, result.error);
    } else {
        next();
    }
}

module.exports.valireview = (req,res,next)=>{
   let result = schemareview.validate(req.body);
    if(result.error){
        throw new expressError(400, result.error);
    } else {
        next();
    }
}


module.exports.isreviewAuthor =async (req,res,next)=>{
   let { id , reviewid} = req.params;
   let review = await Review.findById(reviewid);
   if(!review.author.equals(res.locals.curUser._id)){
    req.flash("error","You are not the author");
    return res.redirect(`/listings/${id}`);
   }
   next();
}

