import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = ['Home', 'Explore', 'Contact'];

const Header = () => {
  const [position, setPosition] = useState({ left: 0, width: 0, opacity: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full flex justify-center items-center mt-6 px-4">
      <nav className="w-full max-w-6xl flex items-center justify-between bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 rounded-2xl px-6 py-4 shadow-md border border-zinc-700 backdrop-blur-sm relative">
        
        {/* Logo / Title */}
        <div className="text-white font-bold text-xl md:text-2xl tracking-tight whitespace-nowrap select-none">
          🌍 Travel Itinerary Board
        </div>

        {/* Desktop Navigation */}
        <ul
          className="relative hidden md:flex gap-6"
          onMouseLeave={() =>
            setPosition((pv) => ({ ...pv, opacity: 0 }))
          }
        >
          {NAV_LINKS.map((link, idx) => (
            <NavTab key={idx} setPosition={setPosition}>
              {link}
            </NavTab>
          ))}
          <Cursor position={position} />
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-white hover:text-indigo-400 focus:outline-none"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  mobileMenuOpen
                    ? 'M6 18L18 6M6 6l12 12' // X icon
                    : 'M4 6h16M4 12h16M4 18h16' // Hamburger icon
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-6 mt-2 w-40 bg-zinc-800 rounded-lg shadow-lg border border-zinc-600 md:hidden z-50"
            >
              {NAV_LINKS.map((link, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 text-white hover:bg-zinc-700 cursor-pointer transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

// Desktop nav tab
const NavTab = ({ children, setPosition }) => {
  const ref = useRef(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 cursor-pointer px-3 py-1 text-sm text-white font-medium transition duration-200"
    >
      {children}
    </li>
  );
};

// Hover cursor for desktop
const Cursor = ({ position }) => (
  <motion.li
    animate={{ ...position }}
    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    className="absolute z-0 h-9 bg-white/20 rounded-full"
  />
);

export default Header;
