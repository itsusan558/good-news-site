import Link from "next/link";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        backgroundColor: "var(--color-header-bg)",
        borderColor: "var(--color-header-border)",
        transition: "background-color 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between pr-14">
        <Link href="/" className="block">
          <h1
            className="text-xl sm:text-2xl tracking-tight"
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontWeight: 500,
              color: "var(--color-amber-800)",
            }}
          >
            Good News Only
          </h1>
        </Link>
        <p
          className="hidden sm:block text-xs tracking-widest uppercase"
          style={{
            color: "var(--color-text-faint)",
            letterSpacing: "0.15em",
          }}
        >
          世界の良いほうだけをみよう
        </p>
      </div>
    </header>
  );
}
