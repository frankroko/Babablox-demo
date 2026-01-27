import PageShell from "../components/PageShell.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import { products } from "../data/products.js";

export default function ProductsPage() {
  return (
    <PageShell title="สินค้าทั้งหมด" subtitle="เลือกผลไม้ Blox Fruits ที่คุณชอบ">
      <ProductGrid products={products} />
    </PageShell>
  );
}
