import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess, toastWarning } from "../utils/alerts.js";
import { apiFetch } from "../utils/api.js";
import { useAppContext } from "../utils/app-context.jsx";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { user, refreshCart } = useAppContext();

  async function handleAddToCart() {
    if (!user) {
      await toastWarning("กรุณาเข้าสู่ระบบ", "ล็อกอินก่อนเพิ่มสินค้าในตะกร้า");
      navigate("/login");
      return false;
    }

    if (user?.role === "admin") {
      await toastWarning("แอดมินไม่สามารถสั่งซื้อได้", "กรุณาใช้บัญชีผู้ใช้ทั่วไป");
      return false;
    }

    if (!product?._id) {
      toastError("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่มสินค้านี้ได้");
      return false;
    }

    try {
      await apiFetch("/api/cart/items", {
        method: "POST",
        body: { productId: product._id, quantity: 1 },
      });
      await refreshCart();
      await toastSuccess("เพิ่มลงตะกร้าแล้ว", product.name);
      return true;
    } catch (error) {
      await toastError("เพิ่มสินค้าไม่สำเร็จ", error.message || "กรุณาลองใหม่");
      return false;
    }
  }

  async function handleBuyNow() {
    const ok = await handleAddToCart();
    if (ok) {
      navigate("/cart");
    }
  }

  return (
    <article className="brand-card group flex h-full flex-col rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(26,0,51,0.18)]">
      <div className="mb-4 flex h-44 items-center justify-center rounded-xl bg-gradient-to-br from-[#f5ecff] via-white to-[#ffeede] p-4">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <h3 className="text-lg font-extrabold text-[#3a0068]">{product.name}</h3>
      <p className="mt-1 text-sm text-slate-600">{product.description}</p>

      <div className="mt-4 flex items-end justify-between">
        <p className="text-2xl font-black text-[var(--brand-accent)]">฿{product.price}</p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className="rounded-xl border border-[#4a0080] bg-[#4a0080] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#2d004d]"
        >
          เพิ่มลงตะกร้า
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="rounded-xl border border-[var(--brand-accent)] bg-[var(--brand-accent)] px-3 py-2 text-sm font-bold text-white transition hover:brightness-95"
        >
          ซื้อเลย
        </button>
      </div>
    </article>
  );
}
