import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineBarcode, AiOutlineWarning } from "react-icons/ai";
import { Button } from "@mui/material";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({ setActive, active, item, children, href }) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative ">
      <Link to={href} className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white">
        <motion.p transition={{ duration: 0.3 }} className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white">
          {item}
        </motion.p>
      </Link>
      {active !== null && active === item && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
          className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4"
        >
          <motion.div
            transition={transition}
            layoutId="active"
            className=""
          >
            <motion.div layout className="w-max h-full p-4">
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({ setActive, children }) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 
                 rounded-full border border-transparent 
                 dark:bg-black dark:border-white/[0.2] 
                 bg-zinc-200 shadow-input 
                 flex justify-center space-x-4 
                 px-64 py-6"
    >
      {children}
    </nav>
  );
};


export const ProductItem = ({ title, description, href, src }) => {
  return (
    <Link to={href} className="flex space-x-2">
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300 overflow-y-auto max-h-[5rem]">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ href, children, ...rest }) => {
  return (
    <Link
      {...rest}
      to={href}
      className="block max-w-sm p-4 border border-gray-300 dark:border-neutral-700 rounded-lg shadow-md hover:shadow-lg hover:border-gray-500 transition-all duration-200 ease-in-out bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-center hover:text-black"
    >
      {children}
    </Link>
  );
};
