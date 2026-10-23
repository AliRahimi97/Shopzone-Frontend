const variants = {
  primary:
    "bg-[#ff7a00] hover:bg-[#e56e00] text-white shadow-md shadow-orange-500/20",
  secondary:
    "bg-white border border-slate-200 text-slate-800 hover:border-[#ff7a00] hover:text-[#ff7a00]",
  dark: "bg-slate-900 hover:bg-slate-800 text-white",
};

const sizes = {
  sm: "px-3 py-2 text-sm rounded-xl",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3.5 text-base rounded-xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  type = "button",
  onClick,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}