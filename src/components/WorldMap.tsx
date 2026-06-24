'use client';

import { useMemo } from 'react';

const COUNTRY_COORDS: Record<string, [number, number]> = {
  'Bangladesh': [89.0, 23.7],
  'India': [78.9, 20.6],
  'United States': [-95.7, 37.1],
  'United Kingdom': [-3.4, 55.4],
  'Germany': [10.4, 51.2],
  'Canada': [-106.3, 56.1],
  'Australia': [133.8, -25.3],
  'France': [2.2, 46.2],
  'Japan': [138.3, 36.2],
  'Brazil': [-51.9, -14.2],
  'Russia': [105.3, 61.5],
  'China': [104.2, 35.9],
  'South Korea': [127.8, 35.9],
  'Singapore': [103.8, 1.4],
  'UAE': [53.8, 23.4],
  'Saudi Arabia': [45.1, 23.9],
  'Netherlands': [5.3, 52.1],
  'Italy': [12.6, 41.9],
  'Spain': [-3.7, 40.5],
  'Sweden': [18.6, 60.1],
  'Norway': [8.5, 60.5],
  'Pakistan': [69.3, 30.4],
  'Nepal': [84.1, 28.4],
  'Sri Lanka': [80.9, 7.9],
  'Turkey': [35.2, 38.9],
  'Indonesia': [113.9, -0.8],
  'Malaysia': [101.9, 4.2],
  'Thailand': [100.9, 15.9],
  'Philippines': [122.0, 12.9],
  'Vietnam': [108.3, 14.1],
  'Mexico': [-102.6, 23.6],
  'Argentina': [-63.6, -38.4],
  'South Africa': [22.9, -30.6],
  'Nigeria': [8.7, 9.1],
  'Egypt': [30.8, 26.8],
  'Kenya': [37.9, 0.0],
  'Poland': [19.1, 51.9],
  'Ukraine': [31.2, 48.4],
  'Israel': [34.8, 31.0],
  'Hong Kong': [114.2, 22.4],
  'Taiwan': [120.9, 23.7],
  'Ireland': [-8.2, 53.4],
  'Switzerland': [8.2, 46.8],
  'Portugal': [-8.2, 39.4],
  'Denmark': [9.5, 56.3],
  'Finland': [25.7, 61.9],
  'Czech Republic': [15.5, 49.8],
  'Romania': [24.9, 45.9],
  'Greece': [21.8, 39.1],
  'Chile': [-71.5, -35.7],
  'Colombia': [-74.3, 4.6],
  'Peru': [-75.0, -9.2],
};

interface WorldMapProps {
  countries: { _id: string; count: number }[];
  className?: string;
}

export default function WorldMap({ countries, className = '' }: WorldMapProps) {
  const maxCount = useMemo(() => Math.max(...countries.map(c => c.count), 1), [countries]);

  const getProjection = (lon: number, lat: number) => {
    const x = ((lon + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return { x, y };
  };

  const dots = countries
    .filter(c => COUNTRY_COORDS[c._id])
    .map(c => {
      const [lon, lat] = COUNTRY_COORDS[c._id];
      const { x, y } = getProjection(lon, lat);
      const radius = 3 + (c.count / maxCount) * 12;
      const opacity = 0.3 + (c.count / maxCount) * 0.7;
      return { ...c, x, y, radius, opacity };
    });

  return (
    <div className={`relative w-full overflow-hidden rounded-3xl ${className}`}>
      <svg
        viewBox="0 0 800 400"
        className="w-full h-auto"
        style={{ background: 'transparent' }}
      >
        {/* Grid lines */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <line key={`h${i}`} x1="0" y1={i * 57} x2="800" y2={i * 57} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(i => (
          <line key={`v${i}`} x1={i * 57} y1="0" x2={i * 57} y2="400" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        ))}

        {/* Simplified continent outlines */}
        <g fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8">
          {/* North America */}
          <path d="M 80,60 L 100,55 120,58 140,65 150,75 160,90 155,100 145,110 130,120 115,125 100,120 90,110 80,95 75,80 Z" />
          {/* South America */}
          <path d="M 170,180 L 185,175 200,180 210,200 215,220 210,250 200,270 185,280 170,275 165,255 160,230 165,200 Z" />
          {/* Europe */}
          <path d="M 370,55 L 385,52 400,58 410,50 420,55 415,65 405,70 395,72 380,68 370,62 Z" />
          {/* Africa */}
          <path d="M 370,150 L 390,145 410,150 420,170 425,200 420,230 405,250 385,255 370,240 365,210 360,180 Z" />
          {/* Asia */}
          <path d="M 420,45 L 460,40 500,45 540,50 580,55 620,60 640,70 650,85 640,100 620,110 590,115 560,120 530,125 500,130 470,135 450,130 430,120 420,100 415,80 Z" />
          {/* Australia */}
          <path d="M 600,240 L 630,235 660,240 675,255 670,270 650,280 625,280 610,270 600,255 Z" />
        </g>

        {/* Pulse rings for each dot */}
        {dots.map((d, i) => (
          <circle
            key={`pulse-${i}`}
            cx={d.x}
            cy={d.y}
            r={d.radius}
            fill="none"
            stroke="var(--accent, #a855f7)"
            strokeWidth="0.5"
            opacity="0.3"
          >
            <animate
              attributeName="r"
              values={`${d.radius};${d.radius + 8};${d.radius}`}
              dur="3s"
              repeatCount="indefinite"
              begin={`${i * 0.2}s`}
            />
            <animate
              attributeName="opacity"
              values="0.3;0;0.3"
              dur="3s"
              repeatCount="indefinite"
              begin={`${i * 0.2}s`}
            />
          </circle>
        ))}

        {/* Dots */}
        {dots.map((d, i) => (
          <g key={`dot-${i}`}>
            <circle
              cx={d.x}
              cy={d.y}
              r={d.radius}
              fill="var(--accent, #a855f7)"
              opacity={d.opacity}
            />
            <circle
              cx={d.x}
              cy={d.y}
              r={d.radius * 0.4}
              fill="white"
              opacity="0.9"
            />
          </g>
        ))}

        {/* Connection lines between top countries */}
        {dots.length >= 2 && dots.slice(0, 3).map((d, i) => {
          const next = dots[(i + 1) % Math.min(dots.length, 3)];
          return (
            <line
              key={`line-${i}`}
              x1={d.x}
              y1={d.y}
              x2={next.x}
              y2={next.y}
              stroke="var(--accent, #a855f7)"
              strokeWidth="0.5"
              opacity="0.15"
              strokeDasharray="4 4"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;8"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>
          );
        })}
      </svg>
    </div>
  );
}
