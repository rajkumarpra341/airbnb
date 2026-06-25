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
            listings = await Listing.find({
                title: { $regex: search, $options: "i" }
            });
        } else {
            listings = await Listing.find();
        }

        res.render("index.ejs", { listings });
    } catch (err) {
        next(err);
    }
});

// NEW ROUTE
app.get("/lists/new", (req, res) => {
    res.render("new.ejs");
});

// CREATE ROUTE
app.post("/lists", async (req, res, next) => {
    try {
        let { title, discription, image, price, location, country } = req.body;

        let newList = new Listing({
            title,
            discription,
            image,
            price,
            location,
            country,
        });

        await newList.save();
        res.redirect("/lists");
    } catch (err) {
        next(err);
    }
});

// SHOW ROUTE
app.get("/lists/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        res.render("details.ejs", { listing });
    } catch (err) {
        next(err);
    }
});

// EDIT ROUTE
app.get("/lists/:id/edit", async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        res.render("edit.ejs", { listing });
    } catch (err) {
        next(err);
    }
});

// UPDATE ROUTE
app.put("/lists/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        let {
            title,
            discription,
            image,
            price,
            location,
            country
        } = req.body;

        await Listing.findByIdAndUpdate(id, {
            title,
            discription,
            image,
            price,
            location,
            country
        });

        res.redirect("/lists");
    } catch (err) {
        next(err);
    }
});

// DELETE ROUTE
app.delete("/lists/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect("/lists");
    } catch (err) {
        next(err);
    }
});

// ====== ERROR HANDLING ======
app.use((err, req, res, next) => {
    console.error("ERROR:", err);
    res.status(500).send("Internal Server Error: " + err.message);
});

// ====== START SERVER ======
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});