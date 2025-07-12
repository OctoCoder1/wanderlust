const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description: String,
    image: {
  filename: String,
  url: {
    type: String,
    set: (v) => v === "" ? "https://cdn.pixabay.com/photo/2025/06/14/06/23/lavender-field-9659072_960_720.jpg" : v,
    default: "https://cdn.pixabay.com/photo/2025/06/05/06/50/waterfall-9642279_960_720.jpg"
  }
},
    price: Number,
    location: String,
    country: String,
    reviews : [{
      type : Schema.Types.ObjectId,
      ref : "Review"
    }
    ],
    owner : {
      type: Schema.Types.ObjectId,
      ref : "User"
    }
});

listSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
      await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listSchema );

module.exports = Listing;