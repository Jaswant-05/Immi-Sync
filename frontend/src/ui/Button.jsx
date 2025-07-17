import clsx from "clsx";

const VARIANTS = {
  primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl",
  secondary: "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl",
  ghost: "bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm",
  outline: "border-2 border-white text-white hover:bg-white hover:text-blue-600",
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
        "px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95",
        "flex items-center justify-center gap-2 relative overflow-hidden",
        disabled ? "opacity-50 cursor-not-allowed" : VARIANTS[variant],
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