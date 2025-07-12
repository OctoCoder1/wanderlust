const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const {isLoggedin , isOwner ,valiSchema} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedin,valiSchema,upload.single("listing[image][url]"),wrapAsync(listingController.createNew));


router.get("/new",isLoggedin,listingController.renderNew);

router.get("/search",listingController.search);

router.route("/:id")
.get(wrapAsync(listingController.show))
.put(isLoggedin,isOwner,valiSchema,upload.single("listing[image][url]"),wrapAsync(listingController.updateList))
.delete(isLoggedin,isOwner,wrapAsync(listingController.destroy));




//edit route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.renderEdit));




module.exports = router;