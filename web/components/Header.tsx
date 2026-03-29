import Link from "next/link";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{
        backgroundColor: "var(--color-header-bg)",
        borderColor: "var(--color-header-border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-[1100px] mx-auto px-4 h-12 flex items-center justify-between pr-14">
        <Link href="/" className="flex items-baseline gap-3">
          <span
            className="text-base font-bold tracking-tight"
            style={{ color: "var(--color-amber-800)" }}
          >
            Good News Only
          </span>
          <span
            className="hidden sm:inline text-[11px] tracking-widest"
            style={{ color: "var(--color-text-faint)", letterSpacing: "0.12em" }}
          >
            世界の良いほうだけをみよう
          </span>
        </Link>
      </div>
    </header>
  );
}
