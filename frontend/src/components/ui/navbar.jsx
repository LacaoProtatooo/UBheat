import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./moving-border.jsx";
import { checkAuthStatus } from "../../utils/userauth";

export const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = checkAuthStatus();

  return (
    <nav
      className="
        fixed top-4 left-1/2 transform -translate-x-1/2 z-50
        flex items-center w-[80%] justify-between
        rounded-full bg-zinc-200 text-black shadow-md
        px-8 py-4
      "
    >
      {/* Left section: Brand / Logo */}
      <div className="flex items-center space-x-2">
        <img src="/UB_Logo_animated.gif" alt="logo" className="h-8 w-8" />
        <Link to="/about" className="hover:opacity-80 font-bold text-xl">
          UBheat
        </Link>
      </div>

      {/* Middle section: Navigation links */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="hover:opacity-80">
          Map
        </Link>
        <Link to="/information" className="hover:opacity-80">
          Sources
        </Link>
        {!isAuthenticated ? (
          <Link to="/login" className="hover:opacity-80">
            Login
          </Link>
        ) : (
          <Link to="/profile" className="hover:opacity-80">
            Profile
          </Link>
        )}
      </div>

      {/* Right section: CTA / Button using moving-border */}
      <div>
        {!isAuthenticated ? (
          <Button
            borderRadius="1.75rem"
            className="bg-zinc-50 dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </Button>
        ) : (
          <Button
            borderRadius="1.75rem"
            className="bg-zinc-50 dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
            onClick={() => navigate("/profile")}
          >
            Dashboard
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
