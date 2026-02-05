import { useEffect, useState } from "react";
import PageShell from "../components/PageShell.jsx";
import { apiFetch } from "../utils/api.js";

function formatDate(iso) {
  const date = new Date(iso);
  return date.toLocaleString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function currency(value) {
  return `฿${value.toFixed(2)}`;
}

const statusMap = {
  pending: { label: "รอดำเนินการ", classes: "bg-amber-100 text-amber-700" },
  paid: { label: "ชำระเงินแล้ว", classes: "bg-blue-100 text-blue-700" },
  fulfilled: { label: "สำเร็จ", classes: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "ยกเลิก", classes: "bg-rose-100 text-rose-700" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch("/api/orders");
        if (active) {
          setOrders(data.items || []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "โหลดคำสั่งซื้อไม่สำเร็จ");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadOrders();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <PageShell title="ประวัติการสั่งซื้อ" subtitle="กำลังโหลดรายการของคุณ">
        <div className="brand-card rounded-2xl p-6 text-slate-600">กำลังโหลด...</div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell title="ประวัติการสั่งซื้อ" subtitle="เกิดข้อผิดพลาด">
        <div className="brand-card rounded-2xl p-6 text-red-600">{error}</div>
      </PageShell>
    );
  }

  if (orders.length === 0) {
    return (
      <PageShell title="ประวัติการสั่งซื้อ" subtitle="ยังไม่มีคำสั่งซื้อ">
        <div className="brand-card rounded-2xl p-6 text-slate-700">
          ยังไม่มีคำสั่งซื้อ เริ่มช้อปปิ้งที่หน้า "สินค้าทั้งหมด"
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="ประวัติการสั่งซื้อ" subtitle="รายการสั่งซื้อทั้งหมดของคุณ">
      <div className="space-y-5">
        {orders.map((order, index) => {
          const orderNumber = `ORD-${String(1000 + index).padStart(4, "0")}`;
          const status = statusMap[order.status] || statusMap.pending;
          return (
            <article key={order._id} className="brand-card rounded-2xl p-5">
              <header className="flex flex-col gap-2 border-b border-[#4a0080]/10 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-500">คำสั่งซื้อ</p>
                  <h2 className="text-xl font-black text-[#2a004d]">{orderNumber}</h2>
                  <p className="text-sm text-slate-600">{formatDate(order.createdAt)}</p>
                </div>
                <span
                  className={`inline-flex w-fit items-center rounded-full px-4 py-2 text-sm font-black ${status.classes}`}
                >
                  {status.label}
                </span>
              </header>

              <div className="mt-4 space-y-3">
                {order.items.map((item) => {
                  const total = item.price * item.quantity;
                  return (
                    <div
                      key={`${order._id}-${item.name}`}
                      className="flex flex-col gap-1 rounded-xl border border-slate-100 bg-white/70 px-4 py-3 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="font-bold text-[#2a004d]">{item.name}</p>
                        <p className="text-sm text-slate-600">
                          จำนวน: {item.quantity} x {currency(item.price)}
                        </p>
                      </div>
                      <p className="text-lg font-black text-[var(--brand-accent)]">{currency(total)}</p>
                    </div>
                  );
                })}
              </div>

              <footer className="mt-4 flex items-center justify-between border-t border-[#4a0080]/10 pt-4">
                <p className="text-sm font-bold text-slate-500">รวมทั้งหมด</p>
                <p className="text-2xl font-black text-[var(--brand-accent)]">{currency(order.subtotal)}</p>
              </footer>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}
