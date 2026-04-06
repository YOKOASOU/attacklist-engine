interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = "", hover = true }: GlassCardProps) {
  return (
    <div
      className={`glass p-6 transition-all duration-300 ${
        hover ? "hover:neon-glow hover:scale-[1.01]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
