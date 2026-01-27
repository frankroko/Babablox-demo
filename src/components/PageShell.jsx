export default function PageShell({ title, subtitle, children }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
      {title ? (
        <header className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-[#2a004d] md:text-4xl">
            {title}
          </h1>
          {subtitle ? <p className="mt-2 text-base text-slate-600">{subtitle}</p> : null}
        </header>
      ) : null}
      {children}
    </main>
  );
}
