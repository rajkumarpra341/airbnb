const express = require("express") ;  
const { default: mongoose, set } = require("mongoose");

const listingSchema = new mongoose.Schema(
    {
        title : {
            type : String , 
            required : true 

        } , 
        discription : {
            type : String , 
            required : true 
        }, 
        image : {
            type : String , 
            set : (v) => v===""?"https://static.vecteezy.com/system/resources/thumbnails/049/855/347/small/nature-background-high-resolution-wallpaper-for-a-serene-and-stunning-view-photo.jpg" : v , 
        }, 
        price : 
        {
            type : Number , 
            required : true 
        }, 
         location : 
        {
            type : String , 
            required : true 
        }, 
         country : 
        {
            type : String , 
            required : true 
        }, 
    }
) ; 

const Listing = mongoose.model("Listing" ,listingSchema); 
module.exports = Listing ; 