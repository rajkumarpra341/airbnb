const express = require("express") ; 
const app = express() ; 
const mongoose = require("mongoose") ;
const path = require("path") ; 
 const Listing = require("./module/listing.js") ;
const methodOverride = require("method-override") ; 
const ejsMate = require("ejs-mate") ; 


app.set("view engine" , "ejs" ) ; 
app.set("views" , path.join(__dirname , "views")) ; 
app.engine("ejs" , ejsMate) ; 
app.use(express.static (path.join(__dirname , "public"))) ; 
app.use(express.urlencoded({extended : true })) ; 
app.use(methodOverride("__method")) ; 



// insert data 

// let list1 = new Listing(
//     {
//         title :"RK_hotal" , 
//         discription : "This is the one of the best hotal in the word! ", 
//         image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTQWBTQpDs1HVkYY5K6En_xOlbL_zwvVjXUg&s" , 
//         price : 18000,
//         location : "Indore" ,
//         country : "India", 
//     }
// ); 

// list1.save().then((res) => 
// {
//     console.log(res) ; 
// });




// connection to db 
main().then( () => 
{
    console.log("connection successfully") ; 
}).catch((err) => console.log(err) ) ; 

async function main()
{
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb_db");
}
    

// // index router 

app.get("/lists" , async(req , res) => 
{
    let listings = await Listing.find() ; 
    console.log(listings) ; 
    res.render("index.ejs" , {listings}) ; 
}) ; 

// // create new router 

app.get("/lists/new" , (req , res) => 
{
    res.render("new.ejs") ; 
}) ; 

// // add new user's data 

app.post("/lists" , (req , res) => 
{
     let {title , discription , image , price , location , country } = req.body ; 
     let newList = new Listing({
        title : title, 
        image: image, 
        discription : discription , 
        price : price , 
        location : location , 
        country : country , 
        
     });

     newList.save()
     .then((res) => 
    {
        console.log("Listt was saved") ; 
    }).catch((err) =>
    {
        console.log(err);
    });

    res.redirect("/lists") ; 
});

// // Edit router 

app.get("/lists/:id/edit" , async(req , res) =>
{
    let{id} = req.params ; 
    let listing = await Listing.findById(id) ; 
    res.render("edit.ejs" , {listing}) ; 
});
// // update route 

app.put("/lists/:id" , async(req , res) => 
{
    let{id} = req.params ; 
    let{title : newtitle , discription : newdiscription , 
        image : newimage , price : newprice , location : newlocation , country : newcountry
    } = req.body; 
    let updatedList = await Listing.findByIdAndUpdate(id,
        {
            title: newtitle,
            discription: newdiscription,
            image: newimage,
            price: newprice,
            location: newlocation,
            country: newcountry
        },
        {runValidation : true , new : true } 
    ) ;
    console.log(updatedList) ; 
    res.redirect("/lists");
})
 

// // Delete router 
app.delete("/lists/:id" , async(req , res) => 
{
    let{id} = req.params ; 
    let deletedList = await Listing.findByIdAndDelete(id) ; 
    console.log(deletedList) ; 
    res.redirect("/lists");
});


// Show Route (Specific Details)
app.get("/lists/:id", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("details.ejs", { listing }); // यहाँ single 'listing' पास करें
});


// Index Router with Search Functionality
app.get("/lists", async (req, res) => {
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
    res.redirect("/lists");
}) ; 

app.listen(8080 , ()=> 
{
    console.log("server is working on the port is 8080") ; 
})
