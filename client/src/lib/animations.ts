import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export const slideIn = (direction: "left" | "right" | "up" | "down"): Variants => {
  return {
    hidden: {
      x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
      y: direction === "up" ? -100 : direction === "down" ? 100 : 0,
      opacity: 0,
    },
    visible: (delay = 0) => ({
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        delay,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };
};

export const slideUp: Variants = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.2,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export const scaleIn: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: (delay = 0) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export const revealFromLeft: Variants = {
  hidden: {
    x: -100,
    opacity: 0,
  },
  visible: (delay = 0) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

export const revealFromRight: Variants = {
  hidden: {
    x: 100,
    opacity: 0,
  },
  visible: (delay = 0) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};
