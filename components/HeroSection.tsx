"use client"

import { motion } from "framer-motion"

export const HeroSection = () => {
  return (
    <div className="max-w-3xl mx-auto text-center min-h-screen flex flex-col justify-center">
      <motion.h1
        className="text-4xl md:text-6xl font-bold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Applikasjons&shy;komiteen
      </motion.h1>

      <motion.p
        className="text-xl text-gray-400 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Vi utvikler fremtidens digitale løsninger for informatikkstudenter ved NTNU.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <a
          href="#"
          className="inline-block px-8 py-3 bg-blue-500 text-white rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Bli med oss
        </a>
      </motion.div>
    </div>
  )
}