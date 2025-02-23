import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  
  categoryId: {
    type: String,
    ref: "Category",
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  inventory: {
    type: Number,
    required: true,
    default: 10,
  }
});

export default mongoose.model("Product", ProductSchema);
