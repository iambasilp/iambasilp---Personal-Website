'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export default function ReadingEnhancers() {
  const { scrollYProgress, scrollY } = useScroll();
  const [readingTime, setReadingTime] = useState(0);
  const [fontScale, setFontScale] = useState(1);
  const [isArticle, setIsArticle] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingPercent, setReadingPercent] = useState(0);
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    // Check if we are on an article page (starts with /n/)
    if (window.location.pathname.startsWith('/n/')) {
      setIsArticle(true);
      
      // Calculate reading time
      const calculateReadingTime = () => {
        // Grab the main content text
        const text = document.querySelector('main')?.innerText || '';
        const wpm = 200;
        const words = text.trim().split(/\s+/).length;
        const time = Math.ceil(words / wpm);
        setReadingTime(time);
      };
      
      // Slight delay to ensure MDX content is fully loaded
      setTimeout(calculateReadingTime, 300);
    }
  }, []);

  // Handle font scaling dynamically via CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale.toString());
  }, [fontScale]);

  // Handle Focus Mode
  useEffect(() => {
    if (focusMode) {
      document.body.classList.add('focus-mode');
    } else {
      document.body.classList.remove('focus-mode');
    }
    // Cleanup on unmount
    return () => document.body.classList.remove('focus-mode');
  }, [focusMode]);

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

  return (
    <>
      {/* Reading Progress Bar (Fixed Top) with Gradient */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 origin-left z-50 shadow-sm"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Enhancements only visible on articles */}
      {isArticle && (
        <>
          {/* Estimated Reading Time Display (Static Top) */}
          {readingTime > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-zinc-400 mb-2 transition-opacity duration-300 focus-mode-hidden"
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="h-4 w-4 text-gray-500 dark:text-zinc-500" xmlns="http://www.w3.org/2000/svg"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path></svg>
              {readingTime} min read
            </motion.div>
          )}

          {/* Floating Typography & Scroll Tools (Bottom Right) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="fixed bottom-6 right-6 flex flex-col gap-1 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-1.5 rounded-full border border-gray-200 dark:border-zinc-800 shadow-lg"
          >
            {/* Scroll to Top Button */}
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onClick={scrollToTop}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 transition-colors relative"
                aria-label="Scroll to top"
              >
                <span className="text-[9px] font-bold absolute -top-3 text-gray-600 dark:text-zinc-500">{readingPercent}%</span>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path></svg>
              </motion.button>
            )}

            {/* Focus Mode Toggle */}
            <button
              onClick={() => setFocusMode(!focusMode)}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${focusMode ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
              aria-label="Toggle focus mode"
            >
              {focusMode ? (
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5 1.08 0 2.12-.13 3.11-.38l-2.07-2.07c-.34.03-.68.05-1.04.05-3.5 0-6.61-1.95-8.23-5.06A9.97 9.97 0 0110 5.67l2-2.01V4.5zM12 17c-2.76 0-5-2.24-5-5 0-.46.06-.9.18-1.32l8.5 8.5c-.42.12-.86.18-1.32.18zm8.67-1.42l-2.14-2.14c.26-.6.47-1.23.64-1.89C17.55 13.91 14.88 15 12 15c-1.34 0-2.58-.33-3.67-.91l-1.88-1.88C7.15 11.23 7.82 10 9 10c2.76 0 5 2.24 5 5 0 1.25-.33 2.41-.9 3.47l2.85 2.85C19.34 19.35 21 17.61 21.67 15.58zM12 7c2.76 0 5 2.24 5 5 0 1.25-.33 2.41-.9 3.47l1.71 1.71C19.78 15.26 21.36 13.79 23 12c-1.73-4.39-6-7.5-11-7.5-.47 0-.93.04-1.38.1l2.05 2.05C11.83 7.03 11.91 7 12 7zM2.27 2.27L1 3.54l3.33 3.33C2.81 8.52 1.63 10.15 1 12c1.73 4.39 6 7.5 11 7.5.35 0 .69-.02 1.03-.06l5.43 5.43 1.27-1.27L2.27 2.27z"></path></svg>
              ) : (
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>
              )}
            </button>
            <div className="h-px bg-gray-200 dark:bg-zinc-800 w-full my-0.5" />

            <button
              onClick={() => setFontScale(prev => Math.min(prev + 0.1, 1.4))}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 transition-colors font-serif font-bold text-sm"
              aria-label="Increase text size"
            >
              A+
            </button>
            <div className="h-px bg-gray-200 dark:bg-zinc-800 w-full my-0.5" />
            <button
              onClick={() => setFontScale(prev => Math.max(prev - 0.1, 0.8))}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300 transition-colors font-serif font-medium text-xs"
              aria-label="Decrease text size"
            >
              A-
            </button>
          </motion.div>
        </>
      )}
    </>
  );
}
