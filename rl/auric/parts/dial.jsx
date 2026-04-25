// Stepped Kelvin dial — large detail showing the mechanical interaction.
// 5 detent positions: 2700 / 3000 / 4000 / 5000 / 6000 K
// Plus a small "all units agree" diagram explaining why detents matter for multi-unit installs.

function CairnDial() {
  const positions = [
    { k: 2700, label: 'Warm',     color: '#f3b870', desc: 'Bedrooms, living rooms' },
    { k: 3000, label: 'Soft',     color: '#f6cc92', desc: 'Hallways, dining' },
    { k: 4000, label: 'Neutral',  color: '#fae9c4', desc: 'Kitchens, hospitality' },
    { k: 5000, label: 'Daylight', color: '#f2eedf', desc: 'Offices, work areas' },
    { k: 6000, label: 'Cool',     color: '#e3eaf3', desc: 'Garages, industrial' },
  ];

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--paper)',
      padding: '40px 56px',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--rule)', paddingBottom: 14}}>
        <div>
          <div className="display" style={{fontSize: 32, fontWeight: 300, lineHeight: 1}}>Kelvin dial</div>
          <div style={{fontSize: 13, color: 'var(--ink-2)', marginTop: 4}}>
            Five-position mechanical detent · no app, no wireless, identical settings across units
          </div>
        </div>
        <div className="mono" style={{fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-3)', textAlign: 'right'}}>
          CAIRN · DIAL<br/>SHEET 07 / 09
        </div>
      </div>

      <div style={{flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 56, marginTop: 36}}>
        {/* Left — large dial */}
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <DialFigure positions={positions} />
        </div>

        {/* Right — explanation + tick chart */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 28}}>
          <div style={{fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.55}}>
            The dial sits flush in the side band, accessible only at install. A stepped detent — five
            satisfying clicks — guarantees every unit on a hallway is set to <em>identical</em>
            color temperature. No more eyeballing two adjacent fixtures and wondering why one is
            yellower than the other.
          </div>

          <div>
            <div className="mono" style={{fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.14em', marginBottom: 12}}>POSITION → KELVIN → CONTEXT</div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 0}}>
              {positions.map((p, i) => (
                <div key={p.k} style={{
                  display: 'grid', gridTemplateColumns: '32px 84px 100px 1fr 64px',
                  alignItems: 'center', gap: 12,
                  padding: '14px 0', borderTop: '1px solid var(--rule)',
                }}>
                  <div className="mono" style={{fontSize: 12, color: 'var(--ink-3)'}}>0{i + 1}</div>
                  <div style={{fontSize: 17, letterSpacing: '-0.01em'}}>{p.label}</div>
                  <div className="mono" style={{fontSize: 13}}>{p.k}K</div>
                  <div style={{fontSize: 13, color: 'var(--ink-2)'}}>{p.desc}</div>
                  <div style={{height: 16, background: p.color, border: '1px solid rgba(0,0,0,0.12)'}} />
                </div>
              ))}
            </div>
          </div>

          <div style={{borderTop: '1px solid var(--rule)', paddingTop: 14, fontSize: 12, color: 'var(--ink-3)', fontStyle: 'italic'}}>
            Adjust at install with a coin or fingernail. The body indexes against
            an internal flat — once set, it cannot drift.
          </div>
        </div>
      </div>
    </div>
  );
}

function DialFigure({ positions }) {
  const cx = 250, cy = 250, r = 180;
  // detent positions across a 200° arc on the bottom of the dial face
  const startA = -190, endA = 10; // degrees
  return (
    <svg viewBox="0 0 500 500" width="100%" style={{maxWidth: 520}}>
      <defs>
        <radialGradient id="dial-face" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0%" stopColor="#f0ebe0" />
          <stop offset="100%" stopColor="#bdb4a3" />
        </radialGradient>
        <radialGradient id="dial-knob" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0%" stopColor="#7a7164" />
          <stop offset="100%" stopColor="#4a4540" />
        </radialGradient>
      </defs>

      {/* device side cutaway */}
      <ellipse cx={cx} cy={cy} rx={r + 30} ry={r + 30} fill="url(#dial-face)" stroke="#9d9482" strokeWidth="0.6" />
      <ellipse cx={cx} cy={cy} rx={r + 12} ry={r + 12} fill="none" stroke="#000" strokeWidth="0.3" opacity="0.2" />

      {/* labeled tick arc */}
      {positions.map((p, i) => {
        const t = i / (positions.length - 1);
        const a = (startA + (endA - startA) * t) * Math.PI / 180;
        const x1 = cx + Math.cos(a) * (r - 6);
        const y1 = cy + Math.sin(a) * (r - 6);
        const x2 = cx + Math.cos(a) * (r + 6);
        const y2 = cy + Math.sin(a) * (r + 6);
        const lx = cx + Math.cos(a) * (r + 36);
        const ly = cy + Math.sin(a) * (r + 36);
        const isCurrent = i === 2; // show "Neutral" as current
        return (
          <g key={p.k}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a1816" strokeWidth={isCurrent ? 1.6 : 0.8} />
            <text x={lx} y={ly + 4} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="13" fill="#1a1816" fontWeight={isCurrent ? 600 : 400}>
              {p.k}K
            </text>
            <text x={lx} y={ly + 20} textAnchor="middle" fontFamily="Inter Tight" fontSize="11" fill="#7a7164">
              {p.label}
            </text>
          </g>
        );
      })}

      {/* dial knob */}
      <circle cx={cx} cy={cy} r="80" fill="url(#dial-knob)" stroke="#1a1816" strokeWidth="0.6" />
      <circle cx={cx} cy={cy} r="74" fill="none" stroke="#1a1816" strokeWidth="0.4" opacity="0.4" />
      {/* knurl */}
      {[...Array(48)].map((_, i) => {
        const a = (i / 48) * Math.PI * 2;
        const x1 = cx + Math.cos(a) * 74;
        const y1 = cy + Math.sin(a) * 74;
        const x2 = cx + Math.cos(a) * 80;
        const y2 = cy + Math.sin(a) * 80;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a1816" strokeWidth="0.5" opacity="0.4" />;
      })}
      {/* indicator pointing to current position (4000K = index 2) */}
      {(() => {
        const a = (startA + (endA - startA) * (2 / 4)) * Math.PI / 180;
        const x = cx + Math.cos(a) * 60;
        const y = cy + Math.sin(a) * 60;
        return (
          <>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="#f4f1ec" strokeWidth="3" strokeLinecap="round" />
            <circle cx={x} cy={y} r="4" fill="#f4f1ec" />
          </>
        );
      })()}
      <circle cx={cx} cy={cy} r="6" fill="#1a1816" />

      {/* annotation */}
      <text x={cx} y={cy - 110} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#7a7164" letterSpacing="0.1em">DETENT · 5 STEPS</text>
    </svg>
  );
}

window.CairnDial = CairnDial;
