import React from "react";
import { cn } from "../../utils/cn";

export const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        "group w-full cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800",
        "bg-[url(https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODY1NHJjYTZsa2hhdTQ5dnBhejlxYzB0eWdjaWs3NjhkcDFxbmxxMSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2IudUHdI075HL02Pkk/giphy.gif)] bg-cover",
        "before:bg-[url(https://media.giphy.com/media/HzPtbOKyBoBFsK4hyc/giphy.gif?cid=790b76118654rca6lkhau49vpaz9qc0tygcik768dp1qnlq1&ep=v1_gifs_search&rid=giphy.gif&ct=g)] before:fixed before:inset-0 before:opacity-0 before:z-[-1]",
        "hover:bg-[url(https://media.giphy.com/media/HzPtbOKyBoBFsK4hyc/giphy.gif?cid=790b76118654rca6lkhau49vpaz9qc0tygcik768dp1qnlq1&ep=v1_gifs_search&rid=giphy.gif&ct=g)]",
        "hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-50",
        "transition-all duration-500",
        className
      )}
    >
      {children}
    </div>
  );
};