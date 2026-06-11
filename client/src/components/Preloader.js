import React from "react";
import { motion } from "framer-motion";

export default function Preloader() {
  return (
    <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }} className="preloader">
      <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .35 }}>
        <div className="preloader-logo">Smart Shop <span>3D</span></div>
        <div className="preloader-subtitle">AI Virtual Try-On</div>
      </motion.div>
    </motion.div>
  );
}
