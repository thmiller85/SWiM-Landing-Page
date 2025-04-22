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
      duration: 0.8,
      ease: "easeOut",
    },
  }),
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3,
    }
  }
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
        duration: 1.2,
        ease: "easeOut",
      },
    }),
    exit: {
      x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
      y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    },
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
      duration: 1.0,
      ease: "easeOut",
      delay: 0.2,
    },
  },
  exit: {
    y: -50,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: "easeIn",
    },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.15,
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export const scaleIn: Variants = {
  hidden: {
    scale: 0.85,
    opacity: 0,
  },
  visible: (delay = 0) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay,
      duration: 1.0,
      ease: [0.25, 0.1, 0.25, 1.0], // Custom cubic-bezier for smoother feel
    },
  }),
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: "easeIn",
    },
  },
};

export const revealFromLeft: Variants = {
  hidden: {
    x: -120,
    opacity: 0,
    rotateY: -15,
  },
  visible: (delay = 0) => ({
    x: 0,
    opacity: 1,
    rotateY: 0,
    transition: {
      delay,
      duration: 1.2,
      ease: "easeOut",
      opacity: { duration: 0.8 },
      rotateY: { duration: 0.8 },
    },
  }),
  exit: {
    x: 50,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: "easeIn",
    },
  },
};

export const revealFromRight: Variants = {
  hidden: {
    x: 120,
    opacity: 0,
    rotateY: 15,
  },
  visible: (delay = 0) => ({
    x: 0,
    opacity: 1,
    rotateY: 0,
    transition: {
      delay,
      duration: 1.2,
      ease: "easeOut",
      opacity: { duration: 0.8 },
      rotateY: { duration: 0.8 },
    },
  }),
  exit: {
    x: -50,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: "easeIn",
    },
  },
};

export const floatingAnimation: Variants = {
  hidden: {
    y: 0,
    opacity: 0,
  },
  visible: {
    y: [0, -15, 0],
    opacity: 1,
    transition: {
      y: {
        repeat: Infinity,
        duration: 4,
        ease: "easeInOut",
      },
      opacity: {
        duration: 0.8,
      },
    },
  },
};

export const pulseAnimation: Variants = {
  hidden: {
    scale: 0.95,
    opacity: 0,
  },
  visible: {
    scale: [1, 1.05, 1],
    opacity: 1,
    transition: {
      scale: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut",
      },
      opacity: {
        duration: 0.8,
      },
    },
  },
};
