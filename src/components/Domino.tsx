import { cn } from "@/lib/utils";

interface DominoProps {
  topDots: number;
  bottomDots: number;
  isHorizontal?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

const renderDots = (count: number) => {
  const positions = [
    [], // 0 dots
    [4], // 1 dot (center)
    [0, 8], // 2 dots (corners)
    [0, 4, 8], // 3 dots (diagonal)
    [0, 2, 6, 8], // 4 dots (corners)
    [0, 2, 4, 6, 8], // 5 dots (all corners + center)
    [0, 1, 2, 6, 7, 8], // 6 dots (two columns)
  ];

  return Array.from({ length: 9 }, (_, i) => (
    <div
      key={i}
      className={cn(
        "w-2 h-2 rounded-full transition-colors",
        positions[count]?.includes(i) ? "bg-game-domino-dot" : "transparent"
      )}
    />
  ));
};

export const Domino = ({
  topDots,
  bottomDots,
  isHorizontal = false,
  isSelected = false,
  onClick,
  className,
}: DominoProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative cursor-pointer transition-all duration-200 hover:scale-105",
        isHorizontal ? "w-16 h-8" : "w-8 h-16",
        isSelected && "scale-110",
        className
      )}
      style={{
        background: "var(--gradient-domino)",
        boxShadow: "var(--shadow-domino)",
        borderRadius: "6px",
        border: "1px solid hsl(var(--game-domino-dot) / 0.1)",
      }}
    >
      {/* Top/Left section */}
      <div
        className={cn(
          "absolute grid grid-cols-3 gap-0.5 p-1",
          isHorizontal 
            ? "left-0 top-0 w-8 h-8 border-r border-game-domino-dot/20" 
            : "top-0 left-0 w-8 h-8 border-b border-game-domino-dot/20"
        )}
      >
        {renderDots(topDots)}
      </div>

      {/* Bottom/Right section */}
      <div
        className={cn(
          "absolute grid grid-cols-3 gap-0.5 p-1",
          isHorizontal 
            ? "right-0 top-0 w-8 h-8" 
            : "bottom-0 left-0 w-8 h-8"
        )}
      >
        {renderDots(bottomDots)}
      </div>
    </div>
  );
};