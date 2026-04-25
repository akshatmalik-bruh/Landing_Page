import { useState, useEffect } from 'react';
import { List, X } from '@phosphor-icons/react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] mx-auto px-6 md:px-8 py-3 md:py-4 flex items-center justify-between rounded-full z-[100] transition-all duration-500 ${
        scrolled 
          ? 'bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl' 
          : 'bg-transparent border-transparent shadow-none'
      } border`}>
        {/* Logo Left */}
        <div className="text-white font-black text-xl md:text-2xl tracking-[0.2em] cursor-pointer hover:drop-shadow-[0_0_10px_rgba(108,99,255,0.8)] transition-all">
          BOS
        </div>

        {/* Desktop Links (Hidden on mobile) */}
        <div className="hidden md:flex items-center space-x-10 text-white/70 font-semibold text-sm tracking-widest uppercase">
          <a
            href="#how-it-works"
            className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-300"
          >
            How it works
          </a>
          <a
            href="#why-bos"
            className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-300"
          >
            Why BOS
          </a>
          <a
            href="#get-access"
            className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-300"
          >
            Get Access
          </a>
        </div>

        {/* Hamburger Icon (Visible on mobile) */}
        <button 
          className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[90] md:hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop blur/overlay */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-2xl"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Menu Content */}
        <div 
          className={`absolute top-0 right-0 w-full h-[60vh] bg-gradient-to-b from-[#0d0d15] to-black/90 border-b border-white/10 p-12 pt-32 flex flex-col items-center space-y-8 transition-transform duration-500 ease-out ${
            isOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <a
            href="#how-it-works"
            className="text-2xl font-bold text-white/80 hover:text-white tracking-widest uppercase transition-colors"
            onClick={() => setIsOpen(false)}
          >
            How it works
          </a>
          <a
            href="#why-bos"
            className="text-2xl font-bold text-white/80 hover:text-white tracking-widest uppercase transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Why BOS
          </a>
          <a
            href="#get-access"
            className="text-2xl font-bold text-white/80 hover:text-white tracking-widest uppercase transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Get Access
          </a>
          
        </div>
      </div>
    </>
  )
}

export default Navbar;
