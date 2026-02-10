import { NavLink, useNavigate } from "react-router-dom";
import { useAdminContext } from "../utils/admin-context.jsx";
import AdminLoginPage from "../pages/AdminLoginPage.jsx";

const adminLinks = [
  { to: "/admin", label: "แดชบอร์ด", end: true },
  { to: "/admin/users", label: "ผู้ใช้" },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { adminUser, adminReady, adminLogout } = useAdminContext();

  if (!adminReady) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-16 text-slate-600">
          กำลังโหลด...
        </div>
      </div>
    );
  }

  if (!adminUser || adminUser.role !== "admin") {
    return <AdminLoginPage />;
  }

  async function handleLogout() {
    await adminLogout();
    navigate("/admin");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <span className="text-xl font-black text-[#2a004d]">Babablox Admin</span>
            <nav className="hidden items-center gap-3 md:flex">
              {adminLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      isActive ? "bg-[#4a0080] text-white" : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink
                to="/"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                ไปหน้าร้าน
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-semibold text-slate-600 md:inline">
              {adminUser.name || adminUser.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-[#4a0080]/30 px-4 py-2 text-sm font-bold text-[#4a0080] transition hover:bg-[#4a0080] hover:text-white"
            >
              ออกจากระบบแอดมิน
            </button>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-6xl flex-wrap gap-2 px-4 pb-4 md:hidden">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-[#4a0080] text-white" : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            ไปหน้าร้าน
          </NavLink>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
