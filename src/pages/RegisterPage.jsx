import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import { toastError, toastSuccess, toastWarning } from "../utils/alerts.js";
import { setLoggedInUser } from "../utils/storage.js";
import { useAppContext } from "../utils/app-context.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { refreshAuth } = useAppContext();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.firstname || !form.email || !form.password || !form.confirmPassword) {
      await toastWarning("ข้อมูลไม่ครบ", "กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (form.password !== form.confirmPassword) {
      await toastError("รหัสผ่านไม่ตรงกัน", "กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    if (!form.terms) {
      await toastWarning("ยังไม่ยอมรับเงื่อนไข", "กรุณายอมรับข้อกำหนดก่อนสมัคร");
      return;
    }

    setLoggedInUser({
      firstname: form.firstname,
      lastname: form.lastname,
      email: form.email,
      isLoggedIn: true,
    });
    refreshAuth();

    await toastSuccess("สมัครสำเร็จ", "กำลังพาคุณกลับหน้าแรก", 1800);
    navigate("/");
  }

  return (
    <PageShell title="สมัครสมาชิก" subtitle="สร้างบัญชีเพื่อเริ่มใช้งาน Babablox">
      <div className="mx-auto w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="brand-card space-y-5 rounded-3xl p-6 md:p-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700" htmlFor="firstname">
                ชื่อ
              </label>
              <input
                id="firstname"
                type="text"
                value={form.firstname}
                onChange={(e) => update("firstname", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#4a0080] focus:brand-ring"
                placeholder="ชื่อจริง"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700" htmlFor="lastname">
                นามสกุล
              </label>
              <input
                id="lastname"
                type="text"
                value={form.lastname}
                onChange={(e) => update("lastname", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#4a0080] focus:brand-ring"
                placeholder="นามสกุล"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700" htmlFor="register-email">
              อีเมล
            </label>
            <input
              id="register-email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#4a0080] focus:brand-ring"
              placeholder="you@example.com"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700" htmlFor="register-password">
                รหัสผ่าน
              </label>
              <input
                id="register-password"
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#4a0080] focus:brand-ring"
                placeholder="อย่างน้อย 6 ตัวอักษร"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700" htmlFor="register-confirm">
                ยืนยันรหัสผ่าน
              </label>
              <input
                id="register-confirm"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#4a0080] focus:brand-ring"
                placeholder="พิมพ์ซ้ำอีกครั้ง"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={form.terms}
              onChange={(e) => update("terms", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#4a0080] focus:ring-[#4a0080]"
            />
            <span>
              ฉันยอมรับข้อกำหนดและเงื่อนไขของ Babablox
            </span>
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-[var(--brand-accent)] px-4 py-3 text-base font-black text-white transition hover:brightness-95"
          >
            สมัครสมาชิก
          </button>

          <p className="text-center text-sm text-slate-600">
            มีบัญชีอยู่แล้ว?{" "}
            <Link to="/login" className="font-black text-[#4a0080] hover:underline">
              ล็อกอิน
            </Link>
          </p>
        </form>
      </div>
    </PageShell>
  );
}
