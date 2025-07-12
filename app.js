if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require("express");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require("path");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const MongoStore = require('connect-mongo');
const session = require('express-session');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingroute = require("./routes/list.js");
const reviewroute = require("./routes/review.js");
const userroute = require("./routes/users.js");

const atlasDb = process.env.ATLAS_DB ;

const app = express();

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);

const store = MongoStore.create({
    mongoUrl: atlasDb,
    crypto: {
    secret: process.env.SECRET,
  },
  touchAfter : 24 * 3600,
});
 

const sessionOption = {
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000 ,
    maxAge : 7 * 24 * 60 * 60 * 1000 ,
    httpOnly : true,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(async(req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curUser = req.user;
  next();
})

main()
.then(()=>{
    console.log("connected to DB");
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect(atlasDb);
};

app.use("/listings", listingroute);
app.use("/listings/:id/reviews" , reviewroute);
app.use("/" ,userroute);

app.get("/",(req,res)=>{
    res.redirect("/listings");
});

app.use((req,res,next)=>{
  next(new expressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode = 500,message ="Something went wrong"} = err;
    res.status(statusCode).render("listings/error.ejs", {message});
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



