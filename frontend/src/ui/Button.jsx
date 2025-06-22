import clsx from "clsx";

const VARIANTS = {
  primary: "bg-white text-blue-600 hover:bg-blue-100 border-2 border-transparent",
  secondary: "bg-blue-600 text-white hover:text-blue-600 hover:bg-white border-2 border-white",
  login: "text-gray-600 hover:text-blue-600 border border-gray-600 border-2 hover:border-blue-600",
  getStarted: "bg-blue-600 text-white hover:bg-blue-700 border border-2 border-transparent",
  pricingPrimary: "bg-blue-600 text-white hover:bg-blue-700",
  pricingSecondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
};

const DISABLED_VARIANTS = {
  primary: "bg-gray-100 text-gray-400 border-2 border-transparent cursor-not-allowed",
  secondary: "bg-gray-400 text-gray-200 border-2 border-gray-400 cursor-not-allowed",
  login: "text-gray-400 border-2 border-gray-300 cursor-not-allowed",
  getStarted: "bg-gray-400 text-gray-200 border-2 border-transparent cursor-not-allowed",
  pricingPrimary: "bg-gray-400 text-gray-200 cursor-not-allowed",
  pricingSecondary: "bg-gray-200 text-gray-400 cursor-not-allowed",
};

export const Button = ({ 
  children, 
  variant = "primary", 
  className, 
  onClick, 
  type = "button", 
  disabled = false,
  ...rest 
}) => {
  return (
    <button
      className={clsx(
        "box-border px-4 py-2 text-sm md:px-8 md:text-base",
        "rounded-lg font-semibold transition-all duration-300",
        disabled 
          ? DISABLED_VARIANTS[variant] 
          : clsx(VARIANTS[variant], "cursor-pointer"),
        className
      )}
      onClick={disabled ? undefined : onClick}
      type={type}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};