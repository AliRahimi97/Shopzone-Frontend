const styles = {
  discount: "bg-red-500 text-white",
  stock: "bg-orange-500 text-white",
  success: "bg-emerald-500 text-white",
  neutral: "bg-slate-800 text-white",
};

export default function Badge({ children, variant = "discount", className = "" }) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shadow
        ${styles[variant]} ${className}
      `}
    >
      {children}
    </span>
  );
}