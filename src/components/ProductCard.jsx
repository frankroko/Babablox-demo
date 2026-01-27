import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "../utils/alerts.js";
import { getCart, setCart } from "../utils/storage.js";
import { useAppContext } from "../utils/app-context.jsx";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { refreshCart } = useAppContext();

  function addItem(quantity = 1) {
    if (!product?.name || !product?.price) {
      toastError("เกิดข้อผิดพลาด", "ไม่สามารถเพิ่มสินค้านี้ได้");
      return null;
    }

    const cart = getCart();
    const existing = cart.find((item) => item.name === product.name);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ name: product.name, price: product.price, quantity });
    }
    setCart(cart);
    refreshCart();
    return cart;
  }

  async function handleAddToCart() {
    const cart = addItem(1);
    if (!cart) return;
    await toastSuccess("เพิ่มลงตะกร้าแล้ว", product.name);
  }

  function handleBuyNow() {
    const cart = addItem(1);
    if (!cart) return;
    navigate("/cart");
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
