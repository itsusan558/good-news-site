import Link from "next/link";

export default function Header() {
  return (
    <header
      className="border-b"
      style={{
        background: "linear-gradient(to right, var(--color-header-from), var(--color-header-to))",
        borderColor: "var(--color-header-border)",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-6 pr-14">
        <Link href="/" className="block">
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: "var(--color-amber-800)" }}
          >
            Good News Only
          </h1>
          <p
            className="text-xs sm:text-sm mt-1"
            style={{ color: "var(--color-amber-600)" }}
          >
            いいニュースだけ集めました
          </p>
        </Link>
      </div>
    </header>
  );
}
