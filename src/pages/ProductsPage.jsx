import { useEffect, useState } from "react";
import PageShell from "../components/PageShell.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import { apiFetch } from "../utils/api.js";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch("/api/products?active=true");
        if (active) {
          setProducts(data.items || []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "โหลดข้อมูลสินค้าไม่สำเร็จ");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  return (
    <PageShell title="สินค้าทั้งหมด" subtitle="เลือกผลไม้ Blox Fruits ที่คุณชอบ">
      {loading ? (
        <div className="brand-card rounded-2xl p-6 text-slate-600">กำลังโหลดสินค้า...</div>
      ) : error ? (
        <div className="brand-card rounded-2xl p-6 text-red-600">{error}</div>
      ) : (
        <ProductGrid products={products} />
      )}
    </PageShell>
  );
}
