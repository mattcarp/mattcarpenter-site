// In-context lifestyle artboard — hallway with two units installed and motion-activated light.

function CairnLifestyle() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #1f1c18 0%, #2a2620 60%, #3a342c 100%)',
      padding: '60px 80px',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <div className="mono" style={{fontSize: 11, letterSpacing: '0.14em', color: '#9c958a'}}>
          IN CONTEXT · RESIDENTIAL HALLWAY · 22:14
        </div>
        <div className="mono" style={{fontSize: 10, color: '#9c958a', letterSpacing: '0.1em'}}>
          SHEET 02 / 09
        </div>
      </div>

      <div style={{flex: 1, position: 'relative', marginTop: 20}}>
        <svg viewBox="0 0 1400 880" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="ll-ceil" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a3429" />
              <stop offset="100%" stopColor="#1f1c18" />
            </linearGradient>
            <linearGradient id="ll-floor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1f1c18" />
              <stop offset="100%" stopColor="#0a0908" />
            </linearGradient>
            <linearGradient id="ll-wall-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1f1c18" />
              <stop offset="100%" stopColor="#3a342c" />
            </linearGradient>
            <linearGradient id="ll-wall-r" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3a342c" />
              <stop offset="100%" stopColor="#1f1c18" />
            </linearGradient>
            <radialGradient id="spill" cx="0.5" cy="0" r="0.7">
              <stop offset="0%" stopColor="#fff0c8" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#f0c878" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* perspective hallway */}
          {/* ceiling */}
          <polygon points="0,0 1400,0 900,400 500,400" fill="url(#ll-ceil)" />
          {/* left wall */}
          <polygon points="0,0 500,400 500,720 0,880" fill="url(#ll-wall-l)" />
          {/* right wall */}
          <polygon points="1400,0 900,400 900,720 1400,880" fill="url(#ll-wall-r)" />
          {/* floor */}
          <polygon points="500,720 900,720 1400,880 0,880" fill="url(#ll-floor)" />

          {/* vanishing perspective lines (subtle) */}
          {[0.2, 0.4, 0.6, 0.8].map((t, i) => (
            <line key={i} x1={0} y1={880 * (1 - t)} x2={500 + 400 * t} y2={400 + (720 - 400) * t} stroke="#000" strokeWidth="0.5" opacity="0.3" />
          ))}

          {/* far unit — small, off */}
          <g transform="translate(700 320) scale(0.5)">
            <ellipse cx="0" cy="0" rx="60" ry="14" fill="#3a342c" stroke="#1a1816" strokeWidth="0.4" />
            <ellipse cx="0" cy="6" rx="35" ry="5" fill="#0a0908" />
          </g>

          {/* near unit — active, lighting */}
          <g transform="translate(560 220)">
            {/* light spill cone — first so device sits over it */}
            <path d="M -120 24 L -260 760 L 260 760 L 120 24 Z" fill="url(#spill)" />
            {/* device */}
            <ellipse cx="0" cy="0" rx="120" ry="26" fill="#dcd5c7" stroke="#9d9482" strokeWidth="0.5" />
            <path d="M-120 0 L-120 18 Q0 38 120 18 L120 0" fill="#dcd5c7" stroke="#9d9482" strokeWidth="0.5" />
            <ellipse cx="0" cy="22" rx="76" ry="9" fill="#1a1816" opacity="0.9" />
            <ellipse cx="0" cy="22" rx="72" ry="7" fill="#fff5d8" />
            {/* glow */}
            <ellipse cx="0" cy="22" rx="120" ry="14" fill="#fff0c8" opacity="0.4" filter="blur(8)" />
          </g>

          {/* floor light pool */}
          <ellipse cx="560" cy="780" rx="240" ry="30" fill="#fff0c8" opacity="0.25" />
          <ellipse cx="560" cy="780" rx="160" ry="20" fill="#fff5d8" opacity="0.35" />

          {/* tiny figure walking through (motion trigger) */}
          <g transform="translate(420 640)" opacity="0.85">
            <ellipse cx="0" cy="100" rx="22" ry="4" fill="#000" opacity="0.5" />
            <circle cx="0" cy="0" r="14" fill="#2a2620" />
            <path d="M-16 14 L-22 80 L-8 80 L0 36 L8 80 L22 80 L16 14 Z" fill="#2a2620" />
          </g>
        </svg>
      </div>

      <div style={{marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, color: '#dcd5c7'}}>
        <div>
          <div className="mono" style={{fontSize: 9, color: '#9c958a', letterSpacing: '0.14em'}}>TRIGGER</div>
          <div style={{fontSize: 14, marginTop: 6}}>PIR detects motion · ambient sensor confirms night</div>
        </div>
        <div>
          <div className="mono" style={{fontSize: 9, color: '#9c958a', letterSpacing: '0.14em'}}>RAMP</div>
          <div style={{fontSize: 14, marginTop: 6}}>0 → full in 280ms · soft start, no startle</div>
        </div>
        <div>
          <div className="mono" style={{fontSize: 9, color: '#9c958a', letterSpacing: '0.14em'}}>HOLD & FADE</div>
          <div style={{fontSize: 14, marginTop: 6}}>90s after last motion · 1.8s fade out</div>
        </div>
      </div>
    </div>
  );
}

window.CairnLifestyle = CairnLifestyle;
