import Link from "next/link";

export default function Header() {
  return (
    <header
      className="border-b"
      style={{
        background: "linear-gradient(135deg, var(--color-header-from), var(--color-header-to))",
        borderColor: "var(--color-header-border)",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-10 pr-14">
        <Link href="/" className="block">
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: "var(--color-amber-800)" }}
          >
            Good News Only
          </h1>
          <p
            className="text-sm sm:text-base mt-2 font-light tracking-wide leading-relaxed"
            style={{ color: "var(--color-text-catchphrase)" }}
          >
            世界の良いほうだけをみよう
          </p>
        </Link>
      </div>
    </header>
  );
}
