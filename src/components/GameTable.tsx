import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GameTableProps {
  children: ReactNode;
  className?: string;
}

export const GameTable = ({ children, className }: GameTableProps) => {
  return (
    <div className={cn("relative w-full h-full min-h-[600px]", className)}>
      {/* Table surface with gradient */}
      <div 
        className="absolute inset-0 rounded-xl border-4 border-game-table-border"
        style={{
          background: "var(--gradient-table)",
          boxShadow: "inset 0 0 50px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Felt texture overlay */}
        <div 
          className="absolute inset-0 rounded-lg opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px, 30px 30px",
          }}
        />
        
        {/* Inner border glow */}
        <div className="absolute inset-2 rounded-lg border border-primary/20" />
      </div>

      {/* Game content */}
      <div className="relative z-10 p-8 h-full">
        {children}
      </div>
    </div>
  );
};