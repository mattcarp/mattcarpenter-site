// Form studies — four variants on the minimal disc.
// Each shows: top-down view, side profile, one-line description, dimensions.
// All share the "quiet domestic" register but explore different solutions
// to the smoke vent / light aperture / dial problem.

function FormCard({ variant, name, tagline, descr, diameter, height, children }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--paper)',
      padding: '40px 44px 36px',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
      borderTop: '1px solid var(--rule)',
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <div className="mono" style={{fontSize: 11, letterSpacing: '0.14em', color: 'var(--ink-3)'}}>
          VARIANT {variant}
        </div>
        <div className="mono" style={{fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em'}}>
          02 / FORM
        </div>
      </div>
      <div className="display" style={{fontSize: 56, lineHeight: 1, marginTop: 14, fontWeight: 300}}>
        {name}
      </div>
      <div style={{fontSize: 14, color: 'var(--ink-2)', marginTop: 8, fontStyle: 'italic'}}>
        {tagline}
      </div>

      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0'}}>
        {children}
      </div>

      <div style={{borderTop: '1px solid var(--rule)', paddingTop: 14, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.45, minHeight: 64}}>
        {descr}
      </div>
      <div className="mono" style={{display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em', marginTop: 12}}>
        <span>⌀ {diameter}mm</span>
        <span>H {height}mm</span>
      </div>
    </div>
  );
}

// Helper — top-down view container with bottom-elevation strip
function TwoView({ topSize = 320, sideHeight = 60, top, side }) {
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28}}>
      <div style={{width: topSize, height: topSize, position: 'relative'}}>{top}</div>
      <div style={{width: topSize, height: sideHeight, position: 'relative'}}>{side}</div>
    </div>
  );
}

// ─────────────── A · HALO ───────────────
function CairnFormHalo() {
  return (
    <FormCard
      variant="A"
      name="Halo"
      tagline="Flush bezel, ring diffuser"
      diameter="140" height="22"
      descr="Light emerges from a 6mm continuous ring around a matte centre. Smoke vents hidden under the bezel lip. Confident, jewelry-like — premium hospitality energy."
    >
      <TwoView topSize={340} sideHeight={70}
        top={
          <svg viewBox="0 0 340 340" width="340" height="340">
            <defs>
              <radialGradient id="halo-c" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#fbf8f3" />
                <stop offset="100%" stopColor="#e0dacd" />
              </radialGradient>
            </defs>
            {/* outer rim shadow */}
            <circle cx="170" cy="170" r="160" fill="#000" opacity="0.04" />
            {/* outer body */}
            <circle cx="170" cy="170" r="156" fill="url(#halo-c)" stroke="#bbb2a4" strokeWidth="0.5" />
            {/* light ring (recessed) */}
            <circle cx="170" cy="170" r="142" fill="none" stroke="#1a1816" strokeWidth="2" opacity="0.4" />
            <circle cx="170" cy="170" r="138" fill="none" stroke="#f0e5c8" strokeWidth="6" />
            <circle cx="170" cy="170" r="134" fill="none" stroke="#1a1816" strokeWidth="0.6" opacity="0.3" />
            {/* center disc */}
            <circle cx="170" cy="170" r="128" fill="url(#halo-c)" />
            {/* sensor port — almost invisible */}
            <circle cx="170" cy="170" r="3" fill="#1a1816" opacity="0.4" />
            {/* hidden vent slots — radial */}
            {[...Array(36)].map((_, i) => {
              const a = (i / 36) * Math.PI * 2;
              const x1 = 170 + Math.cos(a) * 148;
              const y1 = 170 + Math.sin(a) * 148;
              const x2 = 170 + Math.cos(a) * 154;
              const y2 = 170 + Math.sin(a) * 154;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a1816" strokeWidth="0.4" opacity="0.3" />;
            })}
          </svg>
        }
        side={
          <svg viewBox="0 0 340 70" width="340" height="70">
            {/* ceiling */}
            <line x1="0" y1="8" x2="340" y2="8" stroke="#c9c3ba" />
            <rect x="40" y="8" width="260" height="3" fill="#c9c3ba" opacity="0.6" />
            {/* device — very thin */}
            <path d="M30 11 L310 11 L300 28 Q170 36 40 28 Z" fill="#e0dacd" stroke="#bbb2a4" strokeWidth="0.5" />
            {/* light glow under */}
            <ellipse cx="170" cy="40" rx="110" ry="6" fill="#f0e5c8" opacity="0.6" />
          </svg>
        }
      />
    </FormCard>
  );
}

// ─────────────── B · PEBBLE ───────────────
function CairnFormPebble() {
  return (
    <FormCard
      variant="B"
      name="Pebble"
      tagline="Soft dome, recessed downlight"
      diameter="135" height="34"
      descr="A river-stone silhouette. Downlight emerges from a softly recessed central aperture. Vents and dial integrated into the side band. Reads as residential, friendly, almost not a detector at all. Recommended."
    >
      <TwoView topSize={340} sideHeight={90}
        top={
          <svg viewBox="0 0 340 340" width="340" height="340">
            <defs>
              <radialGradient id="peb-t" cx="0.45" cy="0.4" r="0.7">
                <stop offset="0%" stopColor="#fdfaf5" />
                <stop offset="100%" stopColor="#dcd5c7" />
              </radialGradient>
              <radialGradient id="peb-light" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#fff4d8" />
                <stop offset="100%" stopColor="#e8d8b0" />
              </radialGradient>
            </defs>
            <circle cx="170" cy="170" r="160" fill="#000" opacity="0.04" />
            <circle cx="170" cy="170" r="156" fill="url(#peb-t)" />
            {/* recessed light aperture */}
            <circle cx="170" cy="170" r="92" fill="#1a1816" opacity="0.85" />
            <circle cx="170" cy="170" r="86" fill="url(#peb-light)" />
            {/* sensor microhole */}
            <circle cx="170" cy="170" r="2" fill="#000" opacity="0.5" />
            {/* concentric subtle ring (machined detail) */}
            <circle cx="170" cy="170" r="148" fill="none" stroke="#000" strokeWidth="0.3" opacity="0.15" />
          </svg>
        }
        side={
          <svg viewBox="0 0 340 90" width="340" height="90">
            <line x1="0" y1="6" x2="340" y2="6" stroke="#c9c3ba" />
            <rect x="40" y="6" width="260" height="3" fill="#c9c3ba" opacity="0.6" />
            {/* dome silhouette */}
            <path d="M40 9 Q40 9 60 12 Q170 -2 280 12 Q300 9 300 9 L300 32 Q170 52 40 32 Z" fill="#dcd5c7" stroke="#bbb2a4" strokeWidth="0.5" />
            {/* aperture lip */}
            <path d="M120 38 Q170 44 220 38" fill="none" stroke="#1a1816" strokeWidth="0.6" opacity="0.4" />
            {/* dial */}
            <circle cx="296" cy="22" r="3.5" fill="#a89e8c" />
            {/* light spill */}
            <ellipse cx="170" cy="60" rx="90" ry="10" fill="#f0e5c8" opacity="0.5" />
          </svg>
        }
      />
    </FormCard>
  );
}

// ─────────────── C · STACK ───────────────
function CairnFormStack() {
  return (
    <FormCard
      variant="C"
      name="Stack"
      tagline="Sectioned ring, honest layers"
      diameter="142" height="38"
      descr="Three visible discs — body, vent ring, light lens. Reads as an object you can disassemble (and you can — for sensor module replacement). More technical, well-suited to industrial install."
    >
      <TwoView topSize={340} sideHeight={90}
        top={
          <svg viewBox="0 0 340 340" width="340" height="340">
            <defs>
              <radialGradient id="stk-t" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#f5f0e6" />
                <stop offset="100%" stopColor="#cfc7b6" />
              </radialGradient>
            </defs>
            <circle cx="170" cy="170" r="160" fill="#000" opacity="0.04" />
            <circle cx="170" cy="170" r="158" fill="url(#stk-t)" />
            {/* vent ring */}
            <circle cx="170" cy="170" r="138" fill="#bdb4a3" />
            {[...Array(72)].map((_, i) => {
              const a = (i / 72) * Math.PI * 2;
              const x1 = 170 + Math.cos(a) * 122;
              const y1 = 170 + Math.sin(a) * 122;
              const x2 = 170 + Math.cos(a) * 134;
              const y2 = 170 + Math.sin(a) * 134;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a1816" strokeWidth="0.6" opacity="0.5" />;
            })}
            {/* lens */}
            <circle cx="170" cy="170" r="118" fill="#1a1816" opacity="0.85" />
            <circle cx="170" cy="170" r="113" fill="#f5e7c4" />
            <circle cx="170" cy="170" r="113" fill="none" stroke="#000" strokeWidth="0.4" opacity="0.3" />
            {/* test button — small dot */}
            <circle cx="170" cy="170" r="4" fill="#1a1816" opacity="0.3" />
          </svg>
        }
        side={
          <svg viewBox="0 0 340 90" width="340" height="90">
            <line x1="0" y1="6" x2="340" y2="6" stroke="#c9c3ba" />
            {/* layer 1 — body */}
            <rect x="40" y="9" width="260" height="14" fill="#cfc7b6" stroke="#9d9482" strokeWidth="0.4" />
            {/* layer 2 — vent ring (slightly smaller) */}
            <rect x="50" y="23" width="240" height="10" fill="#bdb4a3" stroke="#9d9482" strokeWidth="0.4" />
            {[...Array(40)].map((_, i) => (
              <line key={i} x1={56 + i * 6} y1={25} x2={56 + i * 6} y2={31} stroke="#1a1816" strokeWidth="0.4" opacity="0.5" />
            ))}
            {/* layer 3 — lens */}
            <rect x="60" y="33" width="220" height="9" fill="#f5e7c4" stroke="#9d9482" strokeWidth="0.4" />
            {/* dial */}
            <circle cx="305" cy="16" r="3" fill="#a89e8c" />
            <ellipse cx="170" cy="60" rx="100" ry="8" fill="#f0e5c8" opacity="0.5" />
          </svg>
        }
      />
    </FormCard>
  );
}

// ─────────────── D · TIER ───────────────
function CairnFormTier() {
  return (
    <FormCard
      variant="D"
      name="Tier"
      tagline="Recessed downlight aperture"
      diameter="138" height="30"
      descr="Subtly stepped face, like a recessed downlight. The aperture sits in shadow — light feels architectural, not bolted-on. Excellent for hotel corridors and offices."
    >
      <TwoView topSize={340} sideHeight={90}
        top={
          <svg viewBox="0 0 340 340" width="340" height="340">
            <defs>
              <radialGradient id="tier-t" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#f7f2e9" />
                <stop offset="100%" stopColor="#d6cebd" />
              </radialGradient>
              <radialGradient id="tier-shadow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#000" stopOpacity="0.6" />
                <stop offset="80%" stopColor="#000" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#000" stopOpacity="0.05" />
              </radialGradient>
            </defs>
            <circle cx="170" cy="170" r="160" fill="#000" opacity="0.04" />
            <circle cx="170" cy="170" r="158" fill="url(#tier-t)" />
            {/* step 1 shadow */}
            <circle cx="170" cy="170" r="120" fill="url(#tier-shadow)" />
            {/* step 2 ring */}
            <circle cx="170" cy="170" r="115" fill="#a89e8c" />
            {/* deep aperture */}
            <circle cx="170" cy="170" r="100" fill="#1a1816" />
            <circle cx="170" cy="170" r="95" fill="#2a2520" />
            {/* tiny light disc */}
            <circle cx="170" cy="170" r="60" fill="#f5e7c4" opacity="0.7" />
            <circle cx="170" cy="170" r="60" fill="none" stroke="#000" strokeWidth="0.4" opacity="0.4" />
          </svg>
        }
        side={
          <svg viewBox="0 0 340 90" width="340" height="90">
            <line x1="0" y1="6" x2="340" y2="6" stroke="#c9c3ba" />
            <rect x="40" y="6" width="260" height="3" fill="#c9c3ba" opacity="0.6" />
            {/* outer body */}
            <path d="M40 9 L300 9 L295 24 L45 24 Z" fill="#d6cebd" stroke="#a89e8c" strokeWidth="0.4" />
            {/* step */}
            <path d="M70 24 L270 24 L262 36 L78 36 Z" fill="#a89e8c" stroke="#7a7164" strokeWidth="0.4" />
            {/* aperture */}
            <path d="M100 36 L240 36 L232 44 L108 44 Z" fill="#1a1816" />
            {/* light */}
            <ellipse cx="170" cy="44" rx="55" ry="3" fill="#f5e7c4" />
            {/* dial */}
            <circle cx="298" cy="16" r="3" fill="#a89e8c" />
            <ellipse cx="170" cy="60" rx="80" ry="9" fill="#f0e5c8" opacity="0.4" />
          </svg>
        }
      />
    </FormCard>
  );
}

window.CairnFormHalo = CairnFormHalo;
window.CairnFormPebble = CairnFormPebble;
window.CairnFormStack = CairnFormStack;
window.CairnFormTier = CairnFormTier;
