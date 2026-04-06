import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const variants = {
  initial: {
    opacity: 0,
    rotateX: 8,
    y: 40,
    scale: 0.97,
    transformOrigin: 'top center',
  },
  animate: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    scale: 1,
    transformOrigin: 'top center',
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    rotateX: -6,
    y: -30,
    scale: 0.97,
    transformOrigin: 'top center',
    transition: {
      duration: 0.3,
      ease: [0.55, 0, 1, 0.45],
    },
  },
};

const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ perspective: 1200 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
