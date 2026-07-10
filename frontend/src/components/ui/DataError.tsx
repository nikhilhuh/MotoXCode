import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, MouseEvent } from "react";

interface DataErrorProps {
  message?: string;
  onRetry?: () => void;
}

export default function DataError({
  message = "Failed to load data. Please try again later.",
  onRetry,
}: DataErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  // Spotlight & Tilt mechanics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const { currentTarget, clientX, clientY } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left - width / 2;
    const y = clientY - top - height / 2;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const spotlight = useMotionTemplate`radial-gradient(circle at calc(50% + ${mouseX}px) calc(50% + ${mouseY}px), rgba(255, 255, 255, 0.08), transparent 40%)`;

  const handleRetry = () => {
    if (!onRetry) return;
    setIsRetrying(true);
    setTimeout(() => {
      onRetry();
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-10rem)] pt-28 md:pt-32 pb-16 px-4 sm:px-8 lg:px-12 w-full relative z-10 perspective-[1200px] bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-section)] to-black">
      {/* Intense Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.1)_0%,transparent_60%)] pointer-events-none blur-[60px] -z-10" />

      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 40, scale: 0.9, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
        }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="group relative bg-transparent sm:bg-[#09090b]/80 sm:backdrop-blur-2xl border border-transparent sm:border-white/[0.08] rounded-[2.5rem] p-6 sm:p-12 max-w-lg w-full text-center sm:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* Dynamic Spotlight */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 hidden sm:block" 
          style={{ background: spotlight }} 
        />
        
        {/* Animated grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)] pointer-events-none opacity-30 sm:opacity-50" />

        {/* Floating Icon Container */}
        <div className="flex justify-center mb-6 sm:mb-8 relative z-10" style={{ transform: "translateZ(40px)" }}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 12 }}
            className="relative"
          >
            {/* Outer rotating dash ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, ease: "linear", repeat: Infinity }}
              className="absolute -inset-4 rounded-full border border-dashed border-red-500/30"
            />
            {/* Pulsing glow */}
            <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-pulse" />
            <div className="relative bg-gradient-to-b from-red-500/20 to-red-950/80 border border-red-500/30 p-5 sm:p-6 rounded-full shadow-[inset_0_2px_15px_rgba(239,68,68,0.3)] sm:backdrop-blur-md">
              <FiAlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
            </div>
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4 tracking-tight bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent"
          >
            System Disconnected
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-white/50 mb-8 sm:mb-10 text-sm sm:text-base leading-relaxed max-w-[280px] sm:max-w-[320px] mx-auto font-medium"
          >
            {message}
          </motion.p>
        </div>

        {/* CTA Button */}
        {onRetry && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="relative z-10 flex justify-center"
            style={{ transform: "translateZ(50px)" }}
          >
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-black font-semibold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:pointer-events-none shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] overflow-hidden cursor-pointer disabled:cursor-not-allowed"
            >
              {/* Button inner shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out hidden sm:block" />
              
              <FiRefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 ${isRetrying ? 'animate-[spin_0.8s_linear_infinite]' : 'group-hover:rotate-180'}`} />
              <span className="tracking-wide text-xs sm:text-sm uppercase">{isRetrying ? "Reconnecting..." : "Initialize Retry"}</span>
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
