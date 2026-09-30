import { cn } from "@/lib/utils";

interface DashedGridBackgroundProps {
    className?: string;
    /** Size of each grid cell in pixels */
    cellSize?: number;
    /** Tailwind mask-image utility applied on top of the grid (controls where the grid fades out) */
    maskClassName?: string;
}

/**
 * Renders a subtle dashed grid pattern (à la Next.js / Vercel marketing pages),
 * meant to be placed as an absolutely positioned background layer behind a section.
 */
export function DashedGridBackground({
    className,
    cellSize = 64,
    maskClassName = "[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]",
}: DashedGridBackgroundProps) {
    const patternId = "dashed-grid-pattern";

    return (
        <svg
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute inset-0 -z-10 h-full w-full text-border",
                maskClassName,
                className
            )}
        >
            <defs>
                <pattern
                    id={patternId}
                    width={cellSize}
                    height={cellSize}
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
    );
}
