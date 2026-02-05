import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import { confirmAction, toastError, toastSuccess } from "../utils/alerts.js";
import { apiFetch } from "../utils/api.js";
import { useAppContext } from "../utils/app-context.jsx";

function currency(value) {
  return `฿${value.toFixed(2)}`;
}

export default function CartPage() {
  const navigate = useNavigate();
  const { user, refreshCart, authReady } = useAppContext();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCart() {
    if (!user) {
      setCart([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/cart");
      setCart(data.items || []);
    } catch (err) {
      setError(err.message || "โหลดตะกร้าไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authReady) {
      loadCart();
    }
  }, [user, authReady]);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  async function updateQuantity(itemId, nextQuantity) {
    try {
      const data = await apiFetch(`/api/cart/items/${itemId}`, {
        method: "PATCH",
        body: { quantity: nextQuantity },
      });
      setCart(data.items || []);
      await refreshCart();
    } catch (err) {
      await toastError("อัปเดตจำนวนไม่สำเร็จ", err.message || "กรุณาลองใหม่");
    }
  }

  async function removeItem(itemId) {
    try {
      const data = await apiFetch(`/api/cart/items/${itemId}`, {
        method: "DELETE",
      });
      setCart(data.items || []);
      await refreshCart();
    } catch (err) {
      await toastError("ลบสินค้าไม่สำเร็จ", err.message || "กรุณาลองใหม่");
    }
  }

  async function clearCart() {
    const result = await confirmAction({
      title: "ล้างตะกร้า?",
      text: "คุณแน่ใจหรือไม่ว่าต้องการลบสินค้าทั้งหมด",
      confirmText: "ใช่, ล้างเลย",
    });
    if (result.isConfirmed) {
      try {
        const data = await apiFetch("/api/cart", { method: "DELETE" });
        setCart(data.items || []);
        await refreshCart();
      } catch (err) {
        await toastError("ล้างตะกร้าไม่สำเร็จ", err.message || "กรุณาลองใหม่");
      }
    }
  }

  async function checkout() {
    if (cart.length === 0) return;
    try {
      await apiFetch("/api/orders", {
        method: "POST",
        body: { paymentMethod: "manual", paymentStatus: "unpaid" },
      });
      setCart([]);
      await refreshCart();
      await toastSuccess("สั่งซื้อสำเร็จ", "ขอบคุณที่อุดหนุน");
      navigate("/orders");
    } catch (err) {
      await toastError("สั่งซื้อไม่สำเร็จ", err.message || "กรุณาลองใหม่");
    }
  }

  if (!authReady) {
    return (
      <PageShell title="ตะกร้าสินค้า" subtitle="กำลังตรวจสอบบัญชีผู้ใช้">
        <div className="brand-card rounded-2xl p-6 text-slate-600">กำลังโหลด...</div>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell title="ตะกร้าสินค้า" subtitle="เข้าสู่ระบบเพื่อดูตะกร้าของคุณ">
        <div className="brand-card flex flex-col items-start gap-3 rounded-2xl p-6">
          <p className="text-base text-slate-700">กรุณาล็อกอินเพื่อใช้งานตะกร้าสินค้า</p>
          <Link
            to="/login"
            className="rounded-xl bg-[#4a0080] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#2d004d] hover:text-white visited:text-white active:text-white focus:text-white"
          >
            ไปที่หน้าเข้าสู่ระบบ
          </Link>
        </div>
      </PageShell>
    );
  }

  if (loading) {
    return (
      <PageShell title="ตะกร้าสินค้า" subtitle="กำลังโหลดตะกร้าของคุณ">
        <div className="brand-card rounded-2xl p-6 text-slate-600">กำลังโหลด...</div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell title="ตะกร้าสินค้า" subtitle="เกิดข้อผิดพลาด">
        <div className="brand-card rounded-2xl p-6 text-red-600">{error}</div>
      </PageShell>
    );
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
          {cart.map((item) => {
            const total = item.price * item.quantity;
            return (
              <article key={item._id} className="brand-card rounded-2xl p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#2a004d]">{item.name}</h3>
                    <p className="text-sm text-slate-600">ราคา {currency(item.price)}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-3 py-2 text-lg font-black text-[#4a0080] transition hover:bg-[#4a0080] hover:text-white"
                        aria-label={`ลดจำนวน ${item.name}`}
                      >
                        -
                      </button>
                      <span className="min-w-12 px-3 py-2 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
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
                      onClick={() => removeItem(item._id)}
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
