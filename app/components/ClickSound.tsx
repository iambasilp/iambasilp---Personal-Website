'use client';

import { useEffect, useRef } from 'react';

export default function ClickSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext lazily to comply with browser policies
    const initAudio = () => {
      if (!audioCtxRef.current) {
        // @ts-ignore - webkitAudioContext is for Safari
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
    };

    const playPopSound = () => {
      if (!audioCtxRef.current) return;

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      // A quick, loud "pop" or "click"
      // Start at a higher frequency (600Hz) for a sharper click, then drop rapidly
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      // Maximum volume envelope for the pop
      gainNode.gain.setValueAtTime(1.0, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    };

    const handleClick = (e: MouseEvent) => {
      initAudio();
      
      const target = e.target as HTMLElement;
      
      // Determine if we clicked an interactive element or a child of one
      const isInteractive = target.closest('a') || target.closest('button') || target.closest('input') || target.closest('[role="button"]') || target.closest('[role="link"]');
      
      if (isInteractive) {
        playPopSound();
      }
    };

    // Use capture phase to catch clicks even if propagation is stopped by other components
    window.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('click', handleClick, true);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return null;
}
