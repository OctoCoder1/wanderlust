const User = require("../models/user.js");

module.exports.signupForm =(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp =async(req,res)=>{
    try {
    let {username , email , password} = req.body;
    let newUser = new User({username ,email});
    const regUser = await User.register(newUser , password);
    console.log(regUser);
    req.login(regUser , (err)=>{
        if(err){
         return   next(err);
        }
        req.flash("success" , "Welcome to Wanderlust");
        res.redirect("/listings");
    })
    } catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
}

module.exports.loginForm =(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.logIn = async(req,res)=>{
  req.flash("success","Welcome Back to Wanderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings" ;
  res.redirect(redirectUrl);
}

module.exports.logout =(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
         return   next(err);
        }
        req.flash("success","you are loggedOut!");
        res.redirect("/listings");
    });
}