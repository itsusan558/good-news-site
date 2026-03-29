import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-not-found-bg)" }}
    >
      <p className="text-5xl mb-8">🌤</p>
      <h1
        className="text-2xl font-medium mb-3"
        style={{ color: "var(--color-amber-800)" }}
      >
        ページが見つかりませんでした
      </h1>
      <p
        className="text-sm mb-10 font-light"
        style={{ color: "var(--color-text-faint)" }}
      >
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link
        href="/"
        className="px-7 py-3 text-sm font-medium rounded-full transition-colors"
        style={{
          backgroundColor: "var(--color-btn-primary-bg)",
          color: "var(--color-btn-primary-text)",
        }}
      >
        トップへ戻る
      </Link>
    </div>
  );
}
