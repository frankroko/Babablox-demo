import { Link } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";

export default function NotFoundPage() {
  return (
    <PageShell title="ไม่พบหน้าที่ต้องการ" subtitle="ขออภัย เราหาหน้านั้นไม่เจอ">
      <Link
        to="/"
        className="inline-flex rounded-xl bg-[#4a0080] px-4 py-2 text-sm font-black text-white transition hover:bg-[#2d004d]"
      >
        กลับหน้าแรก
      </Link>
    </PageShell>
  );
}
