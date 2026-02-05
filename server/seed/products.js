import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import { products } from "../../src/data/products.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

const seed = async () => {
  await connectDB();

  const mapped = products.map((item) => ({
    name: item.name,
    price: item.price,
    image: item.image,
    description: item.description || "",
    active: true,
  }));

  await Product.deleteMany();
  await Product.insertMany(mapped);

  console.log(`Seeded ${mapped.length} products.`);
  process.exit(0);
};

seed().catch((error) => {
  console.error("Failed to seed products:", error);
  process.exit(1);
});
