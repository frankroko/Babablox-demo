import { useEffect, useMemo, useState } from "react";
import PageShell from "../components/PageShell.jsx";
import { adminApiFetch } from "../utils/admin-api.js";
import { confirmAction, toastError, toastSuccess } from "../utils/alerts.js";
import { useAdminContext } from "../utils/admin-context.jsx";

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

export default function AdminUsersPage() {
  const { adminUser } = useAdminContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const data = await adminApiFetch("/api/admin/users");
      setUsers(data.items || []);
    } catch (err) {
      setError(err.message || "โหลดข้อมูลผู้ใช้ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const value = search.trim().toLowerCase();
    return users.filter((item) =>
      [item.name, item.email, item.role].filter(Boolean).some((field) => field.toLowerCase().includes(value))
    );
  }, [search, users]);

  function toggleDetails(id) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function handleRoleChange(targetId, role) {
    try {
      const updated = await adminApiFetch(`/api/admin/users/${targetId}`, {
        method: "PATCH",
        body: { role },
      });
      const normalized = { ...updated, _id: updated.id || updated._id || targetId };
      setUsers((prev) =>
        prev.map((item) => (item._id === targetId ? { ...item, ...normalized } : item))
      );
      await toastSuccess("อัปเดตผู้ใช้แล้ว", `บทบาทเป็น ${role}`);
    } catch (err) {
      await toastError("อัปเดตผู้ใช้ไม่สำเร็จ", err.message || "กรุณาลองใหม่");
    }
  }

  async function handleDelete(target) {
    const result = await confirmAction({
      title: "ลบผู้ใช้?",
      text: `ต้องการลบ ${target.name || target.email} หรือไม่`,
      confirmText: "ลบผู้ใช้",
    });
    if (!result.isConfirmed) return;

    try {
      await adminApiFetch(`/api/admin/users/${target._id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((item) => item._id !== target._id));
      await toastSuccess("ลบผู้ใช้แล้ว", target.email);
    } catch (err) {
      await toastError("ลบผู้ใช้ไม่สำเร็จ", err.message || "กรุณาลองใหม่");
    }
  }

  const currentUserId = adminUser?._id || adminUser?.id;

  return (
    <PageShell title="จัดการผู้ใช้" subtitle="ตรวจสอบและปรับสิทธิ์ผู้ใช้">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="brand-card rounded-2xl px-4 py-3 text-sm text-slate-600">
          ผู้ใช้ทั้งหมด {users.length} คน
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาชื่อ / อีเมล / บทบาท"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#4a0080] focus:brand-ring md:max-w-sm"
        />
      </div>

      {loading ? (
        <div className="brand-card rounded-2xl p-6 text-slate-600">กำลังโหลดผู้ใช้...</div>
      ) : error ? (
        <div className="brand-card rounded-2xl p-6 text-red-600">{error}</div>
      ) : filteredUsers.length === 0 ? (
        <div className="brand-card rounded-2xl p-6 text-slate-600">ไม่พบผู้ใช้ที่ค้นหา</div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((item) => {
            const isSelf = currentUserId === item._id;
            return (
              <article key={item._id} className="brand-card rounded-2xl p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-extrabold text-[#2a004d]">{item.name || "ไม่ระบุชื่อ"}</p>
                    <p className="text-sm text-slate-600">{item.email}</p>
                    <p className="text-xs font-semibold text-slate-500">บทบาท: {item.role}</p>
                    <button
                      type="button"
                      onClick={() => toggleDetails(item._id)}
                      className="mt-2 text-sm font-bold text-[#4a0080] hover:underline"
                    >
                      {expanded[item._id] ? "ซ่อนรายละเอียด" : "ดูรายละเอียด"}
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={item.role}
                      onChange={(e) => handleRoleChange(item._id, e.target.value)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                      disabled={isSelf}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={isSelf}
                      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      ลบผู้ใช้
                    </button>
                  </div>
                </div>

                {expanded[item._id] ? (
                  <div className="mt-4 rounded-xl border border-slate-100 bg-white/70 px-4 py-3 text-sm text-slate-600">
                    <p>
                      <span className="font-semibold text-slate-700">User ID:</span> {item._id}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-700">สร้างเมื่อ:</span>{" "}
                      {item.createdAt ? formatDate(item.createdAt) : "-"}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-700">อัปเดตล่าสุด:</span>{" "}
                      {item.updatedAt ? formatDate(item.updatedAt) : "-"}
                    </p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
