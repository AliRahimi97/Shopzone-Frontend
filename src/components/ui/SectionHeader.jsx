export default function SectionHeader({ eyebrow, title, subtitle, dark = false }) {
  return (
    <div className="text-center mb-10 md:mb-12">
      {eyebrow && (
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 ${
            dark
              ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
              : "bg-orange-100 text-orange-600"
          }`}
        >
          {eyebrow}
        </div>
      )}
      <h2
        className={`text-3xl md:text-4xl font-extrabold mb-3 ${
          dark ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base md:text-lg max-w-2xl mx-auto ${dark ? "text-slate-400" : "text-slate-500"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}   