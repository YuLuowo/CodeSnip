"use client";

import ColorBends from "@/components/ui/color-bends";
import DotField from "@/components/ui/dot-field";
import { useTheme } from "next-themes";

export function HeroBackGround() {
    const { theme, resolvedTheme, systemTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    return (
        <>
            <div className="absolute inset-0 z-0">
                <ColorBends
                    colors={isDark ? ["#818181"] : ["#000000"]}
                    rotation={90}
                    speed={0.2}
                    scale={1}
                    frequency={1}
                    warpStrength={1}
                    mouseInfluence={1}
                    noise={0}
                    parallax={0.5}
                    iterations={1}
                    intensity={1.5}
                    bandWidth={isDark ? 1.4 : 3.0}
                    transparent
                    autoRotate={0}
                />
            </div>

            <div className="absolute inset-0 z-10 bg-background/70 backdrop-blur-xl mask-[linear-gradient(to_bottom,black_65%,transparent_100%)]">
                <DotField
                    dotRadius={1.5}
                    dotSpacing={14}
                    bulgeStrength={67}
                    glowRadius={0}
                    sparkle={false}
                    waveAmplitude={0}
                    cursorRadius={500}
                    cursorForce={0.1}
                    bulgeOnly
                    gradientFrom={isDark ? "#4a4a4a" : "#d1d5db"}
                    gradientTo={isDark ? "#4a4a4a" : "#d1d5db"}
                />
            </div>
        </>
    );
}