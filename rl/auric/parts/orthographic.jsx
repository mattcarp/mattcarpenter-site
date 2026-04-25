// Orthographic views of the recommended Pebble form.
// Bottom view (the part anyone ever sees) and side elevation.

function TechSheet({ title, sub, sheet, children }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--paper)',
      padding: '40px 56px',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--rule)', paddingBottom: 14}}>
        <div>
          <div className="display" style={{fontSize: 32, fontWeight: 300, lineHeight: 1}}>{title}</div>
          <div style={{fontSize: 13, color: 'var(--ink-2)', marginTop: 4}}>{sub}</div>
        </div>
        <div className="mono" style={{fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-3)', textAlign: 'right'}}>
          CAIRN · PEBBLE<br/>SHEET {sheet}
        </div>
      </div>
      <div style={{flex: 1, position: 'relative'}}>{children}</div>
    </div>
  );
}

// dimension-line helper
function Dim({ x1, y1, x2, y2, label, side = 'top', offset = 24 }) {
  const dx = x2 - x1, dy = y2 - y1;
  const isH = Math.abs(dx) > Math.abs(dy);
  const ox = isH ? 0 : (side === 'right' ? offset : -offset);
  const oy = isH ? (side === 'top' ? -offset : offset) : 0;
  return (
    <g stroke="#1a1816" strokeWidth="0.5" fontFamily="JetBrains Mono" fontSize="10" fill="#1a1816">
      <line x1={x1} y1={y1} x2={x1 + ox} y2={y1 + oy} />
      <line x1={x2} y1={y2} x2={x2 + ox} y2={y2 + oy} />
      <line x1={x1 + ox} y1={y1 + oy} x2={x2 + ox} y2={y2 + oy} markerStart="url(#arr)" markerEnd="url(#arr)" />
      <rect x={(x1 + x2) / 2 + ox - 22} y={(y1 + y2) / 2 + oy - 7} width="44" height="14" fill="#f4f1ec" stroke="none" />
      <text x={(x1 + x2) / 2 + ox} y={(y1 + y2) / 2 + oy + 3} textAnchor="middle" stroke="none" fontSize="10">{label}</text>
    </g>
  );
}

// callout label with leader
function Callout({ x, y, lx, ly, n, text }) {
  return (
    <g fontFamily="Inter Tight" fontSize="11" fill="#1a1816">
      <line x1={x} y1={y} x2={lx} y2={ly} stroke="#1a1816" strokeWidth="0.4" />
      <circle cx={x} cy={y} r="1.5" fill="#1a1816" />
      <circle cx={lx} cy={ly} r="9" fill="#f4f1ec" stroke="#1a1816" strokeWidth="0.5" />
      <text x={lx} y={ly + 3.5} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono">{n}</text>
      <text x={lx + 14} y={ly + 3} fontSize="11">{text}</text>
    </g>
  );
}

function Arrows() {
  return (
    <defs>
      <marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" fill="#1a1816" />
      </marker>
    </defs>
  );
}

// ─────────────── Bottom view (the only view a user really sees) ───────────────
function CairnOrthoFront() {
  return (
    <TechSheet title="Bottom view" sub="As seen from below · 1:2" sheet="03 / 09">
      <svg viewBox="0 0 1000 1000" width="100%" height="100%">
        <Arrows />
        <defs>
          <radialGradient id="ortho-body" cx="0.45" cy="0.4" r="0.7">
            <stop offset="0%" stopColor="#fdfaf5" />
            <stop offset="100%" stopColor="#dcd5c7" />
          </radialGradient>
          <radialGradient id="ortho-light" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fff4d8" />
            <stop offset="100%" stopColor="#e8d8b0" />
          </radialGradient>
        </defs>

        {/* center crosshairs */}
        <line x1="500" y1="60" x2="500" y2="940" stroke="#c9c3ba" strokeWidth="0.4" strokeDasharray="2 4" />
        <line x1="60" y1="500" x2="940" y2="500" stroke="#c9c3ba" strokeWidth="0.4" strokeDasharray="2 4" />

        {/* outer body */}
        <circle cx="500" cy="500" r="350" fill="url(#ortho-body)" stroke="#9d9482" strokeWidth="0.6" />
        {/* inner aperture (recessed light area) */}
        <circle cx="500" cy="500" r="200" fill="#1a1816" opacity="0.85" />
        <circle cx="500" cy="500" r="190" fill="url(#ortho-light)" />
        {/* center sensor port */}
        <circle cx="500" cy="500" r="3.5" fill="#1a1816" />

        {/* very subtle concentric reference */}
        <circle cx="500" cy="500" r="320" fill="none" stroke="#000" strokeWidth="0.2" opacity="0.2" />

        {/* dimensions */}
        <Dim x1={150} y1={500} x2={850} y2={500} label="⌀ 135.0" side="top" offset={-380} />
        <Dim x1={300} y1={500} x2={700} y2={500} label="⌀ 76.0 lens" side="top" offset={-300} />

        {/* callouts */}
        <Callout x={500} y={500} lx={650} ly={300} n="1" text="Photoelectric smoke chamber port" />
        <Callout x={620} y={420} lx={830} ly={380} n="2" text="LED downlight array (24× tunable)" />
        <Callout x={770} y={500} lx={900} ly={550} n="3" text="Soft-touch matte body, ⌀135mm" />
        <Callout x={500} y={770} lx={500} ly={900} n="4" text="CO sensor membrane (concealed)" />
      </svg>
    </TechSheet>
  );
}

// ─────────────── Side elevation ───────────────
function CairnOrthoSide() {
  return (
    <TechSheet title="Side elevation" sub="Mounted to ceiling · 1:2" sheet="04 / 09">
      <svg viewBox="0 0 1000 600" width="100%" height="100%">
        <Arrows />
        <defs>
          <linearGradient id="side-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dcd5c7" />
            <stop offset="100%" stopColor="#f0ebe0" />
          </linearGradient>
        </defs>

        {/* ceiling */}
        <rect x="100" y="60" width="800" height="40" fill="#ebe6df" stroke="#c9c3ba" strokeWidth="0.5" />
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#c9c3ba" strokeWidth="0.5" />
        </pattern>
        <rect x="100" y="60" width="800" height="40" fill="url(#hatch)" />
        <line x1="100" y1="100" x2="900" y2="100" stroke="#1a1816" strokeWidth="0.8" />

        {/* mounting plate (mostly hidden) */}
        <rect x="430" y="100" width="140" height="6" fill="#9d9482" />

        {/* device dome — pebble silhouette */}
        <path d="M325 106
                 C 325 106, 340 110, 360 112
                 C 400 116, 600 116, 640 112
                 C 660 110, 675 106, 675 106
                 L 670 138
                 C 670 156, 640 170, 500 172
                 C 360 170, 330 156, 330 138 Z"
              fill="url(#side-body)" stroke="#9d9482" strokeWidth="0.6" />

        {/* aperture lip on bottom */}
        <ellipse cx="500" cy="170" rx="105" ry="5" fill="none" stroke="#1a1816" strokeWidth="0.5" opacity="0.4" />
        <ellipse cx="500" cy="170" rx="100" ry="3" fill="#f5e7c4" opacity="0.4" />

        {/* dial nub */}
        <ellipse cx="675" cy="135" rx="3" ry="6" fill="#9d9482" stroke="#7a7164" strokeWidth="0.3" />
        <text x="685" y="138" fontFamily="JetBrains Mono" fontSize="9" fill="#1a1816">→ Kelvin dial</text>

        {/* USB-C indicator (hidden under bezel — leader points to it) */}
        <line x1="350" y1="160" x2="200" y2="220" stroke="#1a1816" strokeWidth="0.4" />
        <text x="100" y="226" fontFamily="Inter Tight" fontSize="11" fill="#1a1816">USB-C service port (battery only)</text>

        {/* dimensions */}
        <Dim x1={325} y1={106} x2={675} y2={106} label="⌀ 135" side="top" offset={-30} />
        <Dim x1={675} y1={106} x2={675} y2={170} label="34" side="right" offset={60} />
        <Dim x1={325} y1={170} x2={675} y2={170} label="aperture ⌀ 76" side="bottom" offset={50} />

        {/* light spill */}
        <path d="M380 172 L260 380" stroke="#d4623a" strokeWidth="0.4" strokeDasharray="3 3" opacity="0.5" />
        <path d="M620 172 L740 380" stroke="#d4623a" strokeWidth="0.4" strokeDasharray="3 3" opacity="0.5" />
        <text x="500" y="395" textAnchor="middle" fontFamily="Inter Tight" fontSize="11" fill="#7a7164" fontStyle="italic">120° illumination cone · ~400 lm @ 2.4m</text>
      </svg>
    </TechSheet>
  );
}

window.CairnOrthoFront = CairnOrthoFront;
window.CairnOrthoSide = CairnOrthoSide;
window.TechSheet = TechSheet;
window.OrthoArrows = Arrows;
window.OrthoDim = Dim;
window.OrthoCallout = Callout;
