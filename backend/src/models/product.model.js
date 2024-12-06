import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true },
    price: {
        type: Number, 
        required: true },
    description: {
         type: String 
        },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true 
        },
    category: {
        type: String,
        required: true,
        enum: ['men', 'women','kids'],
    },
    productImage: {
        type: String,
        require: true
    }
},{timestamps: true})

export const Product = mongoose.model("Product",productSchema)


