const { Schema, default: mongoose } = require("mongoose");


const productSchema = new Schema({ 
    name:String,
    brand: String,
    imageUrl: String,
    price: Number,
    quantity: Number
})
const Product = mongoose.model("products",productSchema)
module.exports= Product;