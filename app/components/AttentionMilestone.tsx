'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function AttentionMilestone() {
  const pathname = usePathname();
  const [showMilestone, setShowMilestone] = useState(false);

  useEffect(() => {
    // Only run on article pages
    if (!pathname || !pathname.startsWith('/n/')) return;

    const handleScroll = () => {
      // Calculate scroll depth
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      
      // Prevent division by zero on very short pages
      if (docHeight <= winHeight) return;
      
      const scrollPercent = scrollY / (docHeight - winHeight);

      // If they scrolled past 50% of the article
      if (scrollPercent > 0.5) {
        // Read current history from localStorage
        const readArticlesStr = localStorage.getItem('read_articles') || '[]';
        let readArticles: string[] = [];
        try {
          readArticles = JSON.parse(readArticlesStr);
        } catch (e) {
          readArticles = [];
        }

        // If this article hasn't been read yet
        if (!readArticles.includes(pathname)) {
          const newReadArticles = [...readArticles, pathname];
          localStorage.setItem('read_articles', JSON.stringify(newReadArticles));

          // If they just hit exactly 3 articles read
          if (newReadArticles.length === 3) {
            setShowMilestone(true);
            
            // Auto-hide after 8 seconds
            setTimeout(() => {
              setShowMilestone(false);
            }, 8000);
          }
        }
        
        // Remove scroll listener for this page once recorded
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check in case they are already scrolled past 50% on reload
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return (
    <AnimatePresence>
      {showMilestone && (
        <motion.div
          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none"
        >
          <div className="bg-white/80 dark:bg-[#1A1A19]/80 backdrop-blur-2xl border border-[#E8E6E0] dark:border-zinc-800 shadow-2xl rounded-2xl p-8 max-w-md text-center pointer-events-auto">
            <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-gray-500 dark:text-zinc-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M12 8v4l3 3"></path></svg>
            <p className="text-lg font-serif text-[#2C2C2A] dark:text-[#E4E3DF] leading-relaxed italic">
              "You've read 3 essays. In a distracted world, your deep attention is the rarest gift. Thank you."
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
