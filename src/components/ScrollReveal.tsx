'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// ==============================|| SCROLL REVEAL WRAPPER ||============================== //

type Direction = 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const getInitial = (direction: Direction, distance: number) => {
  switch (direction) {
    case 'up':
      return { opacity: 0, y: distance };
    case 'down':
      return { opacity: 0, y: -distance };
    case 'left':
      return { opacity: 0, x: distance };
    case 'right':
      return { opacity: 0, x: -distance };
    case 'zoom':
      return { opacity: 0, scale: 0.85 };
    case 'fade':
    default:
      return { opacity: 0 };
  }
};

const getAnimate = (direction: Direction) => {
  switch (direction) {
    case 'up':
    case 'down':
      return { opacity: 1, y: 0 };
    case 'left':
    case 'right':
      return { opacity: 1, x: 0 };
    case 'zoom':
      return { opacity: 1, scale: 1 };
    case 'fade':
    default:
      return { opacity: 1 };
  }
};

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 40,
  once = true,
  className,
  style
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={getInitial(direction, distance)}
      whileInView={getAnimate(direction)}
      viewport={{ once, margin: '-80px' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  );
}
