import React from 'react';
import { FiGithub } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="relative w-full h-14 mt-10 overflow-hidden bg-black border-t border-gray-900 shadow-inner">
            <div className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 blur-2xl opacity-30 w-[300px] h-[60px] bg-gradient-to-r from-blue-700 via-indigo-900 to-blue-900 rounded-full" />
            <div className="absolute z-20 top-2 left-[-60px] w-24 h-0.5">
                <div className="shooting-star w-full h-full"></div>
            </div>
            <div className="absolute z-10 inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full opacity-40 animate-twinkle"
                        style={{
                            width: `${Math.random() * 1.5 + 1}px`,
                            height: `${Math.random() * 1.5 + 1}px`,
                            top: `${Math.random() * 70 + 15}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>
            {/* Content */}
            <div className="relative z-30 max-w-screen-xl mx-auto px-4 h-full flex items-center justify-between text-gray-400 select-none text-sm font-medium tracking-wide">
                <div className="flex items-center gap-2">
                    <span className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.7)]">{`</>`}</span>
                    <span>Travel Itinerary Board</span>
                </div>
                <a
                    href="https://github.com/sakettt25"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-600 transition-colors"
                    aria-label="GitHub"
                >
                    <FiGithub size={18} />
                    <span>Saket Saurav</span>
                </a>
            </div>

            {/* Animations */}
            <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.1; }
        }
        .animate-twinkle {
          animation: twinkle 2.5s infinite;
        }
        @keyframes shooting {
          0% {
            left: -60px;
            opacity: 0;
            width: 0;
          }
          10% {
            opacity: 1;
            width: 0;
          }
          80% {
            opacity: 1;
            width: 96px;
            left: 80%;
          }
          100% {
            left: 100vw;
            opacity: 0;
            width: 0;
          }
        }
        .shooting-star {
          background: linear-gradient(90deg, #3b82f6 0%, #6366f1 60%, transparent 100%);
          border-radius: 9999px;
          box-shadow: 0 0 8px 2px #3b82f6, 0 0 16px 4px #6366f1;
          height: 2px;
          width: 96px;
          opacity: 0;
          position: absolute;
          animation: shooting 3.5s linear infinite;
        }
      `}</style>
        </footer>
    );
};

export default Footer;
