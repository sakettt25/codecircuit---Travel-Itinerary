import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  const [letterIndex, setLetterIndex] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [logoScale, setLogoScale] = useState(1);
  const companyName = 'WELCOME';

  const letterVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLetterIndex((prev) => {
        if (prev < companyName.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (letterIndex === companyName.length) {
      const logoTimeout = setTimeout(() => {
        setShowLogo(true);
      }, 600);
      return () => clearTimeout(logoTimeout);
    }
  }, [letterIndex]);

  useEffect(() => {
    if (showLogo) {
      const scaleTimeout = setTimeout(() => {
        setLogoScale(12);
      }, 300);
      return () => clearTimeout(scaleTimeout);
    }
  }, [showLogo]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-black overflow-hidden relative">
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-700 rounded-full blur-3xl opacity-30 animate-pulse" />

      <div className="text-white text-center z-10">
        <motion.div
          className="text-5xl font-extrabold tracking-widest drop-shadow-xl"
          initial="hidden"
          animate="visible"
          variants={letterVariants}
          transition={{ duration: 1 }}
        >
          {companyName.split('').map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              initial="hidden"
              animate={index < letterIndex ? 'visible' : 'hidden'}
              transition={{
                delay: index * 0.08,
                duration: 0.3,
                ease: 'easeOut',
              }}
              className="inline-block mx-0.5"
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>

        {showLogo && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: logoScale }}
            transition={{
              type: 'spring',
              stiffness: 130,
              damping: 16,
              duration: 1.1,
            }}
          >
            <motion.span
              className="text-7xl text-blue-500 drop-shadow-[0_0_18px_rgba(96,165,250,0.9)]"
              animate={
                logoScale < 5
                  ? {
                      scale: [1, 1.1, 1],
                      opacity: [0.9, 1, 0.9],
                      y: [0, -4, 0],
                    }
                  : {}
              }
              transition={
                logoScale < 5
                  ? {
                      duration: 1.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                  : {}
              }
            >
              {`</>`}
            </motion.span>
          </motion.div>
        )}
      </div>

      <motion.div
        className="absolute inset-0 bg-blue-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: logoScale > 5 ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      />
    </div>
  );
};

export default Loader;
