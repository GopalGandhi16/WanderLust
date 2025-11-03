const mongoose=require("mongoose");
const Listing =require("../models/listing");
const initdata=require("./init");
const url="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("Mongodb connected succesfully");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(url);
}
async function initDb(){
    await Listing.deleteMany({});
    initdata.data= initdata.data.map((obj)=>({
        ...obj,owner:"6872af2b595808a8ae27c61f",
    })) 
await Listing.insertMany(initdata.data);
console.log("data inserted succesfully");
}
initDb();