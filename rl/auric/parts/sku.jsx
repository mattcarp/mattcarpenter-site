// Cairn vs Cairn Pro — same form factor, different brain.
// Two artboards: SKU comparison strip + Matter-over-Thread mesh diagram showing
// anomaly escalation (fire / CO / out-of-range temperature → alerts to phones, building systems).

function CairnSKU() {
  const rows = [
    ['Smoke detection',          true, true],
    ['CO detection',             true, true],
    ['Motion-activated light',   true, true],
    ['5-step Kelvin dial',       true, true],
    ['USB-C battery backup',     true, true],
    ['Temperature sensor',       false, true],
    ['Humidity sensor',          false, true],
    ['Matter over Thread',       false, true],
    ['Mesh relay (cross-unit)',  false, true],
    ['Phone & building alerts',  false, true],
    ['Anomaly escalation API',   false, true],
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
          <div className="display" style={{fontSize: 32, fontWeight: 300, lineHeight: 1}}>Two SKUs · same body</div>
          <div style={{fontSize: 13, color: 'var(--ink-2)', marginTop: 4}}>Identical form, finishes, and install. The Pro adds a radio and two extra sensors.</div>
        </div>
        <div className="mono" style={{fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-3)', textAlign: 'right'}}>
          CAIRN · LINEUP<br/>SHEET 09 / 10
        </div>
      </div>

      <div style={{flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr', gap: 32, marginTop: 36}}>
        <SKUCard
          tier="Standard"
          name="Cairn"
          tagline="Detector + light, nothing else."
          accent="#9d9482"
          dot=""
        />
        <SKUCard
          tier="Smart"
          name="Cairn Pro"
          tagline="Mesh-aware. Speaks Matter."
          accent="#d4623a"
          dot
        />
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div className="mono" style={{fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.14em', marginBottom: 8}}>FEATURE PARITY</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 60px 60px', columnGap: 8}}>
            <div style={{borderBottom: '1px solid var(--rule)', paddingBottom: 8, fontSize: 11, color: 'var(--ink-3)'}}></div>
            <div style={{borderBottom: '1px solid var(--rule)', paddingBottom: 8, fontSize: 11, color: 'var(--ink-3)', textAlign: 'center'}} className="mono">CAIRN</div>
            <div style={{borderBottom: '1px solid var(--rule)', paddingBottom: 8, fontSize: 11, color: 'var(--ink-3)', textAlign: 'center'}} className="mono">PRO</div>
            {rows.map(([label, std, pro]) => (
              <React.Fragment key={label}>
                <div style={{padding: '10px 0', borderBottom: '1px solid var(--rule-soft)', fontSize: 13, color: 'var(--ink)'}}>{label}</div>
                <div style={{padding: '10px 0', borderBottom: '1px solid var(--rule-soft)', textAlign: 'center'}}>{std ? <Tick /> : <Dash />}</div>
                <div style={{padding: '10px 0', borderBottom: '1px solid var(--rule-soft)', textAlign: 'center'}}>{pro ? <Tick accent /> : <Dash />}</div>
              </React.Fragment>
            ))}
          </div>
          <div style={{borderTop: '1px solid var(--rule)', marginTop: 16, paddingTop: 12, fontSize: 12, color: 'var(--ink-3)', fontStyle: 'italic'}}>
            Tell them apart by a single matte amber dot below the lens — no other surface change.
          </div>
        </div>
      </div>
    </div>
  );
}

function Tick({ accent }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{display: 'inline-block'}}>
      <path d="M3 8 L7 12 L13 4" fill="none" stroke={accent ? '#d4623a' : '#1a1816'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Dash() {
  return <span style={{color: 'var(--ink-3)', fontSize: 14}}>—</span>;
}

function SKUCard({ tier, name, tagline, accent, dot }) {
  return (
    <div style={{
      background: 'var(--paper-2)', padding: 28,
      border: '1px solid var(--rule-soft)',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>
      <div className="mono" style={{fontSize: 10, color: accent, letterSpacing: '0.14em'}}>{tier.toUpperCase()}</div>
      <div className="display" style={{fontSize: 44, fontWeight: 300, marginTop: 8, lineHeight: 1}}>{name}</div>
      <div style={{fontSize: 13, color: 'var(--ink-2)', marginTop: 8, fontStyle: 'italic'}}>{tagline}</div>

      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0'}}>
        <SKUPuck accent={accent} dot={!!dot} />
      </div>

      <div style={{borderTop: '1px solid var(--rule)', paddingTop: 12, fontSize: 12, color: 'var(--ink-2)', display: 'flex', justifyContent: 'space-between'}}>
        <span>⌀ 135mm · H 34mm</span>
        <span className="mono">{name === 'Cairn' ? 'AU-100' : 'AU-200'}</span>
      </div>
    </div>
  );
}

function SKUPuck({ accent, dot }) {
  return (
    <svg viewBox="0 0 280 280" width="220" height="220">
      <defs>
        <radialGradient id={`sku-${accent}`} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0%" stopColor="#fdfaf5" />
          <stop offset="100%" stopColor="#dcd5c7" />
        </radialGradient>
      </defs>
      <ellipse cx="140" cy="252" rx="120" ry="8" fill="#000" opacity="0.08" />
      <circle cx="140" cy="140" r="120" fill={`url(#sku-${accent})`} stroke="#9d9482" strokeWidth="0.5" />
      <circle cx="140" cy="140" r="72" fill="#1a1816" opacity="0.85" />
      <circle cx="140" cy="140" r="68" fill="#f5e7c4" />
      <circle cx="140" cy="140" r="2" fill="#1a1816" opacity="0.5" />
      {dot && <circle cx="140" cy="232" r="3" fill="#d4623a" />}
      <ellipse cx="259" cy="140" rx="3" ry="6" fill="#a89e8c" />
    </svg>
  );
}

// ─── Matter-over-Thread mesh diagram ───
function CairnMesh() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--paper)',
      padding: '40px 56px',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--rule)', paddingBottom: 14}}>
        <div>
          <div className="display" style={{fontSize: 32, fontWeight: 300, lineHeight: 1}}>Cairn Pro · anomaly mesh</div>
          <div style={{fontSize: 13, color: 'var(--ink-2)', marginTop: 4}}>Matter over Thread · units relay alerts to phones, building systems, and each other</div>
        </div>
        <div className="mono" style={{fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-3)', textAlign: 'right'}}>
          CAIRN PRO · MESH<br/>SHEET 10 / 10
        </div>
      </div>

      <div style={{flex: 1, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40, marginTop: 28}}>
        {/* Mesh diagram */}
        <div style={{position: 'relative'}}>
          <svg viewBox="0 0 800 700" width="100%" height="100%">
            <defs>
              <radialGradient id="mesh-pulse" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#d4623a" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#d4623a" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* building outline — apartment cross-section */}
            <rect x="60" y="80" width="680" height="540" fill="none" stroke="#c9c3ba" strokeWidth="0.6" />
            {/* 3 floors */}
            <line x1="60" y1="260" x2="740" y2="260" stroke="#c9c3ba" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="60" y1="440" x2="740" y2="440" stroke="#c9c3ba" strokeWidth="0.5" strokeDasharray="3 3" />
            {/* unit dividers */}
            <line x1="280" y1="80" x2="280" y2="620" stroke="#c9c3ba" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="520" y1="80" x2="520" y2="620" stroke="#c9c3ba" strokeWidth="0.5" strokeDasharray="3 3" />

            {/* labels */}
            <text x="170" y="74" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#7a7164">UNIT 3A</text>
            <text x="400" y="74" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#7a7164">UNIT 3B</text>
            <text x="630" y="74" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#7a7164">HALL</text>

            {/* Cairn units — 9 of them */}
            {(() => {
              const positions = [
                { x: 170, y: 170, alarm: true,  label: 'A1' },
                { x: 400, y: 170, alarm: false, label: 'A2' },
                { x: 630, y: 170, alarm: false, label: 'A3' },
                { x: 170, y: 350, alarm: false, label: 'B1' },
                { x: 400, y: 350, alarm: false, label: 'B2' },
                { x: 630, y: 350, alarm: false, label: 'B3' },
                { x: 170, y: 530, alarm: false, label: 'C1' },
                { x: 400, y: 530, alarm: false, label: 'C2' },
                { x: 630, y: 530, alarm: false, label: 'C3' },
              ];
              const links = [
                [0,1],[1,2],[3,4],[4,5],[6,7],[7,8],
                [0,3],[1,4],[2,5],[3,6],[4,7],[5,8],
                [0,4],[1,5],[3,7],[4,8],
              ];
              return (
                <>
                  {/* mesh links */}
                  {links.map(([a, b], i) => {
                    const p1 = positions[a], p2 = positions[b];
                    const isPropagating = p1.alarm || p2.alarm || (a === 1 && b === 4) || (a === 0 && b === 4);
                    return (
                      <line key={i}
                        x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                        stroke={isPropagating ? '#d4623a' : '#c9c3ba'}
                        strokeWidth={isPropagating ? 1 : 0.5}
                        strokeDasharray={isPropagating ? '3 3' : '1 3'}
                        opacity={isPropagating ? 0.7 : 0.5}
                      />
                    );
                  })}

                  {/* alarm pulse */}
                  <circle cx={170} cy={170} r="60" fill="url(#mesh-pulse)">
                    <animate attributeName="r" values="20;90;20" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                  </circle>

                  {/* nodes */}
                  {positions.map((p, i) => (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r="14" fill={p.alarm ? '#c43d2a' : '#dcd5c7'} stroke="#9d9482" strokeWidth="0.6" />
                      <circle cx={p.x} cy={p.y} r="7" fill={p.alarm ? '#fff5d8' : '#1a1816'} opacity={p.alarm ? 0.9 : 0.5} />
                      <text x={p.x} y={p.y + 30} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#7a7164">{p.label}</text>
                    </g>
                  ))}
                </>
              );
            })()}
          </svg>
        </div>

        {/* Right column — escalation flow */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
          <div className="mono" style={{fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.14em'}}>ESCALATION · 0 → 12s</div>

          <FlowStep n="00s" tag="DETECT" desc="Cairn Pro 3A detects smoke. Local alarm fires immediately." color="#c43d2a" />
          <FlowStep n="00s" tag="MESH"   desc="Multicast to neighbors over Thread. All units in the building chirp within 200ms." color="#d4623a" />
          <FlowStep n="03s" tag="HOME"   desc="Matter event hits the home hub — Apple Home / Google Home / SmartThings — phones buzz." color="#d89030" />
          <FlowStep n="08s" tag="OPS"    desc="Building management system receives an event on the property gateway. Dashboard pin lights up." color="#7a8a4a" />
          <FlowStep n="12s" tag="API"    desc="Webhook to ops platform if configured. Optional SMS / phone tree for janitors and on-call." color="#4a6a8a" />

          <div style={{flex: 1}} />

          <div style={{borderTop: '1px solid var(--rule)', paddingTop: 14}}>
            <div className="mono" style={{fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.14em', marginBottom: 8}}>WATCHED ANOMALIES</div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
              {['Smoke', 'CO > 50ppm', 'Temp > 60°C', 'Temp < 0°C', 'Humidity > 85%', 'Sensor offline', 'Battery low', 'Tamper'].map(t => (
                <span key={t} className="mono" style={{
                  fontSize: 10, padding: '5px 9px',
                  background: 'var(--paper-2)', border: '1px solid var(--rule)', color: 'var(--ink-2)',
                  letterSpacing: '0.04em',
                }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{fontSize: 11, color: 'var(--ink-3)', fontStyle: 'italic', lineHeight: 1.5}}>
            Standard Cairn still works on the mesh as a passive node — Pro units relay its alarm if a Pro is within range.
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowStep({ n, tag, desc, color }) {
  return (
    <div style={{display: 'grid', gridTemplateColumns: '52px 70px 1fr', gap: 12, alignItems: 'flex-start', borderTop: '1px solid var(--rule-soft)', paddingTop: 12}}>
      <div className="mono" style={{fontSize: 13, color: 'var(--ink)', fontWeight: 500}}>{n}</div>
      <div className="mono" style={{fontSize: 10, letterSpacing: '0.12em', color, padding: '3px 6px', background: color + '18', alignSelf: 'flex-start'}}>{tag}</div>
      <div style={{fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.45}}>{desc}</div>
    </div>
  );
}

window.CairnSKU = CairnSKU;
window.CairnMesh = CairnMesh;
