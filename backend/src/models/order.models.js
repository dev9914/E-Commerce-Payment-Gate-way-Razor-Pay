import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Assuming you have a Product model to reference
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
    { _id: false }
  );

const OrderSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
      },
      items: {
        type: [OrderItemSchema],
        required: true,
      },
      totalPrice: {
        type: Number,
        required: true,
      },
      shippingAddress: {
        type: String,
        required: true,
      },
      paymentMethod: {
        type: String,
        enum: ["Credit Card", "Debit Card", "Cash On Delivery", "Paytm"],
        required: true,
      },
      status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Success", "Cancelled"],
      },
    },
    { timestamps: true }
  );

export const Order = mongoose.model("Order",OrderSchema)


