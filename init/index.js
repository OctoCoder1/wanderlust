const mongoose = require('mongoose');
const Listing = require("../models/listing.js");
const initdata = require("./data.js");

main()
.then(()=>{
    console.log("connected to DB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

async function newData() {
 await Listing.deleteMany({});
initdata.data = initdata.data.map((obj)=>({...obj , owner : "686cd8145326b18d6088deeb"}));
 await Listing.insertMany(initdata.data);
 console.log("Data is inserted");
};

newData();