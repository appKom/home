"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

// TODO: change words
const words = ["fremtidens", "morgendagens", "etterlengtede", "morsomme", "kreative"]
const shuffledWords = words.sort(() => Math.random() - 0.5);

const INTERVAL_SECONDS = 3;

export const HeroSection = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, 1000 * INTERVAL_SECONDS)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-3xl mx-auto text-center min-h-screen flex flex-col justify-center">
      <motion.h1
        className="text-4xl md:text-6xl font-bold mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Applikasjons&shy;komiteen
      </motion.h1>

      <motion.p
        className="text-xl text-gray-400 mb-16 tracking-wide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Vi utvikler{" "}
        <span className="inline-block opacity-80">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={currentWordIndex}
              className="inline-block font-semibold text-onlineOrange"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {shuffledWords[currentWordIndex]}
            </motion.span>
          </AnimatePresence>
        </span>{" "}digitale løsninger for informatikkstudenter ved NTNU
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <a
          href="#"
          className="inline-block px-8 py-3 bg-onlineBlue text-white rounded-full text-lg font-semibold transition-colors hover:bg-opacity-70"
        >
          hva skal stå her?? {/* TODO: Replace text and link or remove button */}
        </a>
      </motion.div>
    </div>
  )
}