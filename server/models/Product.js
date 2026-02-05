import mongoose from "mongoose";
import slugify from "../utils/slugify.js";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.pre("validate", function setSlug(next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name);
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
