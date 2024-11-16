"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"

const DURATION = 5;
const MAX_DELAY = 15;

export const Background = () => {
  const horizontalLines = Array.from({ length: 5 }, (_, i) => {
    const randomDelay = Math.random() * MAX_DELAY;
    return (
      <motion.div
        key={i}
        className="absolute h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-75"
        style={{
          width: '100%',
          top: `${(i + 1) * 20}%`,
          left: 0,
        }}
        animate={{
          x: ['-100%', '100%'],
          transition: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: DURATION,
            delay: randomDelay,
            ease: 'linear',
          },
        }}
      />
    );
  });

  const verticalLines = Array.from({ length: 5 }, (_, i) => {
    const randomDelay = Math.random() * MAX_DELAY;
    return (
      <motion.div
        key={`vertical-${i}`}
        className="absolute w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent opacity-75"
        style={{
          height: '100%',
          left: `${(i + 1) * 20}%`,
          top: 0,
        }}
        animate={{
          y: ['-100%', '100%'],
          transition: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: DURATION,
            delay: randomDelay,
            ease: 'linear',
          },
        }}
      />
    );
  });

  return (
    <div className="fixed inset-0 -z-10 min-h-screen bg-gray-950 text-gray-100 overflow-hidden grid place-content-center">
      {horizontalLines}
      {verticalLines}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"
        animate={{
          scaleX: [0, 1, 0],
          opacity: [0, 1, 0],
          transition: {
            repeat: Infinity,
            duration: 5,
            ease: 'easeInOut',
          },
        }}
      />
      <DotsGrid />
    </div>
  )
}

const numRows = window.innerHeight / 120;
const numCols = numRows * (window.innerWidth / window.innerHeight);

const DotsGrid = () => {
  useEffect(() => {
    const container = document.getElementById("dots-container");

    const handleResize = () => {
      // Remove the existing dots before adding new ones on resize
      while (container?.firstChild) {
        container.removeChild(container.firstChild);
      }

      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          const dot = document.createElement("div");
          dot.classList.add(
            "bg-gradient-to-b",
            "from-slate-700",
            "to-slate-400",
            "opacity-30",
            "w-1",
            "aspect-square",
            "rounded-full",
            "absolute",
          );
          dot.style.top = `${(row * 100) / numRows + 1}%`;
          dot.style.left = `${(col * 100) / numCols + 1}%`;
          container?.appendChild(dot);
        }
      }
    };

    handleResize(); // Call the handleResize function initially and add an event listener
    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen w-screen overflow-x-hidden bg-cover bg-opacity-25 bg-no-repeat text-[#333333] flex place-content-center">
      <div
        id="dots-container"
        className="top-0 left-0 w-screen h-screen fixed"
      />
    </div>
  );
}