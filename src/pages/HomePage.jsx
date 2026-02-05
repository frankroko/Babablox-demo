import { useEffect, useState } from "react";
import PageShell from "../components/PageShell.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import { apiFetch } from "../utils/api.js";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoading(true);
      try {
        const data = await apiFetch("/api/products?active=true&limit=8");
        if (active) {
          setProducts(data.items || []);
        }
      } catch (error) {
        if (active) {
          setProducts([]);
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

  const featured = products.slice(0, 4);

  return (
    <>
      <section className="brand-gradient text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 md:flex-row md:items-center md:justify-between md:px-6 md:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/70">Marketplace</p>
            <h1 className="mt-3 text-4xl font-black leading-[1.05] md:text-6xl">ซื้อ-ขายไอดีเกมแบบมั่นใจ</h1>
            <p className="mt-4 max-w-xl text-base text-white/85 md:text-lg">
              Babablox คือพื้นที่สำหรับซื้อขายไอดีเกมและไอเท็มใน Roblox ที่เรียบง่าย รวดเร็ว และปลอดภัยกว่าเดิม
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/products"
                className="rounded-xl bg-[var(--brand-accent)] px-5 py-3 text-sm font-black text-white transition hover:brightness-95"
              >
                ดูสินค้าทั้งหมด
              </a>
              <a
                href="https://line.me/ti/p/mrgy7EasBd"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/60 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10"
              >
                คุยกับแอดมิน
              </a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-white/10 blur-3xl" aria-hidden="true" />
            <div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur">
              <p className="text-sm font-bold text-white/70">สินค้ายอดนิยมตอนนี้</p>
              {loading ? (
                <p className="mt-4 text-sm text-white/70">กำลังโหลดรายการ...</p>
              ) : (
                <ul className="mt-4 space-y-3 text-sm">
                  {featured.slice(0, 3).map((item) => (
                    <li key={item._id} className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
                      <span className="font-bold">{item.name}</span>
                      <span className="font-black text-[var(--brand-accent)]">฿{item.price}</span>
                    </li>
                  ))}
                  {featured.length === 0 ? (
                    <li className="rounded-xl bg-white/10 px-4 py-3 text-white/70">ยังไม่มีสินค้า</li>
                  ) : null}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      <PageShell title="สินค้าแนะนำสำหรับคุณ" subtitle="คัดมาให้พร้อมเริ่มซื้อได้ทันที">
        {loading ? (
          <div className="brand-card rounded-2xl p-6 text-slate-600">กำลังโหลดสินค้า...</div>
        ) : (
          <ProductGrid products={featured} />
        )}
      </PageShell>
    </>
  );
}
