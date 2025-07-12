const Listing = require("../models/listing.js");

module.exports.index = async(req,res)=>{
    const allListing = await Listing.find()
    res.render("listings/index.ejs",{ allListing });
}

module.exports.renderNew = (req,res)=>{
  res.render("listings/new.ejs");
}

module.exports.createNew = async(req,res,next)=>{
  try {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    
    // Check if file was uploaded successfully
    if(req.file) {
      let url = req.file.path;
      let filename = req.file.filename;
      newListing.image = {url, filename};
    } else {
      // Use a default image if no file is uploaded
      newListing.image = {
        url: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        filename: "default"
      };
    }
    
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
  } catch (error) {
    req.flash("error", "Failed to create listing. Please try again.");
    res.redirect("/listings/new");
  }
}

module.exports.updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, location, country } = req.body.listing;

    const updatedListing = {
      title,
      description,
      price,
      location,
      country
    };

    let listing = await Listing.findByIdAndUpdate(id, updatedListing, {new: true});
    
    // If a new file is uploaded, update the image
    if(typeof req.file !== "undefined" && req.file){
       let url = req.file.path;
       let filename = req.file.filename;
       listing.image = {url, filename};
       await listing.save();
    }
    
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    req.flash("error", "Failed to update listing. Please try again.");
    res.redirect(`/listings/${id}/edit`);
  }
}

module.exports.renderEdit = async(req,res)=>{
     let {id} = req.params;
     const list =await Listing.findById(id);
     let orgurl = list.image.url;
     orgurl = orgurl.replace("/upload","/upload/h_300,w_250");
     res.render("listings/edit.ejs", { list , orgurl});
}

module.exports.destroy = async (req,res)=>{
    let {id} = req.params;
    let delList =await Listing.findByIdAndDelete(id);
    console.log(delList);
     req.flash("success"," Listing Deleted");
     res.redirect("/listings");
}

module.exports.show = async (req,res)=>{
    let {id} = req.params;
    let list =await Listing.findById(id)
     .populate({
    path: "reviews",
    populate: {
      path: "author",
    },
  })
  .populate("owner");
   if(!list){
    req.flash("error","listing not exists");
    res.redirect("/listings");
   }
   res.render("listings/show.ejs", {list});
}

module.exports.search = async(req,res)=>{
  const {q} = req.query;

  if(!q || q.trim() === ""){
    req.flash("error", "please enter a valid destination!");
    return res.redirect("/listings");
  }
  
  const results = await Listing.find({
    $or: [
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } }
    ]
  });

  if (results.length === 0) {
    req.flash("error", `No listings found for "${q}"`);
    return res.redirect("/listings");
  }

  res.render("listings/search.ejs", {  results });
};
 
