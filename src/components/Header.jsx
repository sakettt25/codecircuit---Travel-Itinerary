import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DURATION = {
    flyIn: 2.8,
    flyOut: 1.8,
    loop: 6.5,
};

const AirplaneIcon = ({ wiggle = false }) => (
    <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0ea5e9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-12 h-12 drop-shadow-[0_0_20px_rgba(14,165,233,0.9)]"
        animate={wiggle ? {
            rotate: [0, 12, -12, 0],
            scale: [1, 1.1, 0.95, 1],
            x: [0, 2, -2, 0],
        } : {}}
        transition={wiggle ? {
            duration: 1.4,
            repeat: Infinity,
            ease: 'easeInOut',
        } : {}}
    >
        <path d="M2.5 19.5L21 12 2.5 4.5v7l13 0" />
    </motion.svg>
);

const ShootingStars = () => {
    const stars = useMemo(() =>
        Array.from({ length: 10 }).map(() => ({
            delay: Math.random() * 3,
            top: Math.random() * 100,
            length: `${Math.random() * 40 + 30}px`,
            angle: Math.random() * 30 - 15,
        })), []);

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {stars.map(({ delay, top, length, angle }, i) => (
                <motion.div
                    key={i}
                    className="absolute h-px bg-gradient-to-r from-white/80 to-transparent"
                    style={{
                        width: length,
                        top: `${top}%`,
                        transform: `rotate(${angle}deg)`,
                    }}
                    initial={{ x: '100vw', opacity: 0 }}
                    animate={{
                        x: '-20vw',
                        opacity: [0, 0.8, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        delay,
                        ease: 'easeInOut',
                        repeat: Infinity,
                        repeatDelay: delay + 2,
                    }}
                />
            ))}
        </div>
    );
};

const TitleText = () => (
    <motion.span
        className="font-extrabold text-3xl md:text-4xl tracking-tighter"
        style={{
            background: 'linear-gradient(90deg, #222f3e 25%, #334155 50%, #222f3e 75%)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 12px #0ea5e91a',
            letterSpacing: '-0.03em',
        }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
    >
        Travel Itinerary Board
    </motion.span>
);

const Header = () => {
    const [phase, setPhase] = useState('entry');

    useEffect(() => {
        if (phase === 'entry') {
            const timeout = setTimeout(() => {
                setPhase('detach');
                setTimeout(() => setPhase('loop'), DURATION.flyOut * 1000);
            }, DURATION.flyIn * 1000);
            return () => clearTimeout(timeout);
        }
    }, [phase]);

    return (
        <header className="w-full flex justify-center mt-10 px-4">
            <nav
                className="w-full max-w-5xl relative rounded-3xl border border-blue-900/30 shadow-2xl backdrop-blur-xl overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(14,23,38,0.22) 85%, rgba(59,130,246,0.1) 100%)',
                    boxShadow: '0 10px 50px #0ea5e933, 0 3px 16px #6366f122',
                }}
            >
                <motion.div
                    className="absolute inset-0 z-0 pointer-events-none"
                    animate={{
                        opacity: [0.2, 0.4, 0.2],
                        background: [
                            'radial-gradient(circle at 15% 50%, rgba(14,165,233,0.08) 0%, transparent 60%)',
                            'radial-gradient(circle at 85% 50%, rgba(14,165,233,0.1) 0%, transparent 60%)',
                            'radial-gradient(circle at 15% 50%, rgba(14,165,233,0.08) 0%, transparent 60%)',
                        ]
                    }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                />

                <div className="relative z-10 h-28 flex justify-center items-center px-8">
                    <AnimatePresence mode="wait">
                        {phase === 'entry' && (
                            <motion.div
                                key="entry"
                                className="flex items-center gap-6 absolute"
                                initial={{ x: '-60vw', y: '-40vh', rotate: -45 }}
                                animate={{ x: 0, y: 0, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{
                                    duration: DURATION.flyIn,
                                    ease: [0.68, -0.15, 0.32, 1.3],
                                }}
                            >
                                <AirplaneIcon />
                                <motion.div
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1.4, delay: 0.8 }}
                                >
                                    <TitleText />
                                </motion.div>
                            </motion.div>
                        )}

                        {phase === 'detach' && (
                            <>
                                <motion.div
                                    key="detach"
                                    className="absolute left-1/2 top-1/2"
                                    style={{ transform: 'translate(-50%, -50%)' }}
                                    animate={{ x: '60vw', rotate: 25, scale: 0.9 }}
                                    transition={{
                                        duration: DURATION.flyOut,
                                        ease: [0.45, 0, 0.55, 1],
                                    }}
                                >
                                    <AirplaneIcon wiggle />
                                </motion.div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <TitleText />
                                </motion.div>
                            </>
                        )}

                        {phase === 'loop' && (
                            <>
                                <ShootingStars />
                                <motion.div
                                    className="absolute left-0 top-1/2 z-10"
                                    style={{ transform: 'translateY(-50%)' }}
                                    animate={{
                                        x: ['-100px', '110vw'],
                                        y: ['0%', '-5%', '5%', '0%']
                                    }}
                                    transition={{
                                        duration: DURATION.loop,
                                        repeat: Infinity,
                                        ease: 'easeInOut'
                                    }}
                                >
                                    <AirplaneIcon wiggle />
                                    <motion.div
                                        className="absolute left-[-80px] top-1/2 w-24 h-1.5 bg-gradient-to-r from-blue-400/50 to-transparent rounded-full blur-md"
                                        style={{ transform: 'translateY(-50%)' }}
                                        animate={{
                                            opacity: [0.4, 0.8, 0.4],
                                            scaleX: [0.85, 1.2, 0.85],
                                        }}
                                        transition={{
                                            duration: 2.2,
                                            repeat: Infinity,
                                            repeatType: 'mirror',
                                            ease: 'easeInOut',
                                        }}
                                    />
                                </motion.div>
                                <TitleText />
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </nav>
        </header>
    );
};

export default Header;
