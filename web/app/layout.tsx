import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

// Inline script to apply stored theme before paint (prevents flash)
const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('theme-preference');
    if (t === 'dark' || t === 'light') {
      document.documentElement.setAttribute('data-theme', t);
    }
  } catch(e) {}
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://itsusan558.github.io/good-news-site"),
  title: "Good News Only - いいニュースだけ",
  description: "世界の良いほうだけをみよう。AIが選んだポジティブなニュースで一日をスタート。",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Good News Only - いいニュースだけ",
    description: "世界の良いほうだけをみよう",
    type: "website",
    locale: "ja_JP",
    siteName: "Good News Only",
  },
  twitter: {
    card: "summary_large_image",
    title: "Good News Only - いいニュースだけ",
    description: "世界の良いほうだけをみよう。AIが選んだポジティブなニュースで一日をスタート。",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="theme-color" content="#fdfcf8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Good News Only",
              url: "https://itsusan558.github.io/good-news-site",
              description: "世界の良いほうだけをみよう",
              inLanguage: "ja",
            }),
          }}
        />
      </head>
      <body
        className="min-h-screen"
        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:rounded focus:z-50"
          style={{ backgroundColor: "var(--color-skip-bg)" }}
        >
          メインコンテンツへスキップ
        </a>
        <div className="fixed top-3 right-3 z-50">
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
