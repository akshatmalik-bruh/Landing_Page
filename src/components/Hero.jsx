import React, { useEffect, useRef, useState } from 'react';

export default function Hero() {
  const handleClick = () => {
    // Redirect to the "What is BOS" section (or page)
    const target = document.getElementById('what-is-bos');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '#what-is-bos';
    }
  };

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden px-4">
      {/* Neon Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-lime-500/10 blur-[110px] rounded-full pointer-events-none"></div>

      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.3] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.3] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Main Heading Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4 pointer-events-none">
        <div className="flex flex-col items-center space-y-12 max-w-4xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tightest leading-[1.1]">
          <span className="text-white">
            Your business isn’t broken.
          </span>
          <br />
          <span className="text-white/40 block mt-2">
            Your tools are.
          </span>
        </h1>

        {/* Bouncing Arrow */}
        <div className="animate-bounce pt-8">
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="opacity-50"
          >
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </div>
        </div>
      </div>
    </section>
  );
}
