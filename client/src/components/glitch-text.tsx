import { motion } from "framer-motion";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
  return (
    <div className={`relative ${className}`}>
      <motion.span
        className="absolute top-0 left-0 text-[#00FFFF] mix-blend-screen"
        animate={{
          x: [-2, 2, -2],
          transition: {
            repeat: Infinity,
            duration: 0.5,
            ease: "linear",
          },
        }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 text-[#FF00FF] mix-blend-screen"
        animate={{
          x: [2, -2, 2],
          transition: {
            repeat: Infinity,
            duration: 0.5,
            ease: "linear",
          },
        }}
      >
        {text}
      </motion.span>
      <span className="relative">{text}</span>
    </div>
  );
}
