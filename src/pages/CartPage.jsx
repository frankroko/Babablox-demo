import { useMemo, useState } from "react";
import PageShell from "../components/PageShell.jsx";
import { confirmAction, toastSuccess } from "../utils/alerts.js";
import { getCart, getOrderHistory, setCart, setOrderHistory } from "../utils/storage.js";
import { useAppContext } from "../utils/app-context.jsx";
import { Link, useNavigate } from "react-router-dom";

function currency(value) {
  return `฿${value.toFixed(2)}`;
}

export default function CartPage() {
  const navigate = useNavigate();
  const { refreshCart } = useAppContext();
  const [cart, setCartState] = useState(() => getCart());

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  function persist(nextCart) {
    setCartState(nextCart);
    setCart(nextCart);
    refreshCart();
  }

  function updateQuantity(index, delta) {
    const next = [...cart];
    next[index] = { ...next[index], quantity: next[index].quantity + delta };
    if (next[index].quantity < 1) {
      next.splice(index, 1);
    }
    persist(next);
  }

  function removeItem(index) {
    const next = [...cart];
    next.splice(index, 1);
    persist(next);
  }

  async function clearCart() {
    const result = await confirmAction({
      title: "ล้างตะกร้า?",
      text: "คุณแน่ใจหรือไม่ว่าต้องการลบสินค้าทั้งหมด",
      confirmText: "ใช่, ล้างเลย",
    });
    if (result.isConfirmed) {
      persist([]);
    }
  }

  async function checkout() {
    if (cart.length === 0) return;
    const history = getOrderHistory();
    history.push({
      items: cart,
      subtotal,
      total: subtotal,
      date: new Date().toISOString(),
    });
    setOrderHistory(history);
    persist([]);
    await toastSuccess("สั่งซื้อสำเร็จ", "ขอบคุณที่อุดหนุน");
    navigate("/orders");
  }

  if (cart.length === 0) {
    return (
      <PageShell title="ตะกร้าสินค้า" subtitle="ยังไม่มีสินค้าในตะกร้า">
        <div className="brand-card flex flex-col items-start gap-3 rounded-2xl p-6">
          <p className="text-base text-slate-700">ตะกร้าของคุณว่างอยู่</p>
          <Link
            to="/products"
            className="rounded-xl bg-[#4a0080] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#2d004d] hover:text-white visited:text-white active:text-white focus:text-white"
          >
            เลือกสินค้า
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="ตะกร้าสินค้า" subtitle="ตรวจสอบรายการก่อนชำระเงิน">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-4">
          {cart.map((item, index) => {
            const total = item.price * item.quantity;
            return (
              <article key={`${item.name}-${index}`} className="brand-card rounded-2xl p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#2a004d]">{item.name}</h3>
                    <p className="text-sm text-slate-600">ราคา {currency(item.price)}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => updateQuantity(index, -1)}
                        className="px-3 py-2 text-lg font-black text-[#4a0080] transition hover:bg-[#4a0080] hover:text-white"
                        aria-label={`ลดจำนวน ${item.name}`}
                      >
                        -
                      </button>
                      <span className="min-w-12 px-3 py-2 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(index, 1)}
                        className="px-3 py-2 text-lg font-black text-[#4a0080] transition hover:bg-[#4a0080] hover:text-white"
                        aria-label={`เพิ่มจำนวน ${item.name}`}
                      >
                        +
                      </button>
                    </div>

                    <p className="min-w-28 text-right text-lg font-black text-[var(--brand-accent)]">
                      {currency(total)}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="brand-card h-fit rounded-2xl p-5">
          <h2 className="text-lg font-black text-[#2a004d]">สรุปยอด</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-bold">{currency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Total</span>
              <span className="text-xl font-black text-[var(--brand-accent)]">{currency(subtotal)}</span>
            </div>
          </div>

          <div className="mt-6 grid gap-2">
            <button
              type="button"
              onClick={checkout}
              className="rounded-xl bg-[var(--brand-accent)] px-4 py-3 text-sm font-black text-white transition hover:brightness-95"
            >
              สั่งซื้อเลย
            </button>
            <button
              type="button"
              onClick={clearCart}
              className="rounded-xl border border-[#4a0080]/30 px-4 py-3 text-sm font-black text-[#4a0080] transition hover:bg-[#4a0080] hover:text-white"
            >
              ล้างตะกร้า
            </button>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
