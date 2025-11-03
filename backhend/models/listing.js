const mongoose=require("mongoose");
const   Review=require("./Review.js")
const listingSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://media.istockphoto.com/id/1223072133/photo/cityscape-of-a-residential-area-with-modern-apartment-buildings-new-green-urban-landscape-in.jpg?s=2048x2048&w=is&k=20&c=LmzTjqpF2nT0xknslfPFpNuC5wRbMDVKYiQ8YoMCJkE=",
        set :(v) => v===""?"https://media.istockphoto.com/id/1223072133/photo/cityscape-of-a-residential-area-with-modern-apartment-buildings-new-green-urban-landscape-in.jpg?s=2048x2048&w=is&k=20&c=LmzTjqpF2nT0xknslfPFpNuC5wRbMDVKYiQ8YoMCJkE=":v
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    price:Number,
    location:String,
    country:String,
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
})
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})
const Listing=mongoose.model("listing",listingSchema);


module.exports=Listing;