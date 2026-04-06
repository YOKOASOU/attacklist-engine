interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function GlassCard({
  children,
  className = "",
  hover = true,
  glow = false,
}: GlassCardProps) {
  const base = glow ? "glass-glow" : "glass";

  return (
    <div
      className={`${base} p-7 transition-all duration-300 ${
        hover
          ? "hover:shadow-[0_0_25px_rgba(0,212,255,0.15),0_0_50px_rgba(168,85,247,0.08)] hover:scale-[1.01]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
