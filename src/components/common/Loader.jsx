import React from "react";

/**
 * A professional, compact inline loader/spinner.
 * @param {string} className - Additional CSS classes.
 * @param {string} size - Size of the spinner (h-x w-x).
 * @param {string} text - Optional text to display next to the spinner.
 */
const Loader = ({ className = "", size = "h-5 w-5", text = "" }) => {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <svg
        className={`animate-spin ${size} text-brand-500`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
      {text && (
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {text}
        </span>
      )}
    </div>
  );
};

export default Loader;
