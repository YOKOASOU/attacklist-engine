interface NeonButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function NeonButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
}: NeonButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:shadow-[0_0_25px_rgba(0,212,255,0.35),0_0_50px_rgba(168,85,247,0.15)] active:scale-95",
    secondary:
      "glass text-neon-blue hover:text-white hover:bg-neon-blue/15 border border-neon-blue/25 hover:border-neon-blue/50 hover:shadow-[0_0_15px_rgba(0,212,255,0.15)]",
    ghost:
      "text-foreground/60 hover:text-foreground hover:bg-white/[0.04]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
