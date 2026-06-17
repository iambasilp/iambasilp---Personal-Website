'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export default function ReadingEnhancers() {
  const { scrollYProgress, scrollY } = useScroll();
  const [isArticle, setIsArticle] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingPercent, setReadingPercent] = useState(0);

  useEffect(() => {
    // Check if we are on an article page (starts with /n/)
    if (window.location.pathname.startsWith('/n/')) {
      setIsArticle(true);
    }
  }, []);

  // Track scroll position to show/hide 'Scroll to Top' button and update reading percentage
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 400) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setReadingPercent(Math.round(latest * 100));
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isArticle || !showScrollTop) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-gray-200 dark:border-zinc-800 shadow-lg hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 transition-colors"
      aria-label="Scroll to top"
    >
      <span className="text-[10px] font-bold absolute -top-3 text-gray-500 dark:text-zinc-500">{readingPercent}%</span>
      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path></svg>
    </motion.button>
  );
}
