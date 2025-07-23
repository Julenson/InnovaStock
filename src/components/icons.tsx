import type { SVGProps } from "react";

export function InnovaTrackLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <title>Innova Sport Logo</title>
            <path
                d="M50,10a40,40 0 1,0 0,80a40,40 0 1,0 0,-80"
                stroke="hsl(var(--primary))"
                strokeWidth="12"
            />
            <path
                d="M50,22a28,28 0 1,0 0,56a28,28 0 1,0 0,-56"
                fill="hsl(var(--primary))"
                opacity="0.2"
                stroke="none"
            />
            <path
                d="M68,32 L32,68"
                stroke="hsl(var(--background))"
                strokeWidth="14"
            />
        </svg>
    );
}
