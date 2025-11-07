'use client';
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Magnet = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.5s ease-in-out",
  wrapperClassName = "",
  innerClassName = "",
  showTooltip = false,
  tooltipText = "",
  tooltipClassName = "",
  ...props
}) => {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState({ x: 0, y: 0, show: false });

  const magnetRef = useRef(null);

  useEffect(() => {
    if (disabled) {
      setPosition({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (e) => {
      if (!magnetRef.current) return;

      const { left, top, width, height } =
        magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        setIsActive(true);

        const offsetX = (e.clientX - centerX) / magnetStrength;
        const offsetY = (e.clientY - centerY) / magnetStrength;
        setPosition({ x: offsetX, y: offsetY });

        if (showTooltip) {
          setTooltip({
            x: e.clientX - left,
            y: e.clientY - top,
            show: true,
          });
        }
      } else {
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
        if (showTooltip) setTooltip((prev) => ({ ...prev, show: false }));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [padding, disabled, magnetStrength, showTooltip]);

  const transitionStyle = isActive ? activeTransition : inactiveTransition;

  return (
    <div
      ref={magnetRef}
      className={`relative inline-block ${wrapperClassName}`}
      {...props}
    >
      <div
        className={innerClassName}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: transitionStyle,
          willChange: "transform",
        }}
      >
        {children}
      </div>

      {showTooltip && tooltip.show && (
        <motion.div
          className={`absolute pointer-events-none px-3 py-1 bg-black text-white text-sm rounded shadow ${tooltipClassName}`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, x: tooltip.x, y: tooltip.y - 20 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {tooltipText}
        </motion.div>
      )}
    </div>
  );
};

export default Magnet;
