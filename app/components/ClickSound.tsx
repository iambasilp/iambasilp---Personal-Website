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

    const playPopSound = (volume: number, pitchBase: number) => {
      if (!audioCtxRef.current) return;

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Random micro-variation so it never sounds exactly identical (Nir Eyal's Variable Reward)
      const pitchVariation = pitchBase + (Math.random() * 50 - 25);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitchVariation, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      // Volume envelope tailored to the specific interaction
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    };

    const handleClick = (e: MouseEvent) => {
      initAudio();
      
      const target = e.target as HTMLElement;
      
      const isHeaderLink = target.closest('header');
      const isInteractive = target.closest('a') || target.closest('button') || target.closest('input') || target.closest('[role="button"]') || target.closest('[role="link"]');
      
      if (isInteractive) {
        if (isHeaderLink) {
          playPopSound(1.0, 400);
        } else {
          playPopSound(0.25, 750);
        }
      }
    };

    // Use capture phase to catch clicks
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
