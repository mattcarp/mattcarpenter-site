// Six colorways — quiet domestic, with gentle architectural neutrals.
// Each shown as a small puck with name and finish notes.

function CairnColorways() {
  const colors = [
    { name: 'Linen',   sub: 'Soft warm off-white',   body: '#f0ebe0', body2: '#dcd5c7', rim: '#bbb2a4', lens: '#e8d8b0', dial: '#a89e8c' },
    { name: 'Bone',    sub: 'Cool neutral white',    body: '#ecebe6', body2: '#d4d2cc', rim: '#aeaca5', lens: '#e8d8b0', dial: '#9d9b94' },
    { name: 'Ash',     sub: 'Warm light grey',       body: '#bcb6ad', body2: '#9d9789', rim: '#7a7466', lens: '#e8d8b0', dial: '#5a5448' },
    { name: 'Graphite',sub: 'Soft charcoal',         body: '#3a3833', body2: '#26241f', rim: '#1a1816', lens: '#f5e7c4', dial: '#5a5650' },
    { name: 'Clay',    sub: 'Muted terracotta',      body: '#c98c6b', body2: '#a86e4f', rim: '#7a4a32', lens: '#f5e7c4', dial: '#5a3422' },
    { name: 'Sage',    sub: 'Pale gray-green',       body: '#a8b09a', body2: '#878e7a', rim: '#666b58', lens: '#e8d8b0', dial: '#4a4f3e' },
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
          <div className="display" style={{fontSize: 32, fontWeight: 300, lineHeight: 1}}>Six finishes</div>
          <div style={{fontSize: 13, color: 'var(--ink-2)', marginTop: 4}}>
            Soft-touch matte polycarbonate · all finishes UV-stable for 10-year service life
          </div>
        </div>
        <div className="mono" style={{fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-3)', textAlign: 'right'}}>
          CAIRN · COLORWAYS<br/>SHEET 06 / 09
        </div>
      </div>

      <div style={{flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: 36, marginTop: 36}}>
        {colors.map((c, i) => <Swatch key={c.name} c={c} index={i} />)}
      </div>
    </div>
  );
}

function Swatch({ c, index }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      gap: 14,
      padding: 24,
      background: 'var(--paper-2)',
      border: '1px solid var(--rule-soft)',
      position: 'relative',
    }}>
      <div className="mono" style={{position: 'absolute', top: 12, right: 16, fontSize: 9, color: 'var(--ink-3)', letterSpacing: '0.1em'}}>
        AU-{String(index + 1).padStart(2, '0')}
      </div>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <SwatchPuck c={c} />
      </div>
      <div style={{borderTop: '1px solid var(--rule)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <div>
          <div className="display" style={{fontSize: 26, fontWeight: 300, lineHeight: 1}}>{c.name}</div>
          <div style={{fontSize: 11, color: 'var(--ink-2)', marginTop: 4}}>{c.sub}</div>
        </div>
        <div style={{display: 'flex', gap: 4}}>
          <div style={{width: 14, height: 14, background: c.body, border: '1px solid rgba(0,0,0,0.15)'}} />
          <div style={{width: 14, height: 14, background: c.body2, border: '1px solid rgba(0,0,0,0.15)'}} />
          <div style={{width: 14, height: 14, background: c.rim, border: '1px solid rgba(0,0,0,0.15)'}} />
        </div>
      </div>
    </div>
  );
}

function SwatchPuck({ c }) {
  return (
    <svg viewBox="0 0 280 280" width="220" height="220">
      <defs>
        <radialGradient id={`sp-${c.name}`} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0%" stopColor={c.body} />
          <stop offset="100%" stopColor={c.body2} />
        </radialGradient>
        <radialGradient id={`sp-l-${c.name}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={c.lens} />
          <stop offset="100%" stopColor={shade(c.lens, -20)} />
        </radialGradient>
      </defs>
      {/* shadow */}
      <ellipse cx="140" cy="252" rx="120" ry="8" fill="#000" opacity="0.08" />
      {/* outer */}
      <circle cx="140" cy="140" r="120" fill={`url(#sp-${c.name})`} stroke={c.rim} strokeWidth="0.6" />
      {/* aperture ring */}
      <circle cx="140" cy="140" r="72" fill={c.rim} opacity="0.85" />
      {/* lens */}
      <circle cx="140" cy="140" r="68" fill={`url(#sp-l-${c.name})`} />
      {/* sensor */}
      <circle cx="140" cy="140" r="2" fill="#1a1816" opacity="0.5" />
      {/* dial peeking on edge */}
      <ellipse cx="259" cy="140" rx="3" ry="6" fill={c.dial} />
    </svg>
  );
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 0xff) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

window.CairnColorways = CairnColorways;
