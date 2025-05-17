import React, { useRef, useMemo, useEffect, useState } from 'react';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import Header from './components/Header';
import ItineraryBoard from './components/ItineraryBoard';
import Footer from './components/Footer';
import Loader from './components/Loader';
import TopLoader from './components/TopLoader'; // Assuming you have this component

// Starfield background component
const Starfield = () => {
  const meshRef = useRef();
  const { size } = useThree();

  const starsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000 * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 200;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    return geometry;
  }, []);

  const direction = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e) => {
      direction.current.x = (e.clientX / size.width - 0.5) * 2;
      direction.current.y = -(e.clientY / size.height - 0.5) * 2;
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [size]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001 + direction.current.x * 0.005;
      meshRef.current.rotation.x += 0.001 + direction.current.y * 0.005;
    }
  });

  return (
    <points ref={meshRef} geometry={starsGeometry}>
      <pointsMaterial color="white" size={0.5} sizeAttenuation depthWrite={false} />
    </points>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Match this with the Loader's duration

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="bg-black text-white">
      <TopLoader />

      {isLoading ? (
        <Loader />
      ) : (
        <div className="relative min-h-screen flex flex-col overflow-hidden text-gray-900 dark:text-gray-100">
          {/* Background */}
          <div className="fixed inset-0 z-0">
            <Canvas>
              <color attach="background" args={['black']} />
              <Starfield />
            </Canvas>
          </div>

          {/* Main UI on top of starfield */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <div className="py-7">
              <ItineraryBoard />
            </div>
            <Footer />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
