import React from 'react';
import { Anchor } from 'lucide-react';

export default function InteractiveRouteMap({ 
  height = 380, 
  routeDetails
}) {
  const origin = routeDetails?.origin_name || "Australia / Port of Hay Point";
  const destination = routeDetails?.destination_name || "Paradip Port, India";

  return (
    <div style={{ position: 'relative', width: '100%', height: `${height}px`, overflow: 'hidden', borderRadius: 'var(--radius-sm)' }}>
      {/* 3D Globe Maritime Visualization */}
      <svg
        viewBox="0 0 720 420"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          background: 'radial-gradient(ellipse at 50% 50%, #06172a 0%, #030b14 100%)'
        }}
      >
        <defs>
          {/* Atmosphere Outer Glow Filter */}
          <filter id="globeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Spherical Ocean Gradient */}
          <radialGradient id="oceanSphere" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#103254" />
            <stop offset="55%" stopColor="#081e35" />
            <stop offset="85%" stopColor="#051525" />
            <stop offset="100%" stopColor="#020a13" />
          </radialGradient>

          {/* Spherical Rim / Specular Atmosphere */}
          <radialGradient id="rimLighting" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#1d4ed8" stopOpacity="0.08" />
            <stop offset="80%" stopColor="#000000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
          </radialGradient>

          {/* Route Gradient */}
          <linearGradient id="globeRouteGradient" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>

          {/* Globe Clipping Circle to preserve true 3D sphere curvature */}
          <clipPath id="globeSphereClip">
            <circle cx="395" cy="210" r="185" />
          </clipPath>
        </defs>

        {/* Outer Atmospheric Glow Halo */}
        <circle cx="395" cy="210" r="190" fill="none" stroke="rgba(56, 189, 248, 0.18)" strokeWidth="6" filter="url(#globeGlow)" />
        <circle cx="395" cy="210" r="186" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1.5" />

        {/* Globe Body: Spherical Ocean Disc */}
        <circle cx="395" cy="210" r="185" fill="url(#oceanSphere)" />

        {/* Globe Elements Clipped to Sphere */}
        <g clipPath="url(#globeSphereClip)">
          {/* Spherical Graticules: Latitude Arcs */}
          <ellipse cx="395" cy="115" rx="155" ry="32" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="0.75" />
          <ellipse cx="395" cy="165" rx="180" ry="36" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="0.75" />
          {/* Equator */}
          <ellipse cx="395" cy="210" rx="185" ry="40" fill="none" stroke="rgba(56, 189, 248, 0.18)" strokeWidth="1" strokeDasharray="4 4" />
          <ellipse cx="395" cy="255" rx="180" ry="36" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="0.75" />
          <ellipse cx="395" cy="305" rx="155" ry="32" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="0.75" />

          {/* Spherical Graticules: Longitude Curved Meridians */}
          <ellipse cx="395" cy="210" rx="45" ry="185" fill="none" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="0.75" />
          <ellipse cx="395" cy="210" rx="95" ry="185" fill="none" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="0.75" />
          <ellipse cx="395" cy="210" rx="145" ry="185" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="0.75" />
          <line x1="395" y1="25" x2="395" y2="395" stroke="rgba(56, 189, 248, 0.14)" strokeWidth="0.75" />

          {/* Bathymetric Oceanic Watermark */}
          <text x="310" y="275" fill="rgba(56, 189, 248, 0.15)" fontSize="11" fontWeight="700" letterSpacing="4" fontFamily="sans-serif">
            INDIAN OCEAN
          </text>
          <text x="360" y="110" fill="rgba(56, 189, 248, 0.12)" fontSize="8.5" fontWeight="600" letterSpacing="2" fontFamily="sans-serif">
            BAY OF BENGAL
          </text>
          <text x="255" y="145" fill="rgba(56, 189, 248, 0.1)" fontSize="8" fontWeight="600" letterSpacing="2" fontFamily="sans-serif">
            ARABIAN SEA
          </text>

          {/* =================================================================
              LANDMASSES (Projected on Globe)
              ================================================================= */}

          {/* Arabian Peninsula & Horn of Africa (West) */}
          <path
            d="M 215 90 L 255 105 L 270 145 L 250 160 L 225 150 L 210 120 Z"
            fill="#122944"
            stroke="rgba(56, 189, 248, 0.3)"
            strokeWidth="1.2"
          />
          <path
            d="M 220 175 L 260 195 L 245 235 L 220 240 L 210 200 Z"
            fill="#122944"
            stroke="rgba(56, 189, 248, 0.3)"
            strokeWidth="1.2"
          />

          {/* INDIA Subcontinent (Center-North) */}
          <path
            d="M 285 45 L 320 48 L 360 58 L 372 82 L 350 98 L 338 135 L 324 168 L 312 185 L 298 160 L 285 120 L 275 75 Z"
            fill="#132e4d"
            stroke="rgba(56, 189, 248, 0.4)"
            strokeWidth="1.5"
          />

          {/* SRI LANKA Island (Teardrop off Southeast tip of India) */}
          <ellipse 
            cx="326" 
            cy="196" 
            rx="8" 
            ry="12" 
            fill="#132e4d" 
            stroke="rgba(56, 189, 248, 0.4)" 
            strokeWidth="1.2" 
          />

          {/* Southeast Asia / Myanmar / Malay Peninsula */}
          <path
            d="M 395 55 L 420 70 L 432 105 L 425 140 L 418 165 L 410 160 L 414 135 L 398 95 Z"
            fill="#122944"
            stroke="rgba(56, 189, 248, 0.3)"
            strokeWidth="1.2"
          />

          {/* INDONESIA Archipelago (Sumatra, Java) */}
          {/* Sumatra */}
          <path
            d="M 396 182 L 425 210 L 438 236 L 428 242 L 406 218 L 388 190 Z"
            fill="#132e4d"
            stroke="rgba(56, 189, 248, 0.4)"
            strokeWidth="1.2"
          />
          {/* Java */}
          <path
            d="M 442 244 L 485 248 L 505 250 L 500 256 L 452 254 Z"
            fill="#132e4d"
            stroke="rgba(56, 189, 248, 0.4)"
            strokeWidth="1.2"
          />

          {/* AUSTRALIA (North-West / Western Australia / Port of Hay Point Coast) */}
          <path
            d="M 480 282 L 515 268 L 555 265 L 575 292 L 570 348 L 518 368 L 472 335 L 476 298 Z"
            fill="#132e4d"
            stroke="rgba(56, 189, 248, 0.45)"
            strokeWidth="1.5"
          />

          {/* =================================================================
              MARITIME SHIPPING ROUTE (100% Water - Strictly Avoids All Land)
              Origin: Australia (Port of Hay Point) -> South of Indonesia ->
              Deep Indian Ocean -> East of Sri Lanka -> Bay of Bengal -> Paradip Port
              ================================================================= */}
          <path
            id="globeShippingPath"
            d="M 505 274 C 460 274, 420 268, 395 248 C 362 222, 342 182, 352 148 C 356 128, 354 110, 348 98"
            fill="none"
            stroke="url(#globeRouteGradient)"
            strokeWidth="3"
            strokeDasharray="6 4"
            filter="url(#routeGlow)"
          />

          {/* Animated Ship traversing along ocean route */}
          <g>
            <animateMotion 
              path="M 505 274 C 460 274, 420 268, 395 248 C 362 222, 342 182, 352 148 C 356 128, 354 110, 348 98"
              dur="12s" 
              repeatCount="indefinite" 
              rotate="auto"
            />
            <g transform="translate(-10, -7)">
              <ellipse cx="10" cy="7" rx="11" ry="6" fill="rgba(56, 189, 248, 0.25)" />
              <polygon points="2,5 18,5 15,10 5,10" fill="#38bdf8" />
              <rect x="7" y="2" width="6" height="3" fill="#ffffff" />
            </g>
          </g>

          {/* Origin Node: Australia / Port of Hay Point */}
          <g transform="translate(505, 274)">
            <circle cx="0" cy="0" r="12" fill="rgba(56, 189, 248, 0.25)" />
            <circle cx="0" cy="0" r="5" fill="#38bdf8" />
          </g>

          {/* Destination Node: Paradip Port, India */}
          <g transform="translate(348, 98)">
            <circle cx="0" cy="0" r="13" fill="rgba(244, 63, 94, 0.25)" />
            <circle cx="0" cy="0" r="5.5" fill="#f43f5e" />
          </g>

          {/* 3D Spherical Rim Overlay (Adds curved planetary horizon depth) */}
          <circle cx="395" cy="210" r="185" fill="url(#rimLighting)" pointerEvents="none" />
        </g>

        {/* =================================================================
            GEOGRAPHICAL & PORT LABELS (Cleanly positioned near route)
            ================================================================= */}

        {/* India Label */}
        <g transform="translate(292, 105)">
          <rect x="-4" y="-12" width="38" height="17" rx="3" fill="rgba(6, 17, 30, 0.75)" />
          <text x="15" y="0" fill="#f8fafc" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
            India
          </text>
        </g>

        {/* Paradip Port Destination Label */}
        <g transform="translate(362, 95)">
          <rect x="-5" y="-14" width="85" height="20" rx="4" fill="rgba(244, 63, 94, 0.2)" stroke="rgba(244, 63, 94, 0.5)" />
          <text x="37" y="0" fill="#ffffff" fontSize="10.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
            Paradip Port
          </text>
        </g>

        {/* Sri Lanka Label (Positioned safely west of Sri Lanka, opposite the route) */}
        <g transform="translate(262, 196)">
          <rect x="-4" y="-11" width="56" height="16" rx="3" fill="rgba(6, 17, 30, 0.75)" />
          <text x="24" y="1" fill="#94a3b8" fontSize="9.5" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
            Sri Lanka
          </text>
        </g>

        {/* Indonesia Label (Positioned on the islands, safely north of the shipping lane) */}
        <g transform="translate(425, 198)">
          <rect x="-4" y="-12" width="58" height="17" rx="3" fill="rgba(6, 17, 30, 0.75)" />
          <text x="25" y="0" fill="#94a3b8" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
            Indonesia
          </text>
        </g>

        {/* Australia / Port of Hay Point Label */}
        <g transform="translate(520, 275)">
          <rect x="-5" y="-14" width="160" height="22" rx="4" fill="rgba(37, 99, 235, 0.25)" stroke="rgba(56, 189, 248, 0.4)" />
          <text x="75" y="1" fill="#38bdf8" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
            Australia / Port of Hay Point
          </text>
        </g>

        {/* Ocean Route Waypoint Badge in Open Waters */}
        <g transform="translate(390, 235)">
          <rect x="-36" y="-10" width="72" height="18" rx="4" fill="rgba(6, 17, 30, 0.85)" stroke="rgba(56, 189, 248, 0.3)" />
          <text x="0" y="3" fill="#38bdf8" fontSize="8.5" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
            ~ 6,800 NM
          </text>
        </g>
      </svg>
    </div>
  );
}
