import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import { toastSuccess, toastWarning } from "../utils/alerts.js";
import { setLoggedInUser } from "../utils/storage.js";
import { useAppContext } from "../utils/app-context.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { refreshAuth } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const remembered = localStorage.getItem("rememberedEmail");
    if (remembered) {
      setEmail(remembered);
      setRemember(true);
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email || !password) {
      await toastWarning("ข้อมูลไม่ครบ", "กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    if (remember) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    setLoggedInUser({ email, isLoggedIn: true, rememberMe: remember });
    refreshAuth();

    await toastSuccess("เข้าสู่ระบบสำเร็จ", "ยินดีต้อนรับกลับ");
    navigate("/");
  }

  return (
    <PageShell title="ล็อกอิน" subtitle="เข้าสู่ระบบเพื่อเริ่มซื้อขาย">
      <div className="mx-auto w-full max-w-xl">
        <form onSubmit={handleSubmit} className="brand-card space-y-5 rounded-3xl p-6 md:p-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700" htmlFor="email">
              อีเมล
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none transition focus:border-[#4a0080] focus:brand-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700" htmlFor="password">
              รหัสผ่าน
            </label>
            <input
              id="password"
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
            จดจำอีเมลนี้
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#4a0080] px-4 py-3 text-base font-black text-white transition hover:bg-[#2d004d]"
          >
            เข้าสู่ระบบ
          </button>

          <p className="text-center text-sm text-slate-600">
            ยังไม่มีบัญชี?{" "}
            <Link to="/register" className="font-black text-[#4a0080] hover:underline">
              สมัครสมาชิก
            </Link>
          </p>
        </form>
      </div>
    </PageShell>
  );
}
