import React from "react";
import { cn } from "../../utils/cn";

export const CardHenrich = ({ className, children }) => {
  return (
    <div
      className={cn(
        "group w-full cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800",
        "bg-[url(https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHVoNGRoaWsxNmRyb3VzMGNwZ3lwNzFmb3A1MWlnMTU4MXBteGhpNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/bGgsc5mWoryfgKBx1u/giphy.gif)] bg-cover",
        "before:bg-[url(https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHVoNGRoaWsxNmRyb3VzMGNwZ3lwNzFmb3A1MWlnMTU4MXBteGhpNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26tn33aiTi1jkl6H6/giphy.gif)] before:fixed before:inset-0 before:opacity-0 before:z-[-1]",
        "hover:bg-[url(https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHVoNGRoaWsxNmRyb3VzMGNwZ3lwNzFmb3A1MWlnMTU4MXBteGhpNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26tn33aiTi1jkl6H6/giphy.gif)]",
        "hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-50",
        "transition-all duration-500",
        className
      )}
    >
      {children}
    </div>
  );
};