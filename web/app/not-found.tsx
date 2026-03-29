import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-not-found-bg)" }}
    >
      <p className="text-6xl mb-6">🌤</p>
      <h1
        className="text-3xl font-bold mb-3"
        style={{ color: "var(--color-amber-800)" }}
      >
        404
      </h1>
      <p
        className="text-lg mb-2"
        style={{ color: "var(--color-amber-700)" }}
      >
        ページが見つかりませんでした
      </p>
      <p
        className="text-sm mb-8"
        style={{ color: "var(--color-text-faint)" }}
      >
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link
        href="/"
        className="px-6 py-3 font-medium rounded-full transition-colors"
        style={{
          backgroundColor: "var(--color-btn-primary-bg)",
          color: "var(--color-btn-primary-text)",
        }}
      >
        トップページへ戻る
      </Link>
    </div>
  );
}
