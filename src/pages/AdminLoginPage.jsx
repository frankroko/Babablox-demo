import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import { toastError, toastSuccess, toastWarning } from "../utils/alerts.js";
import { adminApiFetch } from "../utils/admin-api.js";
import { clearAdminAuth, setAdminToken, setAdminUser } from "../utils/admin-storage.js";
import { useAdminContext } from "../utils/admin-context.jsx";

const ADMIN_EMAIL_KEY = "adminRememberedEmail";

function getAdminRememberedEmail() {
  return localStorage.getItem(ADMIN_EMAIL_KEY);
}

function setAdminRememberedEmail(email) {
  if (email) {
    localStorage.setItem(ADMIN_EMAIL_KEY, email);
  }
}

function clearAdminRememberedEmail() {
  localStorage.removeItem(ADMIN_EMAIL_KEY);
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { adminUser, setAdminUser: setAdminUserState, refreshAdminAuth } = useAdminContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const remembered = getAdminRememberedEmail();
    if (remembered) {
      setEmail(remembered);
      setRemember(true);
    }
  }, []);

  useEffect(() => {
    if (adminUser?.role === "admin") {
      navigate("/admin");
    }
  }, [adminUser, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email || !password) {
      await toastWarning("ข้อมูลไม่ครบ", "กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    setLoading(true);
    try {
      const data = await adminApiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      if (data.user?.role !== "admin") {
        clearAdminAuth();
        setAdminUserState(null);
        await toastError("เข้าสู่ระบบไม่สำเร็จ", "บัญชีนี้ไม่มีสิทธิ์แอดมิน");
        return;
      }

      if (remember) {
        setAdminRememberedEmail(email);
      } else {
        clearAdminRememberedEmail();
      }

      setAdminToken(data.token);
      setAdminUser(data.user);
      setAdminUserState(data.user);
      await refreshAdminAuth();

      await toastSuccess("เข้าสู่ระบบแอดมินสำเร็จ", "ยินดีต้อนรับ");
      navigate("/admin");
    } catch (error) {
      await toastError("เข้าสู่ระบบไม่สำเร็จ", error.message || "กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    clearAdminAuth();
    setAdminUserState(null);
    await toastSuccess("ออกจากระบบแล้ว", "สามารถเข้าสู่ระบบแอดมินใหม่ได้");
  }

  const showSwitchNotice = adminUser && adminUser.role !== "admin";

  return (
    <PageShell title="แอดมินล็อกอิน" subtitle="เข้าสู่ระบบเพื่อจัดการหลังบ้าน">
      <div className="mx-auto w-full max-w-xl">
        {showSwitchNotice ? (
          <div className="brand-card mb-4 flex flex-col gap-2 rounded-2xl p-4 text-sm text-slate-600">
            <p>
              ตอนนี้คุณเข้าสู่ระบบด้วยบัญชีผู้ใช้ทั่วไป ({adminUser.email}). หากต้องการเข้าใช้งานแอดมินให้
              ออกจากระบบก่อน
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="w-fit rounded-xl border border-[#4a0080]/30 px-4 py-2 text-sm font-bold text-[#4a0080] transition hover:bg-[#4a0080] hover:text-white"
            >
              ออกจากระบบ
            </button>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="brand-card space-y-5 rounded-3xl p-6 md:p-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700" htmlFor="admin-email">
              อีเมลแอดมิน
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-[#4a0080] focus:brand-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700" htmlFor="admin-password">
              รหัสผ่าน
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-[#4a0080] focus:brand-ring"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#4a0080] focus:ring-[#4a0080]"
            />
            จดจำอีเมลแอดมิน
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#4a0080] px-4 py-3 text-base font-black text-white transition hover:bg-[#2d004d] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบแอดมิน"}
          </button>

          <p className="text-center text-sm text-slate-600">
            เข้าสู่ระบบผู้ใช้ทั่วไป?{" "}
            <Link to="/login" className="font-black text-[#4a0080] hover:underline">
              ไปที่ล็อกอินผู้ใช้
            </Link>
          </p>
        </form>
      </div>
    </PageShell>
  );
}
