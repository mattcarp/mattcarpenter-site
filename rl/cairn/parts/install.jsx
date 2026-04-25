// Mounting & power — three install scenarios + battery/USB-C/mains spec strip.

function CairnInstall() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--paper)',
      padding: '40px 56px',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--rule)', paddingBottom: 14}}>
        <div>
          <div className="display" style={{fontSize: 32, fontWeight: 300, lineHeight: 1}}>Mounting & power</div>
          <div style={{fontSize: 13, color: 'var(--ink-2)', marginTop: 4}}>Twist-mount base · mains-wired or battery · USB-C recharge</div>
        </div>
        <div className="mono" style={{fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-3)', textAlign: 'right'}}>
          CAIRN · INSTALL<br/>SHEET 08 / 09
        </div>
      </div>

      <div style={{flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32, marginTop: 32}}>
        <Scenario
          n="01"
          title="Mains-wired"
          desc="Junction-box install, standard 90–264V AC. Internal SMPS handles step-down. LED runs from mains, battery handles outage backup automatically."
          fig={<MainsFig />}
        />
        <Scenario
          n="02"
          title="Battery only"
          desc="Surface-mounted via twist base. Internal LiFePO4 cell. ~18 months standby, recharged via USB-C in ~2 hours. Ideal for retrofit and rentals."
          fig={<BatteryFig />}
        />
        <Scenario
          n="03"
          title="USB-C recharge"
          desc="Take the puck off the base. Plug into any USB-C charger. 5V·2A. Battery-life LED on the side breathes amber while charging, settles green at full."
          fig={<UsbFig />}
        />
      </div>

      <div style={{marginTop: 28, borderTop: '1px solid var(--rule)', paddingTop: 18, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24}}>
        {[
          ['Input', '90–264 VAC · 50/60 Hz'],
          ['Battery', 'LiFePO4 · 2200 mAh · 18 mo. standby'],
          ['Recharge', 'USB-C PD · 5V/2A · ~2 h to full'],
          ['Light output', '~400 lm @ 4000K · CRI 90+'],
          ['Service life', '10 yr device · sensor module replaceable yr 5'],
        ].map(([k, v]) => (
          <div key={k}>
            <div className="mono" style={{fontSize: 9, letterSpacing: '0.14em', color: 'var(--ink-3)', textTransform: 'uppercase'}}>{k}</div>
            <div style={{fontSize: 14, color: 'var(--ink)', marginTop: 6, fontWeight: 400}}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Scenario({ n, title, desc, fig }) {
  return (
    <div style={{display: 'flex', flexDirection: 'column', background: 'var(--paper-2)', padding: 24, border: '1px solid var(--rule-soft)'}}>
      <div className="mono" style={{fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.14em'}}>SCENARIO {n}</div>
      <div className="display" style={{fontSize: 28, fontWeight: 300, marginTop: 6}}>{title}</div>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0'}}>{fig}</div>
      <div style={{borderTop: '1px solid var(--rule)', paddingTop: 12, fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5}}>{desc}</div>
    </div>
  );
}

function MainsFig() {
  return (
    <svg viewBox="0 0 360 280" width="100%" style={{maxWidth: 340}}>
      {/* ceiling */}
      <rect x="20" y="20" width="320" height="20" fill="#ebe6df" />
      <pattern id="i-h1" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="#c9c3ba" strokeWidth="0.5" />
      </pattern>
      <rect x="20" y="20" width="320" height="20" fill="url(#i-h1)" />
      <line x1="20" y1="40" x2="340" y2="40" stroke="#1a1816" strokeWidth="0.6" />

      {/* junction box */}
      <rect x="160" y="40" width="40" height="14" fill="#7a7164" />
      <path d="M170 54 L170 70 L175 75" stroke="#c43d2a" strokeWidth="1" fill="none" />
      <path d="M190 54 L190 70 L185 75" stroke="#1a1816" strokeWidth="1" fill="none" />

      {/* device */}
      <ellipse cx="180" cy="90" rx="100" ry="12" fill="#dcd5c7" stroke="#9d9482" strokeWidth="0.5" />
      <path d="M80 90 L80 108 Q180 130 280 108 L280 90" fill="#dcd5c7" stroke="#9d9482" strokeWidth="0.5" />
      <ellipse cx="180" cy="115" rx="60" ry="6" fill="#1a1816" opacity="0.85" />
      <ellipse cx="180" cy="115" rx="56" ry="4" fill="#f5e7c4" />

      {/* light */}
      <path d="M130 118 L100 240 M230 118 L260 240" stroke="#d4623a" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />
      <ellipse cx="180" cy="245" rx="80" ry="6" fill="#f0e5c8" opacity="0.5" />

      <text x="180" y="270" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#7a7164">120/240 VAC → 5 VDC</text>
    </svg>
  );
}

function BatteryFig() {
  return (
    <svg viewBox="0 0 360 280" width="100%" style={{maxWidth: 340}}>
      <rect x="20" y="20" width="320" height="20" fill="#ebe6df" />
      <pattern id="i-h2" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="#c9c3ba" strokeWidth="0.5" />
      </pattern>
      <rect x="20" y="20" width="320" height="20" fill="url(#i-h2)" />
      <line x1="20" y1="40" x2="340" y2="40" stroke="#1a1816" strokeWidth="0.6" />

      {/* twist base only */}
      <ellipse cx="180" cy="48" rx="50" ry="5" fill="#9d9482" />
      <rect x="130" y="40" width="100" height="8" fill="#9d9482" />
      <text x="180" y="34" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#7a7164">↻ twist base · 2 screws</text>

      {/* device */}
      <ellipse cx="180" cy="78" rx="100" ry="12" fill="#dcd5c7" stroke="#9d9482" strokeWidth="0.5" />
      <path d="M80 78 L80 96 Q180 118 280 96 L280 78" fill="#dcd5c7" stroke="#9d9482" strokeWidth="0.5" />
      <ellipse cx="180" cy="103" rx="60" ry="6" fill="#1a1816" opacity="0.85" />
      <ellipse cx="180" cy="103" rx="56" ry="4" fill="#f5e7c4" />

      {/* battery icon */}
      <g transform="translate(140 180)">
        <rect x="0" y="0" width="80" height="32" rx="3" fill="none" stroke="#1a1816" strokeWidth="1" />
        <rect x="80" y="10" width="4" height="12" fill="#1a1816" />
        <rect x="4" y="4" width="64" height="24" fill="#789a4a" />
        <text x="40" y="22" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="11" fill="#fff">18 mo.</text>
      </g>

      <text x="180" y="240" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#7a7164">LiFePO4 · self-discharge low · alarm-priority</text>
    </svg>
  );
}

function UsbFig() {
  return (
    <svg viewBox="0 0 360 280" width="100%" style={{maxWidth: 340}}>
      {/* hand-held puck */}
      <ellipse cx="180" cy="100" rx="100" ry="16" fill="#dcd5c7" stroke="#9d9482" strokeWidth="0.5" />
      <path d="M80 100 L80 124 Q180 148 280 124 L280 100" fill="#dcd5c7" stroke="#9d9482" strokeWidth="0.5" />
      <ellipse cx="180" cy="130" rx="60" ry="6" fill="#1a1816" opacity="0.85" />
      <ellipse cx="180" cy="130" rx="56" ry="4" fill="#f5e7c4" />

      {/* USB-C port + cable */}
      <rect x="80" y="106" width="14" height="6" rx="2" fill="#1a1816" />
      <path d="M80 109 Q40 130 60 200" stroke="#1a1816" strokeWidth="2" fill="none" />
      <rect x="48" y="200" width="24" height="14" rx="2" fill="#1a1816" />
      <rect x="52" y="203" width="16" height="8" rx="1" fill="#3a3530" />
      <text x="60" y="232" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#7a7164">USB-C · 5V/2A</text>

      {/* status indicator (amber/breathing) */}
      <circle cx="280" cy="113" r="2.5" fill="#f0a060">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <text x="290" y="116" fontFamily="Inter Tight" fontSize="10" fill="#7a7164">charging</text>

      <text x="180" y="262" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#7a7164">~2 h to full · keep alarm capability while charging</text>
    </svg>
  );
}

window.CairnInstall = CairnInstall;
