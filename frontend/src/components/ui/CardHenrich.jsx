import React from "react";
import { cn } from "../../utils/cn";

export const CardHenrich = ({ className, children }) => {
  return (
    <div
      className={cn(
        "group w-full cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800",
        "bg-gray-100", // Grayish white background
        "hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-50",
        "transition-all duration-500",
        className
      )}
    >
      {children}
    </div>
  );
};
