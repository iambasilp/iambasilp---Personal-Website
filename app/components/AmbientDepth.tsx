'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AmbientDepth() {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);
  
  // We cap the maximum darkness so it doesn't get completely black/brown, just deeply ambient
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 0.85]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none -z-10 bg-[#EAE6DC] dark:bg-[#050505]"
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}
