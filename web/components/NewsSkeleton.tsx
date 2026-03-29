export default function NewsSkeleton() {
  const skeletonCards = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div
      role="status"
      aria-label="ニュース読み込み中"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {skeletonCards.map((i) => (
        <div
          key={i}
          className="rounded-2xl p-4 sm:p-5 news-card"
        >
          <div className="flex items-start gap-3">
            {/* Emoji placeholder */}
            <div
              className="w-8 h-8 rounded-lg animate-pulse-skeleton flex-shrink-0"
              style={{ backgroundColor: "var(--color-skeleton)" }}
            />
            <div className="min-w-0 flex-1">
              {/* Title lines */}
              <div
                className="h-4 rounded animate-pulse-skeleton mb-2 w-full"
                style={{ backgroundColor: "var(--color-skeleton)" }}
              />
              <div
                className="h-4 rounded animate-pulse-skeleton mb-2 w-4/5"
                style={{ backgroundColor: "var(--color-skeleton)" }}
              />
              <div
                className="h-4 rounded animate-pulse-skeleton w-3/5"
                style={{ backgroundColor: "var(--color-skeleton)" }}
              />

              {/* Reason tag placeholder */}
              <div
                className="h-5 rounded-full animate-pulse-skeleton mt-3 w-24"
                style={{ backgroundColor: "var(--color-skeleton)" }}
              />

              {/* Meta line */}
              <div className="flex items-center gap-3 mt-3">
                <div
                  className="h-3 rounded animate-pulse-skeleton w-16"
                  style={{ backgroundColor: "var(--color-skeleton)" }}
                />
                <div
                  className="h-3 rounded animate-pulse-skeleton w-20"
                  style={{ backgroundColor: "var(--color-skeleton)" }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">読み込み中...</span>
    </div>
  );
}
