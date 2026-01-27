import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../utils/app-context.jsx";
import { toastSuccess } from "../utils/alerts.js";
import { clearAuth } from "../utils/storage.js";

const navItems = [
  { to: "/", label: "หน้าแรก", end: true },
  { to: "/products", label: "ผลิตภัณฑ์" },
  { to: "/cart", label: "ตะกร้า" },
  { to: "/orders", label: "ประวัติการสั่งซื้อ" },
];

export default function Navbar() {
  const { user, cartCount, refreshAuth } = useAppContext();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 768) {
        setOpen(false);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  async function handleLogout(event) {
    event.preventDefault();
    clearAuth();
    refreshAuth();
    await toastSuccess("ออกจากระบบแล้ว", "แล้วพบกันใหม่");
    navigate("/");
  }

  const greeting = user?.firstname || user?.email?.split("@")[0] || "เพื่อน";

  return (
    <header className="sticky top-0 z-50 brand-gradient text-white shadow-[0_12px_40px_rgba(26,0,51,0.35)]">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link to="/" className="text-2xl font-black tracking-tight">
          Babablox
        </Link>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 md:hidden"
        >
          <span
            className={`absolute h-0.5 w-6 bg-white transition-transform duration-200 ${
              open ? "translate-y-0 rotate-45" : "-translate-y-2"
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-white transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-white transition-transform duration-200 ${
              open ? "translate-y-0 -rotate-45" : "translate-y-2"
            }`}
          />
        </button>

        <div
          className={`absolute left-4 right-4 top-[calc(100%+0.6rem)] rounded-2xl border border-white/15 bg-[#1b0036]/95 p-4 shadow-2xl backdrop-blur md:static md:flex md:w-auto md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none ${
            open ? "block" : "hidden md:flex"
          }`}
        >
          <ul className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-white/10 ${
                      isActive ? "bg-white/15" : ""
                    }`
                  }
                >
                  {item.label}
                  {item.to === "/cart" && cartCount > 0 ? (
                    <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-[var(--brand-accent)] px-1.5 py-0.5 text-xs font-bold text-white">
                      {cartCount}
                    </span>
                  ) : null}
                </NavLink>
              </li>
            ))}
            <li>
              <a
                href="https://line.me/ti/p/mrgy7EasBd"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-white/10"
              >
                ติดต่อ
              </a>
            </li>
          </ul>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/15 pt-4 md:mt-0 md:border-0 md:pt-0">
            {user ? (
              <>
                <span className="rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold">
                  สวัสดี, {greeting}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-white/35 px-4 py-2 text-sm font-bold transition hover:bg-white hover:text-[#4a0080]"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `rounded-lg border px-4 py-2 text-sm font-bold transition ${
                      isActive
                        ? "border-white/70 bg-white/15 text-white"
                        : "border-white/60 bg-white/10 text-white hover:border-white/80 hover:bg-white/20"
                    }`
                  }
                >
                  ล็อกอิน
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `rounded-lg px-4 py-2 text-sm font-bold transition ${
                      isActive
                        ? "bg-[var(--brand-accent)] text-white"
                        : "bg-[var(--brand-accent)]/90 text-white hover:bg-[var(--brand-accent)]"
                    }`
                  }
                >
                  สมัครสมาชิก
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
