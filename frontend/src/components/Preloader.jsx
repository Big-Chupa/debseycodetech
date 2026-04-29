import React from 'react';
import { motion } from 'framer-motion';
import './Preloader.css';

const Preloader = () => {
  return (
    <motion.div 
      className="preloader-container"
      // Framer motion animation: fades out at the end
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <div className="typewriter-text">
        welcome to DebseyCodeTech
      </div>
    </motion.div>
  );
};

export default Preloader;