import React, { useState } from "react";
import {
  Box, Typography, Stack, Button, Chip, Grid, Card, CardContent, Fade, Tooltip,
} from "@mui/material";
import { ArrowBack, ZoomIn, Biotech, NavigateNext } from "@mui/icons-material";

type Level = "overview" | "wall" | "villus" | "cell" | "molecular";

const BREADCRUMB: Level[] = ["overview", "wall", "villus", "cell", "molecular"];
const LEVEL_LABELS: Record<Level, string> = {
  overview: "Digestive System",
  wall: "Intestinal Wall",
  villus: "Villus",
  cell: "Enterocyte",
  molecular: "Molecular",
};

/* ── SVG: Digestive System Overview ─────────────────────────────── */
function DigestiveSVG({ onDrill }: { onDrill: () => void }) {
  return (
    <svg viewBox="0 0 360 500" style={{ width: "100%", maxWidth: 380 }}>
      <defs>
        <radialGradient id="bodybg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#FFF8F0" />
          <stop offset="100%" stopColor="#FFEDE0" />
        </radialGradient>
        <linearGradient id="stomachG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F48FB1" /><stop offset="100%" stopColor="#E91E63" />
        </linearGradient>
        <linearGradient id="intestineG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4DD0E1" /><stop offset="100%" stopColor="#00838F" />
        </linearGradient>
        <linearGradient id="largeG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#CE93D8" /><stop offset="100%" stopColor="#7B1FA2" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <style>{`
          @keyframes gutPulse { 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.03)} }
          @keyframes ripple { 0%{r:30;opacity:.6} 100%{r:65;opacity:0} }
          .gut-pulse { animation: gutPulse 2s ease-in-out infinite; transform-origin: 180px 295px; }
          .ripple1 { animation: ripple 2.2s ease-out infinite; transform-origin: 180px 295px; }
          .ripple2 { animation: ripple 2.2s ease-out .7s infinite; transform-origin: 180px 295px; }
        `}</style>
      </defs>

      {/* Body silhouette */}
      <path d="M 80 40 Q 60 120 55 220 Q 50 380 90 480 L 270 480 Q 310 380 305 220 Q 300 120 280 40 Z" fill="url(#bodybg)" stroke="#F0C4A8" strokeWidth="2"/>

      {/* Oesophagus */}
      <rect x="168" y="40" width="24" height="80" rx="12" fill="#FFCC80" stroke="#FF9800" strokeWidth="1.5" />
      <text x="204" y="80" fontSize="10" fill="#E65100" fontWeight="600">Oesophagus</text>

      {/* Liver */}
      <path d="M 195 110 Q 265 105 270 155 Q 265 190 225 192 Q 198 180 195 155 Z" fill="#A1887F" stroke="#6D4C41" strokeWidth="1.5"/>
      <text x="220" y="152" textAnchor="middle" fontSize="10" fill="white" fontWeight="700">Liver</text>

      {/* Stomach */}
      <path d="M 145 100 Q 98 108 90 160 Q 85 210 125 218 Q 175 228 195 200 Q 215 165 198 105 Z" fill="url(#stomachG)" stroke="#C2185B" strokeWidth="1.5"/>
      <text x="142" y="162" textAnchor="middle" fontSize="10" fill="white" fontWeight="700">Stomach</text>

      {/* Large intestine */}
      <path d="M 108 228 L 108 408 Q 108 428 128 428 L 232 428 Q 252 428 252 408 L 252 228" stroke="url(#largeG)" strokeWidth="20" fill="none" strokeLinecap="round"/>
      <path d="M 108 228 Q 180 208 252 228" stroke="url(#largeG)" strokeWidth="20" fill="none" strokeLinecap="round"/>
      <text x="268" y="330" fontSize="9" fill="#7B1FA2" fontWeight="600">Large</text>
      <text x="268" y="342" fontSize="9" fill="#7B1FA2" fontWeight="600">Intestine</text>

      {/* Small intestine — CLICKABLE */}
      <g className="gut-pulse" style={{ cursor: "pointer" }} onClick={onDrill} role="button" aria-label="Explore small intestine">
        <circle cx="180" cy="295" r="30" className="ripple1" fill="none" stroke="rgba(0,188,212,0.3)" strokeWidth="1.5"/>
        <circle cx="180" cy="295" r="30" className="ripple2" fill="none" stroke="rgba(0,188,212,0.2)" strokeWidth="1.5"/>
        <ellipse cx="180" cy="265" rx="42" ry="16" stroke="url(#intestineG)" strokeWidth="11" fill="none" />
        <ellipse cx="174" cy="292" rx="38" ry="15" stroke="url(#intestineG)" strokeWidth="11" fill="none" />
        <ellipse cx="183" cy="317" rx="35" ry="14" stroke="url(#intestineG)" strokeWidth="11" fill="none" />
        <ellipse cx="178" cy="340" rx="30" ry="12" stroke="url(#intestineG)" strokeWidth="10" fill="none" />
        <rect x="120" y="242" width="120" height="118" rx="12" fill="rgba(0,188,212,0.07)" stroke="rgba(0,188,212,0.5)" strokeWidth="2" filter="url(#glow)"/>
        <text x="180" y="238" textAnchor="middle" fontSize="11" fill="#006064" fontWeight="800">Small Intestine</text>
        <text x="180" y="373" textAnchor="middle" fontSize="10" fill="#0097A7">👆 Tap to explore</text>
      </g>

      {/* Pancreas */}
      <rect x="102" y="212" width="55" height="14" rx="7" fill="#F48FB1" stroke="#EC407A" strokeWidth="1"/>
      <text x="100" y="240" fontSize="9" fill="#880E4F">Pancreas</text>

      {/* Rectum */}
      <rect x="168" y="428" width="24" height="38" rx="8" fill="#EF9A9A" stroke="#E53935" strokeWidth="1.5"/>
    </svg>
  );
}

/* ── SVG: Intestinal Wall Cross-Section ─────────────────────────── */
function IntestineWallSVG({ onDrill }: { onDrill: () => void }) {
  const villi = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * 2 * Math.PI;
    const cx = 200 + Math.cos(angle) * 120;
    const cy = 200 + Math.sin(angle) * 120;
    const rx = Math.cos(angle);
    const ry = Math.sin(angle);
    const len = 52;
    return { cx, cy, ex: cx - rx * len, ey: cy - ry * len, i };
  });
  return (
    <svg viewBox="0 0 400 420" style={{ width: "100%", maxWidth: 380 }}>
      <defs>
        <radialGradient id="lumenG" cx="50%" cy="50%" r="45%">
          <stop offset="0%" stopColor="#FFF9C4" /><stop offset="100%" stopColor="#FFF176" />
        </radialGradient>
        <style>{`
          @keyframes villusHover { 0%,100%{fill:#F48FB1} 50%{fill:#E91E63} }
          .villus-bar:hover { animation: villusHover .4s forwards; cursor: pointer; }
        `}</style>
      </defs>
      {/* Outer wall — serosa + muscularis */}
      <circle cx="200" cy="200" r="175" fill="#BCAAA4" stroke="#795548" strokeWidth="2"/>
      {/* Muscularis */}
      <circle cx="200" cy="200" r="155" fill="#EF9A9A" stroke="#E57373" strokeWidth="1.5"/>
      {/* Submucosa */}
      <circle cx="200" cy="200" r="138" fill="#F8BBD0" stroke="#EC407A" strokeWidth="1"/>
      {/* Mucosa */}
      <circle cx="200" cy="200" r="120" fill="#FCE4EC" stroke="#E91E63" strokeWidth="1"/>
      {/* Villi */}
      {villi.map(({ cx, cy, ex, ey, i }) => (
        <g key={i} onClick={onDrill} style={{ cursor: "pointer" }}>
          <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="#E91E63" strokeWidth="10" strokeLinecap="round" className="villus-bar"/>
          <circle cx={ex} cy={ey} r="6" fill="#C2185B" />
        </g>
      ))}
      {/* Lumen centre */}
      <circle cx="200" cy="200" r="64" fill="url(#lumenG)" stroke="#F9A825" strokeWidth="2"/>
      {/* Chyme particles */}
      {[[185,192],[210,200],[195,215],[207,185],[175,208]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={4+i%3} fill={["#FFCC02","#A5D6A7","#EF9A9A","#80DEEA","#FFAB40"][i]} opacity=".8"/>
      ))}
      <text x="200" y="204" textAnchor="middle" fontSize="11" fill="#F57F17" fontWeight="700">Lumen (Chyme)</text>
      {/* Labels */}
      <text x="200" y="20" textAnchor="middle" fontSize="12" fill="#37474F" fontWeight="800">Cross-Section View</text>
      <text x="10" y="175" fontSize="10" fill="#6D4C41" fontWeight="600">Serosa</text>
      <text x="10" y="190" fontSize="10" fill="#C62828">Muscularis</text>
      <text x="10" y="218" fontSize="10" fill="#E91E63">Mucosa</text>
      <text x="200" y="408" textAnchor="middle" fontSize="11" fill="#C2185B">👆 Click a villus to zoom in</text>
    </svg>
  );
}

/* ── SVG: Single Villus ──────────────────────────────────────────── */
function VillusSVG({ onDrill }: { onDrill: () => void }) {
  return (
    <svg viewBox="0 0 320 500" style={{ width: "100%", maxWidth: 340 }}>
      <defs>
        <linearGradient id="villusBodyG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFCDD2"/><stop offset="100%" stopColor="#EF9A9A"/>
        </linearGradient>
        <linearGradient id="capillaryG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EF5350"/><stop offset="100%" stopColor="#B71C1C"/>
        </linearGradient>
        <linearGradient id="lactealG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF9C4"/><stop offset="100%" stopColor="#F9A825"/>
        </linearGradient>
        <style>{`@keyframes flow { 0%{cy:80} 100%{cy:380} } .droplet { animation: flow 3s linear infinite; }`}</style>
      </defs>
      {/* Background */}
      <rect width="320" height="500" fill="#FFF3E0" rx="0"/>
      {/* Villus body */}
      <path d="M 110 380 Q 90 280 100 160 Q 110 80 160 55 Q 210 80 220 160 Q 230 280 210 380 Z" fill="url(#villusBodyG)" stroke="#E57373" strokeWidth="2"/>
      {/* Tip cap (rounded) */}
      <ellipse cx="160" cy="55" rx="50" ry="20" fill="#FFCDD2" stroke="#E53935" strokeWidth="1.5"/>
      {/* Microvilli / brush border at top */}
      {Array.from({length:18},(_,i)=>(
        <rect key={i} x={115+i*5} y={36} width={3} height={16} rx={1} fill="#E53935" opacity=".85"/>
      ))}
      <text x="160" y="29" textAnchor="middle" fontSize="9" fill="#B71C1C" fontWeight="700">Brush Border (Microvilli)</text>
      {/* Lacteal (lymph vessel) */}
      <path d="M 150 380 L 150 110 Q 150 80 160 75 Q 170 80 170 110 L 170 380 Z" fill="url(#lactealG)" opacity=".75"/>
      <text x="238" y="220" fontSize="9" fill="#F57F17" fontWeight="700">Lacteal</text>
      <line x1="170" y1="215" x2="234" y2="215" stroke="#F9A825" strokeWidth="1.5" strokeDasharray="3,2"/>
      {/* Blood capillary */}
      <path d="M 138 380 L 138 130 Q 138 90 148 80 Q 148 80 148 80" stroke="url(#capillaryG)" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path d="M 182 380 L 182 130 Q 182 90 172 80" stroke="url(#capillaryG)" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <text x="76" y="220" textAnchor="end" fontSize="9" fill="#C62828" fontWeight="700">Blood</text>
      <text x="76" y="230" textAnchor="end" fontSize="9" fill="#C62828" fontWeight="700">Capillary</text>
      <line x1="78" y1="220" x2="136" y2="220" stroke="#EF5350" strokeWidth="1.5" strokeDasharray="3,2"/>
      {/* Goblet cells */}
      {[[115,260],[115,310],[205,260],[205,310]].map(([x,y],i)=>(
        <path key={i} d={`M ${x} ${y} Q ${x-7} ${y-15} ${x} ${y-30} Q ${x+7} ${y-15} ${x} ${y}`} fill="#B2EBF2" stroke="#00ACC1" strokeWidth="1.5"/>
      ))}
      <text x="80" y="285" textAnchor="end" fontSize="9" fill="#006064" fontWeight="700">Goblet</text>
      <text x="80" y="295" textAnchor="end" fontSize="9" fill="#006064" fontWeight="700">cells</text>
      {/* Enterocyte cells (brick-like layer on surface) */}
      {[160,210,260,310].map((y,i)=>(
        <React.Fragment key={i}>
          <rect x="103" y={y} width="14" height="22" rx="2" fill="#FFCDD2" stroke="#E57373" strokeWidth="1" opacity=".9"/>
          <rect x="203" y={y} width="14" height="22" rx="2" fill="#FFCDD2" stroke="#E57373" strokeWidth="1" opacity=".9"/>
        </React.Fragment>
      ))}
      {/* Click zone */}
      <g onClick={onDrill} style={{ cursor: "pointer" }}>
        <rect x="103" y="145" width="14" height="22" rx="2" fill="#E91E63" opacity=".9"/>
        <circle cx="110" cy="145" r="14" fill="rgba(233,30,99,0.15)" stroke="#E91E63" strokeWidth="1.5"/>
        <text x="62" y="150" textAnchor="end" fontSize="9" fill="#E91E63" fontWeight="800">Enterocyte →</text>
      </g>
      <text x="160" y="440" textAnchor="middle" fontSize="11" fill="#E91E63">👆 Click enterocyte to explore the cell</text>
      {/* Lumen label */}
      <text x="160" y="490" textAnchor="middle" fontSize="10" fill="#795548">↑ Gut lumen (food / chyme above)</text>
      {/* Crypt at base */}
      <path d="M 110 380 Q 115 415 130 425 L 190 425 Q 205 415 210 380" fill="#FFCCBC" stroke="#FF7043" strokeWidth="1.5"/>
      <text x="160" y="418" textAnchor="middle" fontSize="9" fill="#BF360C">Crypt of Lieberkühn</text>
    </svg>
  );
}

/* ── SVG: Enterocyte Cell ────────────────────────────────────────── */
function CellSVG({ onDrill }: { onDrill: () => void }) {
  return (
    <svg viewBox="0 0 360 500" style={{ width: "100%", maxWidth: 360 }}>
      <defs>
        <linearGradient id="cellBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E3F2FD"/><stop offset="100%" stopColor="#BBDEFB"/>
        </linearGradient>
        <radialGradient id="nucleusG" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5C6BC0"/><stop offset="100%" stopColor="#1A237E"/>
        </radialGradient>
        <style>{`@keyframes mitoBeat{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}} .mito{animation:mitoBeat 1.8s ease-in-out infinite;transform-origin:center;}`}</style>
      </defs>
      {/* Cell body */}
      <rect x="55" y="80" width="250" height="380" rx="20" fill="url(#cellBg)" stroke="#1565C0" strokeWidth="3"/>
      {/* Apical membrane (top) */}
      <rect x="55" y="78" width="250" height="8" rx="4" fill="#1565C0"/>
      {/* Microvilli brush border */}
      {Array.from({length:22},(_,i)=>(
        <rect key={i} x={60+i*11} y={40} width={6} height={40} rx={3} fill={i%2===0?"#42A5F5":"#1E88E5"} opacity=".95"/>
      ))}
      <text x="180" y="32" textAnchor="middle" fontSize="10" fill="#0D47A1" fontWeight="800">Microvilli (Brush Border)</text>
      {/* Tight junction indicators */}
      <rect x="55" y="85" width="10" height="12" rx="2" fill="#FFF176" stroke="#F9A825" strokeWidth="1.5"/>
      <rect x="295" y="85" width="10" height="12" rx="2" fill="#FFF176" stroke="#F9A825" strokeWidth="1.5"/>
      <text x="180" y="115" textAnchor="middle" fontSize="9" fill="#E65100">— Tight junction (ZO proteins) —</text>
      {/* Nucleus */}
      <ellipse cx="180" cy="280" rx="62" ry="52" fill="url(#nucleusG)" stroke="#283593" strokeWidth="2"/>
      <text x="180" y="285" textAnchor="middle" fontSize="11" fill="white" fontWeight="800">Nucleus</text>
      <text x="180" y="298" textAnchor="middle" fontSize="9" fill="#C5CAE9">(DNA / gene expression)</text>
      {/* Mitochondria x3 */}
      {[[95,180],[260,185],[90,355]].map(([x,y],i)=>(
        <g key={i} className="mito">
          <ellipse cx={x} cy={y} rx={26} ry={14} fill="#FF8F00" stroke="#E65100" strokeWidth="1.5"/>
          <ellipse cx={x} cy={y} rx={16} ry={8} fill="#FFB300" opacity=".6"/>
          <text x={x} y={y+4} textAnchor="middle" fontSize="8" fill="white" fontWeight="700">ATP</text>
        </g>
      ))}
      <text x="95" y="158" textAnchor="middle" fontSize="8" fill="#E65100">Mitochondria</text>
      {/* Endoplasmic reticulum */}
      <path d="M 240 200 Q 275 215 270 240 Q 265 265 240 270 Q 215 275 210 255 Q 205 235 225 220" stroke="#66BB6A" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <text x="290" y="240" fontSize="8" fill="#2E7D32" fontWeight="600">ER</text>
      {/* Golgi */}
      {[0,1,2].map(i=>(
        <path key={i} d={`M 90 ${235+i*12} Q 120 ${230+i*12} 140 ${235+i*12}`} stroke="#AB47BC" strokeWidth={4-i} fill="none" strokeLinecap="round"/>
      ))}
      <text x="77" y="230" textAnchor="end" fontSize="8" fill="#6A1B9A">Golgi</text>
      {/* SGLT1 transporter — CLICKABLE */}
      <g onClick={onDrill} style={{ cursor: "pointer" }}>
        <rect x="145" y="75" width="30" height="18" rx="5" fill="#E91E63" stroke="#880E4F" strokeWidth="1.5"/>
        <text x="160" y="87" textAnchor="middle" fontSize="7.5" fill="white" fontWeight="800">SGLT1</text>
        <circle cx="160" cy="74" r="12" fill="rgba(233,30,99,0.15)" stroke="#E91E63" strokeWidth="1.5"/>
        <text x="160" y="60" textAnchor="middle" fontSize="9" fill="#E91E63" fontWeight="700">↑ Tap transporter</text>
      </g>
      {/* Basal membrane */}
      <rect x="55" y="452" width="250" height="8" rx="4" fill="#1565C0"/>
      <text x="180" y="475" textAnchor="middle" fontSize="9" fill="#1565C0">Basolateral membrane → blood</text>
      {/* Lysosomes */}
      <circle cx="250" cy="355" r="14" fill="#F06292" stroke="#C2185B" strokeWidth="1.5"/>
      <text x="250" y="359" textAnchor="middle" fontSize="8" fill="white">Lys.</text>
    </svg>
  );
}

/* ── SVG: Molecular Absorption ───────────────────────────────────── */
function MolecularSVG() {
  const molecules = [
    { x: 80,  y: 60,  label: "Glucose",       shape: "hex",  color: "#FFD600", textColor: "#5D4037" },
    { x: 240, y: 80,  label: "Fructose",      shape: "hex",  color: "#FFCA28", textColor: "#5D4037" },
    { x: 150, y: 55,  label: "Sucrase",       shape: "star", color: "#EF5350", textColor: "white"  },
    { x: 60,  y: 150, label: "Alanine",       shape: "circle", color: "#66BB6A", textColor: "white" },
    { x: 270, y: 140, label: "Leucine",       shape: "circle", color: "#43A047", textColor: "white" },
    { x: 180, y: 130, label: "Peptidase",     shape: "star", color: "#FF7043", textColor: "white"  },
    { x: 70,  y: 240, label: "Fatty acid",    shape: "wave",  color: "#FFA726", textColor: "white" },
    { x: 240, y: 230, label: "Glycerol",      shape: "circle", color: "#FFB74D", textColor: "white" },
    { x: 160, y: 210, label: "Lipase",        shape: "star", color: "#8D6E63", textColor: "white"  },
    { x: 90,  y: 330, label: "Lactobacillus", shape: "rod",   color: "#7E57C2", textColor: "white" },
    { x: 230, y: 320, label: "Bacteroides",   shape: "rod",   color: "#5C6BC0", textColor: "white" },
    { x: 160, y: 310, label: "H₂O",           shape: "drop",  color: "#29B6F6", textColor: "white" },
  ];

  const renderShape = (m: typeof molecules[0]) => {
    if (m.shape === "hex") return (
      <polygon points={`${m.x},${m.y-18} ${m.x+16},${m.y-9} ${m.x+16},${m.y+9} ${m.x},${m.y+18} ${m.x-16},${m.y+9} ${m.x-16},${m.y-9}`} fill={m.color} stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>
    );
    if (m.shape === "star") {
      const pts = Array.from({length:10},(_,i)=>{
        const a = (i*36-90)*Math.PI/180, r = i%2===0?22:10;
        return `${m.x+r*Math.cos(a)},${m.y+r*Math.sin(a)}`;
      }).join(" ");
      return <polygon points={pts} fill={m.color}/>;
    }
    if (m.shape === "rod") return <ellipse cx={m.x} cy={m.y} rx={24} ry={12} fill={m.color} stroke="rgba(0,0,0,0.1)" strokeWidth="1"/>;
    if (m.shape === "wave") return <path d={`M ${m.x-22} ${m.y} Q ${m.x-10} ${m.y-14} ${m.x} ${m.y} Q ${m.x+10} ${m.y+14} ${m.x+22} ${m.y}`} stroke={m.color} strokeWidth="5" fill="none" strokeLinecap="round"/>;
    if (m.shape === "drop") return <path d={`M ${m.x} ${m.y-20} Q ${m.x+15} ${m.y} ${m.x} ${m.y+20} Q ${m.x-15} ${m.y} ${m.x} ${m.y-20} Z`} fill={m.color}/>;
    return <circle cx={m.x} cy={m.y} r={18} fill={m.color} stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>;
  };

  return (
    <svg viewBox="0 0 330 440" style={{ width: "100%", maxWidth: 360 }}>
      <defs>
        <linearGradient id="molBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8F5E9"/><stop offset="100%" stopColor="#E3F2FD"/>
        </linearGradient>
        <style>{`
          @keyframes floatMol {
            0%{transform:translateY(0px)} 50%{transform:translateY(-8px)} 100%{transform:translateY(0px)}
          }
          .mol { animation: floatMol var(--dur,3s) ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
        `}</style>
      </defs>
      <rect width="330" height="440" fill="url(#molBg)"/>
      {/* Brush border at top */}
      {Array.from({length:20},(_,i)=><rect key={i} x={5+i*16} y={370} width={7} height={40} rx={3} fill="#1E88E5" opacity=".8"/>)}
      {/* Membrane */}
      <rect x="0" y="408" width="330" height="10" fill="#1565C0" opacity=".85"/>
      <text x="165" y="430" textAnchor="middle" fontSize="9" fill="#0D47A1" fontWeight="700">Apical cell membrane</text>
      {/* SGLT1 transporters in membrane */}
      {[60,160,260].map(x=>(
        <g key={x}>
          <rect x={x-14} y={398} width={28} height={20} rx={6} fill="#E91E63" stroke="#880E4F" strokeWidth="1.5"/>
          <text x={x} y={411} textAnchor="middle" fontSize="7.5" fill="white" fontWeight="800">SGLT1</text>
          <line x1={x} y1={370} x2={x} y2={398} stroke="#E91E63" strokeWidth="2" strokeDasharray="3,2"/>
        </g>
      ))}
      {/* Legend header */}
      <text x="165" y="20" textAnchor="middle" fontSize="12" fill="#1A237E" fontWeight="800">Luminal Absorption</text>
      <text x="165" y="34" textAnchor="middle" fontSize="9" fill="#37474F">Nutrients & digestive molecules</text>
      {/* Molecules */}
      {molecules.map((m, i) => (
        <g key={i} className="mol" style={{ "--dur": `${2.2+i*0.3}s` } as React.CSSProperties}>
          {renderShape(m)}
          <text x={m.x} y={m.y + (m.shape==="wave"?16:m.shape==="hex"?5:m.shape==="star"?4:4)} textAnchor="middle" fontSize="8" fill={m.textColor} fontWeight="700">{m.label}</text>
        </g>
      ))}
      {/* Arrows showing movement downward to membrane */}
      {[80,160,240].map(x=>(
        <path key={x} d={`M ${x} 280 L ${x} 360`} stroke="rgba(0,0,0,0.15)" strokeWidth="2" markerEnd="url(#arr)" strokeDasharray="5,3"/>
      ))}
      <defs><marker id="arr" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M 0 0 L 6 3 L 0 6 Z" fill="rgba(0,0,0,0.3)"/></marker></defs>
    </svg>
  );
}

/* ── Level Data ─────────────────────────────────────────────────── */
const LEVELS: Record<Level, {
  title: string; subtitle: string; description: string;
  facts: { label: string; value: string; color: string }[];
  concepts: string[]; next?: Level;
}> = {
  overview: {
    title: "The Gastrointestinal Tract",
    subtitle: "~9 metres of remarkable biology",
    description:
      "The human gut is one of the most complex organ systems in the body, stretching approximately 9 metres from mouth to anus. It breaks down food, absorbs nutrients, and hosts 70% of the immune system. The small intestine alone has a surface area of ~250 m² — the size of a tennis court.",
    facts: [
      { label: "Length", value: "~6–7 m", color: "#00ACC1" },
      { label: "Surface Area", value: "250 m²", color: "#E91E63" },
      { label: "Gut Bacteria", value: "38 trillion", color: "#7B1FA2" },
      { label: "Neurons", value: "500 million", color: "#F57C00" },
    ],
    concepts: ["Peristalsis", "Chyme", "Bile Salts", "Pancreatic Enzymes", "Ileocaecal Valve", "Enteric Nervous System"],
    next: "wall",
  },
  wall: {
    title: "The Intestinal Wall",
    subtitle: "Four tissue layers working in concert",
    description:
      "The wall of the small intestine consists of four concentric layers: the innermost mucosa (with villi), the submucosa (blood vessels, nerves), the muscularis (circular and longitudinal smooth muscle for peristalsis), and the serosa (protective outer layer). The circular folds (plicae circulares) amplify surface area 3-fold.",
    facts: [
      { label: "Layers", value: "4", color: "#E91E63" },
      { label: "Villi per cm²", value: "~20–40", color: "#00ACC1" },
      { label: "Renewal", value: "3–5 days", color: "#2E7D32" },
      { label: "Fold increase", value: "3×", color: "#F57C00" },
    ],
    concepts: ["Mucosa", "Submucosa", "Muscularis", "Serosa", "Plicae Circulares", "Muscularis Mucosae"],
    next: "villus",
  },
  villus: {
    title: "The Intestinal Villus",
    subtitle: "Finger-like projections that maximise absorption",
    description:
      "Each villus is a finger-like projection 0.5–1.6 mm tall, covered by a single layer of epithelial cells (enterocytes). Inside each villus runs a central lacteal (lymph vessel for fat absorption) surrounded by a dense capillary network for glucose and amino acid absorption. Goblet cells secrete protective mucus.",
    facts: [
      { label: "Height", value: "0.5–1.6 mm", color: "#E91E63" },
      { label: "Cells / villus", value: "~3,000", color: "#1565C0" },
      { label: "Surface gain", value: "10×", color: "#2E7D32" },
      { label: "Renewal", value: "3 days", color: "#F57C00" },
    ],
    concepts: ["Enterocyte", "Goblet Cell", "Lacteal", "Capillary", "Crypt of Lieberkühn", "Brush Border"],
    next: "cell",
  },
  cell: {
    title: "The Enterocyte",
    subtitle: "The absorptive workhorse of the gut",
    description:
      "Each enterocyte is a polarised epithelial cell with a dense apical brush border of ~1,000 microvilli (increasing surface area by a further 20×). The cell contains abundant mitochondria to power active transport. Tight junctions (ZO-1, occludin) prevent paracellular leakage. SGLT1 cotransports glucose and Na⁺ together.",
    facts: [
      { label: "Microvilli/cell", value: "~1,000", color: "#1565C0" },
      { label: "Surface gain", value: "20×", color: "#E91E63" },
      { label: "Glucose/sec", value: "10⁸ molecules", color: "#2E7D32" },
      { label: "Lifespan", value: "3–5 days", color: "#F57C00" },
    ],
    concepts: ["SGLT1 transporter", "GLUT5 (fructose)", "Tight junction", "Na⁺/K⁺-ATPase", "FABP (fatty acid binding)", "Chylomicron"],
    next: "molecular",
  },
  molecular: {
    title: "Molecular Absorption",
    subtitle: "Nutrients crossing the brush border",
    description:
      "At the molecular level, different nutrients use distinct mechanisms: glucose and galactose via SGLT1 (Na⁺-coupled active transport); fructose via GLUT5 (facilitated diffusion); amino acids via specific cotransporters; fatty acids by simple diffusion after micelle formation with bile salts. The gut microbiome ferments undigested fibres into short-chain fatty acids (butyrate, propionate, acetate).",
    facts: [
      { label: "Glucose transporters", value: "SGLT1 + GLUT2", color: "#FFD600" },
      { label: "Fat pathway", value: "Micelles → Chylomicrons", color: "#FFA726" },
      { label: "Microbiome SCFAs", value: "Butyrate, Propionate", color: "#7E57C2" },
      { label: "Water absorbed", value: "~8 L / day", color: "#29B6F6" },
    ],
    concepts: ["SGLT1", "GLUT5", "Micelle", "Chylomicron", "Butyrate", "Short-chain fatty acids", "Secretory IgA"],
    next: undefined,
  },
};

/* ── Main Component ─────────────────────────────────────────────── */
export default function GutSeries() {
  const [level, setLevel] = useState<Level>("overview");
  const [animKey, setAnimKey] = useState(0);

  const drillIn = (next: Level) => { setLevel(next); setAnimKey(k => k + 1); };
  const drillOut = (target: Level) => { setLevel(target); setAnimKey(k => k + 1); };

  const data = LEVELS[level];
  const currentIdx = BREADCRUMB.indexOf(level);

  return (
    <Box>
      {/* ── Hero Banner ── */}
      <Box
        sx={{
          borderRadius: 3, mb: 3, p: { xs: 2.5, md: 3.5 },
          background: "linear-gradient(135deg, #0A1628 0%, #0D3D5F 50%, #00695C 100%)",
          color: "white", position: "relative", overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", bgcolor: "rgba(0,200,180,0.08)" }} />
        <Box sx={{ position: "absolute", bottom: -30, left: "30%", width: 150, height: 150, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.04)" }} />
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Chip label="🔬 Gut Specialist Series" size="small" sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "white", mb: 1.5, fontWeight: 700 }} />
            <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1.15 }}>
              Gastrointestinal Biology
            </Typography>
            <Typography sx={{ opacity: 0.75, mt: 0.5, fontSize: 14 }}>
              Interactive drill-down from organ → molecule
            </Typography>
          </Box>
          <Biotech sx={{ fontSize: 48, opacity: 0.3 }} />
        </Stack>

        {/* Breadcrumb trail */}
        <Stack direction="row" spacing={0.5} alignItems="center" mt={2} flexWrap="wrap">
          {BREADCRUMB.map((l, i) => (
            <React.Fragment key={l}>
              {i > 0 && <NavigateNext sx={{ fontSize: 14, opacity: 0.4 }} />}
              <Chip
                label={LEVEL_LABELS[l]}
                size="small"
                onClick={i < currentIdx ? () => drillOut(l) : undefined}
                sx={{
                  cursor: i < currentIdx ? "pointer" : "default",
                  bgcolor: l === level ? "rgba(255,255,255,0.9)" : i < currentIdx ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
                  color: l === level ? "#0A1628" : "rgba(255,255,255,0.7)",
                  fontWeight: l === level ? 800 : 500,
                  fontSize: 11,
                  height: 24,
                  transition: "all 0.2s",
                }}
              />
            </React.Fragment>
          ))}
        </Stack>
      </Box>

      {/* ── Main Content ── */}
      <Fade key={animKey} in timeout={400}>
        <Grid container spacing={3} alignItems="flex-start">
          {/* Left: illustration */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
              <Box sx={{ background: "linear-gradient(180deg,#F3F8FF 0%,#EDF7F5 100%)", p: 2, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 380 }}>
                {level === "overview"  && <DigestiveSVG   onDrill={() => drillIn("wall")} />}
                {level === "wall"      && <IntestineWallSVG onDrill={() => drillIn("villus")} />}
                {level === "villus"    && <VillusSVG       onDrill={() => drillIn("cell")} />}
                {level === "cell"      && <CellSVG         onDrill={() => drillIn("molecular")} />}
                {level === "molecular" && <MolecularSVG />}
              </Box>
              {level !== "overview" && (
                <Box sx={{ p: 1.5, bgcolor: "#F5F5F5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Button size="small" startIcon={<ArrowBack />} onClick={() => drillOut(BREADCRUMB[currentIdx - 1])}>
                    Back to {LEVEL_LABELS[BREADCRUMB[currentIdx - 1]]}
                  </Button>
                  <Typography variant="caption" color="text.secondary">Level {currentIdx + 1} / {BREADCRUMB.length}</Typography>
                </Box>
              )}
            </Card>
          </Grid>

          {/* Right: info panel */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              {/* Title */}
              <Box>
                <Typography variant="h5" fontWeight={800} color="primary.dark">{data.title}</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>{data.subtitle}</Typography>
              </Box>

              {/* Description */}
              <Typography variant="body2" color="text.primary" lineHeight={1.75}>{data.description}</Typography>

              {/* Stats */}
              <Grid container spacing={1.5}>
                {data.facts.map((f) => (
                  <Grid item xs={6} key={f.label}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: f.color + "12", border: `1px solid ${f.color}30` }}>
                      <Typography variant="caption" color="text.secondary" display="block">{f.label}</Typography>
                      <Typography variant="body2" fontWeight={800} color={f.color}>{f.value}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Concepts */}
              <Box>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>Key Terms</Typography>
                <Stack direction="row" flexWrap="wrap" gap={0.75} mt={1}>
                  {data.concepts.map((c) => (
                    <Tooltip key={c} title={`Medical term: ${c}`} arrow>
                      <Chip label={c} size="small" variant="outlined" sx={{ fontSize: 11, fontWeight: 600, cursor: "help" }} />
                    </Tooltip>
                  ))}
                </Stack>
              </Box>

              {/* Drill-in CTA */}
              {data.next && (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ZoomIn />}
                  onClick={() => drillIn(data.next!)}
                  sx={{
                    borderRadius: 2, py: 1.5, fontWeight: 800,
                    background: "linear-gradient(90deg, #0A1628, #00695C)",
                    "&:hover": { background: "linear-gradient(90deg, #0D2137, #00897B)" },
                  }}
                >
                  Drill into {LEVEL_LABELS[data.next]} →
                </Button>
              )}
              {!data.next && (
                <Card sx={{ borderRadius: 2, bgcolor: "#E8F5E9" }}>
                  <CardContent sx={{ p: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Biotech color="success" />
                      <Box>
                        <Typography variant="body2" fontWeight={700} color="success.dark">You've reached the molecular level!</Typography>
                        <Typography variant="caption" color="text.secondary">From organ to molecule — the complete gut journey.</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Fade>
    </Box>
  );
}
