"use client";

import { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 300);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!visible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="ページの先頭に戻る"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full
        shadow-lg hover:shadow-xl
        flex items-center justify-center
        text-xl font-bold
        transition-shadow
        animate-fade-in
        cursor-pointer"
      style={{
        backgroundColor: "var(--color-btn-primary-bg)",
        color: "var(--color-btn-primary-text)",
      }}
    >
      ↑
    </button>
  );
}
