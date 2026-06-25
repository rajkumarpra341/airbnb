require("dotenv").config();
const dns = require("dns")
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const Listing = require("./module/listing.js");

// PORT (Render/Railway compatible)
const port = process.env.PORT || 4000;

// ====== MIDDLEWARE ======
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

// ====== MONGODB CONNECTION ======
async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log(process.env.MONGODB_URL)
        console.log("MongoDB Connected Successfully");
    } catch (err) {
        console.log("MongoDB Connection Error:", err);
    }
}

main();

// ====== ROUTES ======

// Root → redirect to lists
app.get("/", (req, res) => {
    res.redirect("/lists");
});

// INDEX + SEARCH ROUTE
app.get("/lists", async (req, res, next) => {
    try {
        let { search } = req.query;
        let listings;

    if (search) {
        // यह Title के आधार पर डेटाबेस में सर्च करेगा (case-insensitive)
        listings = await Listing.find({ title: { $regex: search, $options: "i" } });
    } else {
        listings = await Listing.find();
    }
    
    res.render("index.ejs", { listings });
});



app.get("/", (req , res) => 
{
    res.send("root is working") ; 
}) ; 

app.listen(8080 , ()=> 
{
    console.log("server is working on the port is 8080") ; 
})