import { useEffect, useMemo, useState } from "react";
import PageShell from "../components/PageShell.jsx";
import { adminApiFetch } from "../utils/admin-api.js";
import { confirmAction, toastError, toastSuccess } from "../utils/alerts.js";

const statusOptions = ["pending", "paid", "fulfilled", "cancelled"];

function formatDate(iso) {
  const date = new Date(iso);
  return date.toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function currency(value) {
  return `฿${value.toFixed(2)}`;
}

const emptyProduct = {
  name: "",
  price: "",
  image: "",
  description: "",
  active: true,
};

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("products");
  const [expandedOrders, setExpandedOrders] = useState({});

  const totalProducts = products.length;
  const totalOrders = orders.length;

  const activeOrders = useMemo(
    () => orders.filter((order) => order.status !== "cancelled").length,
    [orders]
  );

  async function loadAdminData() {
    setLoading(true);
    try {
      const [productData, orderData] = await Promise.all([
        adminApiFetch("/api/products?limit=200"),
        adminApiFetch("/api/orders?scope=all"),
      ]);
      setProducts(productData.items || []);
      setOrders(orderData.items || []);
    } catch (error) {
      await toastError("โหลดข้อมูลไม่สำเร็จ", error.message || "กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);



  function handleEdit(product) {
    setEditingId(product._id);
    setProductForm({
      name: product.name || "",
      price: product.price ?? "",
      image: product.image || "",
      description: product.description || "",
      active: product.active !== false,
    });
  }

  function resetForm() {
    setEditingId(null);
    setProductForm(emptyProduct);
  }

  async function handleDelete(product) {
    const result = await confirmAction({
      title: "ลบสินค้า?",
      text: `ต้องการลบ ${product.name} หรือไม่`,
      confirmText: "ลบสินค้า",
    });
    if (!result.isConfirmed) return;

    try {
      await adminApiFetch(`/api/products/${product._id}`, { method: "DELETE" });
      await toastSuccess("ลบสินค้าแล้ว", product.name);
      setProducts((prev) => prev.filter((item) => item._id !== product._id));
    } catch (error) {
      await toastError("ลบสินค้าไม่สำเร็จ", error.message || "กรุณาลองใหม่");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!productForm.name || productForm.price === "") {
      await toastError("ข้อมูลไม่ครบ", "กรุณากรอกชื่อสินค้าและราคา");
      return;
    }

    const payload = {
      name: productForm.name.trim(),
      price: Number(productForm.price),
      image: productForm.image.trim(),
      description: productForm.description.trim(),
      active: productForm.active,
    };

    try {
      if (editingId) {
        const updated = await adminApiFetch(`/api/products/${editingId}`, {
          method: "PATCH",
          body: payload,
        });
        await toastSuccess("อัปเดตสินค้าแล้ว", payload.name);
        setProducts((prev) =>
          prev.map((item) => (item._id === editingId ? updated : item))
        );
      } else {
        const created = await adminApiFetch("/api/products", {
          method: "POST",
          body: payload,
        });
        await toastSuccess("เพิ่มสินค้าแล้ว", payload.name);
        setProducts((prev) => [created, ...prev]);
      }
      resetForm();
    } catch (error) {
      await toastError("บันทึกสินค้าไม่สำเร็จ", error.message || "กรุณาลองใหม่");
    }
  }

  async function handleOrderStatus(orderId, status, paymentStatus) {
    try {
      const updated = await adminApiFetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        body: { status, paymentStatus },
      });
      await toastSuccess("อัปเดตคำสั่งซื้อแล้ว", "สถานะถูกบันทึก");
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? updated : order))
      );
    } catch (error) {
      await toastError("อัปเดตไม่สำเร็จ", error.message || "กรุณาลองใหม่");
    }
  }

  function toggleOrderDetails(orderId) {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  }

  return (
    <PageShell title="แอดมินแดชบอร์ด" subtitle="จัดการสินค้าและคำสั่งซื้อ">
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="brand-card rounded-2xl p-5">
          <p className="text-sm font-bold text-slate-500">สินค้าทั้งหมด</p>
          <p className="mt-2 text-2xl font-black text-[#2a004d]">{totalProducts}</p>
        </div>
        <div className="brand-card rounded-2xl p-5">
          <p className="text-sm font-bold text-slate-500">คำสั่งซื้อทั้งหมด</p>
          <p className="mt-2 text-2xl font-black text-[#2a004d]">{totalOrders}</p>
        </div>
        <div className="brand-card rounded-2xl p-5">
          <p className="text-sm font-bold text-slate-500">คำสั่งซื้อที่ยังไม่ยกเลิก</p>
          <p className="mt-2 text-2xl font-black text-[#2a004d]">{activeOrders}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("products")}
          className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
            tab === "products"
              ? "bg-[#4a0080] text-white"
              : "border border-[#4a0080]/30 text-[#4a0080] hover:bg-[#4a0080]/10"
          }`}
        >
          จัดการสินค้า
        </button>
        <button
          type="button"
          onClick={() => setTab("orders")}
          className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
            tab === "orders"
              ? "bg-[#4a0080] text-white"
              : "border border-[#4a0080]/30 text-[#4a0080] hover:bg-[#4a0080]/10"
          }`}
        >
          จัดการคำสั่งซื้อ
        </button>
      </div>

      {loading ? (
        <div className="brand-card rounded-2xl p-6 text-slate-600">กำลังโหลดข้อมูล...</div>
      ) : tab === "products" ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-4">
            {products.map((product) => (
              <article key={product._id} className="brand-card rounded-2xl p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#2a004d]">{product.name}</h3>
                    <p className="text-sm text-slate-600">{currency(product.price)}</p>
                    <p className="text-xs text-slate-500">{product.active ? "เปิดขาย" : "ปิดการขาย"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      className="rounded-xl border border-[#4a0080]/30 px-4 py-2 text-sm font-bold text-[#4a0080] transition hover:bg-[#4a0080] hover:text-white"
                    >
                      แก้ไข
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="brand-card h-fit rounded-2xl p-5">
            <h2 className="text-lg font-black text-[#2a004d]">
              {editingId ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">ชื่อสินค้า</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#4a0080] focus:brand-ring"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">ราคา</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={productForm.price}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#4a0080] focus:brand-ring"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">รูปสินค้า</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#4a0080] focus:brand-ring"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">รายละเอียด</label>
                <textarea
                  rows="3"
                  value={productForm.description}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#4a0080] focus:brand-ring"
                />
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={productForm.active}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, active: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-[#4a0080] focus:ring-[#4a0080]"
                />
                เปิดขายสินค้า
              </label>

              <div className="grid gap-2">
                <button
                  type="submit"
                  className="rounded-xl bg-[var(--brand-accent)] px-4 py-2 text-sm font-black text-white transition hover:brightness-95"
                >
                  {editingId ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
                </button>
                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    ยกเลิก
                  </button>
                ) : null}
              </div>
            </form>
          </aside>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order._id} className="brand-card rounded-2xl p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-500">Order ID</p>
                  <p className="text-base font-black text-[#2a004d]">{order._id}</p>
                  <p className="text-sm text-slate-600">{formatDate(order.createdAt)}</p>
                  <p className="text-sm text-slate-600">
                    ยอดรวม: <span className="font-bold">{currency(order.subtotal)}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    ผู้ใช้:{" "}
                    <span className="font-semibold">
                      {order.user?.name || order.user?.email || order.user || "ไม่ระบุ"}
                    </span>
                    {order.user?.email ? (
                      <span className="ml-2 text-xs text-slate-500">({order.user.email})</span>
                    ) : null}
                  </p>
                  <button
                    type="button"
                    onClick={() => toggleOrderDetails(order._id)}
                    className="mt-3 text-sm font-bold text-[#4a0080] hover:underline"
                  >
                    {expandedOrders[order._id] ? "ซ่อนรายละเอียด" : "ดูรายละเอียด"}
                  </button>
                </div>
                <div className="grid gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleOrderStatus(order._id, e.target.value, order.paymentStatus)
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <select
                      value={order.paymentStatus || "unpaid"}
                      onChange={(e) =>
                        handleOrderStatus(order._id, order.status, e.target.value)
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                      {["unpaid", "paid", "refunded"].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-xs text-slate-500">
                    จำนวนสินค้า: {order.items?.length || 0}
                  </p>
                </div>
              </div>
              {expandedOrders[order._id] ? (
                <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                  {order.items?.map((item) => (
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
                      <p className="text-lg font-black text-[var(--brand-accent)]">
                        {currency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                  {order.shippingAddress?.name ? (
                    <div className="rounded-xl border border-slate-100 bg-white/70 px-4 py-3 text-sm text-slate-600">
                      <p className="font-bold text-[#2a004d]">ที่อยู่จัดส่ง</p>
                      <p>{order.shippingAddress.name}</p>
                      <p>
                        {order.shippingAddress.line1}{" "}
                        {order.shippingAddress.line2 || ""}
                      </p>
                      <p>
                        {order.shippingAddress.city} {order.shippingAddress.state}{" "}
                        {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                      {order.shippingAddress.phone ? (
                        <p>โทร: {order.shippingAddress.phone}</p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}
