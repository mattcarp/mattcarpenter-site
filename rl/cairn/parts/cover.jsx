// Cover — concept overview, hero device + manifesto

function CairnCover() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #f4f1ec 0%, #ebe6df 100%)',
      padding: '80px 100px',
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: 80,
      position: 'relative',
    }}>
      {/* corner registration marks */}
      <CornerMark style={{top: 24, left: 24}} />
      <CornerMark style={{top: 24, right: 24}} flip="x" />
      <CornerMark style={{bottom: 24, left: 24}} flip="y" />
      <CornerMark style={{bottom: 24, right: 24}} flip="xy" />

      {/* left — text */}
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
        <div>
          <div className="mono" style={{fontSize: 13, color: 'var(--ink-3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 32}}>
            Project · 26-A04 / Ceiling safety + light
          </div>
          <h1 className="display" style={{fontSize: 132, lineHeight: 0.92, margin: 0, fontWeight: 300}}>
            Cairn.
          </h1>
          <div style={{fontSize: 22, lineHeight: 1.4, color: 'var(--ink-2)', maxWidth: 520, marginTop: 32, fontWeight: 300}}>
            A smoke and carbon&nbsp;monoxide detector that disappears into the ceiling,
            then quietly lights your way home.
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 60}}>
          <Spec label="Detects" value="Smoke + CO" sub="Photoelectric + electrochemical" />
          <Spec label="Illuminates" value="Motion-activated" sub="Tunable 2700–6000K downlight" />
          <Spec label="Powers" value="Mains or battery" sub="USB-C recharge · 18-month cell" />
          <Spec label="Adjusts" value="Mechanical dial" sub="Five-step Kelvin · no app, no wireless" />
        </div>

        <div className="mono" style={{fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em', marginTop: 60, display: 'flex', justifyContent: 'space-between'}}>
          <span>SHEET 01 / 09</span>
          <span>R.0 · 2026.04</span>
          <span>INDUSTRIAL DESIGN — INTERNAL</span>
        </div>
      </div>

      {/* right — hero render */}
      <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <HeroDevice />
      </div>
    </div>
  );
}

function CornerMark({ style = {}, flip }) {
  const sx = flip?.includes('x') ? -1 : 1;
  const sy = flip?.includes('y') ? -1 : 1;
  return (
    <svg width="28" height="28" style={{position: 'absolute', ...style, transform: `scale(${sx},${sy})`}}>
      <path d="M0 14 L14 14 L14 0" stroke="#1a1816" strokeWidth="1" fill="none" />
    </svg>
  );
}

function Spec({ label, value, sub }) {
  return (
    <div style={{borderTop: '1px solid var(--rule)', paddingTop: 12}}>
      <div className="mono" style={{fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-3)'}}>{label}</div>
      <div style={{fontSize: 22, fontWeight: 400, marginTop: 6, letterSpacing: '-0.01em'}}>{value}</div>
      <div style={{fontSize: 13, color: 'var(--ink-2)', marginTop: 2}}>{sub}</div>
    </div>
  );
}

// Hero — the "Pebble" form, soft dome, viewed from a 30° below angle
function HeroDevice() {
  return (
    <svg viewBox="0 0 600 600" width="100%" style={{maxWidth: 560}}>
      <defs>
        <radialGradient id="pebble-body" cx="0.45" cy="0.35" r="0.8">
          <stop offset="0%" stopColor="#fbf8f3" />
          <stop offset="55%" stopColor="#ebe5da" />
          <stop offset="100%" stopColor="#c9c1b3" />
        </radialGradient>
        <radialGradient id="pebble-rim" cx="0.5" cy="0.5" r="0.5">
          <stop offset="80%" stopColor="#a89e8c" stopOpacity="0" />
          <stop offset="100%" stopColor="#7a7164" stopOpacity="0.6" />
        </radialGradient>
        <radialGradient id="pebble-light" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff5dc" />
          <stop offset="60%" stopColor="#f5e7c4" />
          <stop offset="100%" stopColor="#d8c89e" />
        </radialGradient>
        <radialGradient id="pebble-glow" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#fff0c8" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fff0c8" stopOpacity="0" />
        </radialGradient>
        <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      {/* ceiling shadow */}
      <ellipse cx="300" cy="500" rx="220" ry="22" fill="#000" opacity="0.08" filter="url(#soft-shadow)" />

      {/* light spill on ground */}
      <ellipse cx="300" cy="510" rx="180" ry="14" fill="url(#pebble-glow)" />

      {/* main puck — perspective ellipse, viewed slightly from below */}
      {/* outer body */}
      <ellipse cx="300" cy="280" rx="240" ry="62" fill="url(#pebble-body)" />
      {/* side band (between top and bottom ellipse) */}
      <path d="M60 280 L60 300 A240 62 0 0 0 540 300 L540 280 Z" fill="#d6cebf" />
      {/* dome top */}
      <ellipse cx="300" cy="280" rx="240" ry="62" fill="url(#pebble-body)" />
      {/* light aperture (recessed) */}
      <ellipse cx="300" cy="298" rx="140" ry="36" fill="#1a1816" opacity="0.95" />
      <ellipse cx="300" cy="298" rx="132" ry="33" fill="url(#pebble-light)" />
      {/* center subtle vent ring */}
      <ellipse cx="300" cy="298" rx="70" ry="17" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.25" />
      {/* fine outer rim shadow */}
      <ellipse cx="300" cy="280" rx="240" ry="62" fill="url(#pebble-rim)" opacity="0.4" />

      {/* dial nub on side */}
      <ellipse cx="540" cy="290" rx="6" ry="9" fill="#9a9182" />

      {/* tiny smoke vents — top edge dots */}
      {[...Array(24)].map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const x = 300 + Math.cos(a) * 220;
        const y = 280 + Math.sin(a) * 56;
        if (y > 290) return null;
        return <circle key={i} cx={x} cy={y} r="1" fill="#000" opacity="0.15" />;
      })}

      {/* ceiling line */}
      <line x1="0" y1="220" x2="600" y2="220" stroke="#c9c3ba" strokeWidth="1" />
      <line x1="0" y1="223" x2="600" y2="223" stroke="#c9c3ba" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

window.CairnCover = CairnCover;
