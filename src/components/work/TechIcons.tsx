import React from "react";

interface TechIconProps {
    name: string;
    className?: string;
}

const TechIcon: React.FC<TechIconProps> = ({ name, className = "w-8 h-8" }) => {
    const lowerName = name.toLowerCase();

    // "White Tile" style: All buttons have the same white/off-white glossy base.
    // The unique part is the colorful logo rendered on top, with a subtle drop shadow.
    // We use filter for the base to look 3D (soft bevel + gloss).

    const filterId = "tile-3d-filter";
    const shadowId = "logo-shadow";

    const commonProps = {
        className,
        viewBox: "0 0 32 32",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
    };

    const BaseParams = {
        color: "#F8F9FA", // Very light grey/white for the "clay" look
        rx: 8,
    };

    const BaseTile = () => (
        <g>
            {/* Drop Shadow for the Tile */}
            <rect x="2" y="4" width="28" height="26" rx={BaseParams.rx} fill="rgba(0,0,0,0.08)" />
            {/* 3D Body */}
            <rect x="2" y="2" width="28" height="26" rx={BaseParams.rx} fill={BaseParams.color} filter={`url(#${filterId})`} />
            {/* Inner Rim Highlight */}
            <rect x="2.5" y="2.5" width="27" height="25" rx={BaseParams.rx} stroke="white" strokeWidth="1" strokeOpacity="0.8" fill="none" />
        </g>
    );

    const SharedDefs = () => (
        <defs>
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                {/* Soft Bevel */}
                <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
                <feSpecularLighting in="blur" surfaceScale="2" specularConstant="0.8" specularExponent="15" lightingColor="#ffffff" result="specularOut">
                    <fePointLight x="-5000" y="-10000" z="20000" />
                </feSpecularLighting>
                <feComposite in="specularOut" in2="SourceAlpha" operator="in" result="specularComposite" />

                {/* Subtle Shading */}
                <feDiffuseLighting in="blur" surfaceScale="2" diffuseConstant="1" lightingColor="#ffffff" result="diffuseOut">
                    <feDistantLight azimuth="225" elevation="45" />
                </feDiffuseLighting>
                <feComposite in="diffuseOut" in2="SourceAlpha" operator="in" result="diffuseComposite" />

                {/* Combine: Multiply Shadow, Add Highlight */}
                <feComposite in="SourceGraphic" in2="diffuseComposite" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="shadedBase" />
                <feComposite in="specularComposite" in2="shadedBase" operator="over" result="finalBase" />
            </filter>

            {/* Shadow for the Logo on top of the tile */}
            <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodColor="rgba(0,0,0,0.2)" />
            </filter>

            {/* Gradient for Python */}
            <linearGradient id="pyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3776AB" />
                <stop offset="100%" stopColor="#3776AB" />
            </linearGradient>
        </defs>
    );

    switch (lowerName) {
        case "react":
            return (
                <svg {...commonProps}>
                    <SharedDefs />
                    <BaseTile />
                    <g transform="translate(16,15) scale(0.6)" filter={`url(#${shadowId})`}>
                        <circle r="11" fill="#61DAFB" /> {/* Background circle */}
                        <g stroke="white" strokeWidth="2" fill="none">
                            <ellipse rx="8" ry="3.2" />
                            <ellipse rx="8" ry="3.2" transform="rotate(60)" />
                            <ellipse rx="8" ry="3.2" transform="rotate(120)" />
                        </g>
                        <circle r="1.8" fill="white" />
                    </g>
                </svg>
            );

        case "next.js":
            return (
                <svg {...commonProps}>
                    <SharedDefs />
                    <BaseTile />
                    <g transform="translate(16,15) scale(0.7)" filter={`url(#${shadowId})`}>
                        <circle r="11" fill="#000000" />
                        <path d="M-2 -3.5 L-2 4.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M2.5 -3.5 V-0.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M-2 -3.5 L2.5 1.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M2.5 1.5 L2.5 4.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.4" />
                    </g>
                </svg>
            );

        case "ts": // TypeScript
        case "typescript":
            return (
                <svg {...commonProps}>
                    <SharedDefs />
                    <BaseTile />
                    <g transform="translate(16,15) scale(0.65)" filter={`url(#${shadowId})`}>
                        <rect x="-10" y="-10" width="20" height="20" rx="4" fill="#3178C6" />
                        <text x="0" y="5" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">TS</text>
                    </g>
                </svg>
            );

        case "three.js":
        case "threejs":
            return (
                <svg {...commonProps}>
                    <SharedDefs />
                    <BaseTile />
                    <g transform="translate(16,15) scale(0.65)" filter={`url(#${shadowId})`}>
                        <path d="M0 -10 L9 -5 L0 0 L-9 -5 Z" fill="#333" />
                        <path d="M-9 5 L0 10 V0 L-9 -5 Z" fill="#666" />
                        <path d="M9 5 L0 10 V0 L9 -5 Z" fill="#999" />
                    </g>
                </svg>
            );

        case "glsl":
            return (
                <svg {...commonProps}>
                    <SharedDefs />
                    <BaseTile />
                    <g transform="translate(16,15) scale(0.65)" filter={`url(#${shadowId})`}>
                        <defs>
                            <linearGradient id="glslGradTile" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#8E2DE2" />
                                <stop offset="100%" stopColor="#4A00E0" />
                            </linearGradient>
                        </defs>
                        <rect x="-10" y="-10" width="20" height="20" rx="4" fill="url(#glslGradTile)" />
                        <text x="0" y="4" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">GL</text>
                    </g>
                </svg>
            );

        case "python":
            return (
                <svg {...commonProps}>
                    <SharedDefs />
                    <BaseTile />
                    <g transform="translate(16,15) scale(0.65)" filter={`url(#${shadowId})`}>
                        <path d="M0 -9 C-5 -9 -5 -7 -5 -5 H0 V-3 H-7 V5 H-2 V9 C3 9 3 7 3 5 H-2 V3 H5 V-5 C5 -9 0 -9 0 -9 Z" fill="#3776AB" />
                        <circle cx="-2.5" cy="-6" r="1" fill="white" />
                        <path d="M0 9 C5 9 5 7 5 5 H0 V7 H7 V-1 H2 V-5 C-3 -5 -3 -3 -3 -1 H2 V1 H-5 V9 C-5 13 0 13 0 13 Z" fill="#FFD43B" transform="rotate(180)" />
                        <circle cx="2.5" cy="6" r="1" fill="white" />
                    </g>
                </svg>
            );

        case "tensorflow":
            return (
                <svg {...commonProps}>
                    <SharedDefs />
                    <BaseTile />
                    <g transform="translate(16,15) scale(0.65)" filter={`url(#${shadowId})`}>
                        <path d="M0 -10 L-7 -6 V4 L0 9 L7 4 V-6 L0 -10Z" fill="#FF6F00" />
                        <text x="0" y="3" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">TF</text>
                    </g>
                </svg>
            );

        case "figma":
            return (
                <svg {...commonProps}>
                    <SharedDefs />
                    <BaseTile />
                    <g transform="translate(16,15) scale(0.65)" filter={`url(#${shadowId})`}>
                        <circle cx="-3.5" cy="-5" r="3.5" fill="#F24E1E" />
                        <circle cx="3.5" cy="-5" r="3.5" fill="#FF7262" />
                        <circle cx="-3.5" cy="2" r="3.5" fill="#A259FF" />
                        <circle cx="3.5" cy="2" r="3.5" fill="#1ABCFE" />
                        <path d="M-3.5 9C-5.4 9 -7 7.4 -7 5.5V9H0V5.5C0 7.4 -1.6 9 -3.5 9Z" fill="#0ACF83" transform="translate(0,0)" /> {/* Adjusted path */}
                    </g>
                </svg>
            );

        default: // Generic Code
            return (
                <svg {...commonProps}>
                    <SharedDefs />
                    <BaseTile />
                    <g transform="translate(16,15) scale(0.6)" filter={`url(#${shadowId})`}>
                        <rect x="-8" y="-8" width="16" height="16" rx="4" fill="#333" />
                        <path d="M-3 -3 L0 0 L-3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 -3 L0 0 L3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                </svg>
            );
    }
};

export default TechIcon;
