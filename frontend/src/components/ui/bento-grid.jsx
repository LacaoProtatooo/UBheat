import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const BentoGrid = ({ children, className }) => {
  return <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>{children}</div>;
};

export const BentoGridItem = ({ title, description, header, className, icon }) => {
    return (
      <div className={cn("p-4 rounded-lg border shadow-md", className)}>
        <div className="flex items-center space-x-2 mb-2">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {/* Add margin for spacing and remove overflow-hidden */}
        <div className="text-sm text-gray-500 mb-4">{description}</div>
        <div className="mt-4">{header}</div>
      </div>
    );
  };
  

const SkeletonOne = () => {
  const variants = {
    initial: { x: 0 },
    animate: { x: 10, rotate: 5, transition: { duration: 0.2 } },
  };
  const variantsSecond = {
    initial: { x: 0 },
    animate: { x: -10, rotate: -5, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
    
    
    </motion.div>
  );
};

export { SkeletonOne };
