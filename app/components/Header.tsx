'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center mb-6 md:mb-10 pb-4 border-b border-[#E8E6E0] dark:border-zinc-800">
      <div>
        <Link href="/" className="font-semibold text-base md:text-lg hover:text-gray-600 dark:hover:text-zinc-400 transition-colors tracking-tight block">
          Basil Pulikuth
        </Link>
      </div>
      <nav className="flex space-x-4 md:space-x-6 text-sm font-medium text-gray-600 dark:text-zinc-400">
        <Link href="/" className="hover:text-gray-900 dark:hover:text-zinc-100 transition-colors">
          Home
        </Link>
        <Link href="/writing" className="hover:text-gray-900 dark:hover:text-zinc-100 transition-colors">
          Writing
        </Link>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="hover:text-gray-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1 focus:outline-none"
          >
            Connect
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className={`h-4 w-4 opacity-70 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path></svg>
          </button>
          
          <div 
            className={`absolute right-0 top-full mt-3 w-36 bg-white dark:bg-[#20201F] border border-[#E8E6E0] dark:border-zinc-800 shadow-xl rounded-xl p-1.5 flex flex-col z-50 transition-all duration-200 transform origin-top-right ${isOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'}`}
          >
            <a 
              href="mailto:iambasilp@gmail.com" 
              onClick={() => setIsOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-[#2C2C2A] dark:text-[#E4E3DF] hover:bg-[#F7F5F0] dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-3"
            >
              <svg className="w-4 h-4 text-[#EA4335]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
              Gmail
            </a>
            <a 
              href="https://wa.me/918848344415?text=Hey%20Basil!%20I%20was%20just%20reading%20your%20site%20and%20wanted%20to%20say%20hello.%20%E2%9C%A8" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => setIsOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-[#2C2C2A] dark:text-[#E4E3DF] hover:bg-[#F7F5F0] dark:hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-3"
            >
              <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
