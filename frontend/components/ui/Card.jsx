export function Card({ children, className = "" }) {
  return (
    <div
      className={
        "rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur shadow-[0_10px_30px_-12px_rgba(0,0,0,0.2)] " +
        className
      }
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, icon }) {
  return (
    <div className="px-5 pt-5 pb-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <h2 className="text-lg md:text-xl font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

export function CardBody({ children }) {
  return <div className="px-5 pb-5">{children}</div>;
}
