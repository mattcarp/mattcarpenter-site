// Cross-section showing internal architecture:
// - SMPS (mains step-down)
// - LiFePO4 cell + USB-C charging IC
// - Photoelectric smoke chamber
// - Electrochemical CO sensor
// - PIR motion sensor
// - Ambient light sensor
// - LED ring + driver
// - Stepped Kelvin dial mechanism

function CairnCrossSection() {
  const TechSheet = window.TechSheet;
  const Arrows = window.OrthoArrows;
  return (
    <TechSheet title="Cross-section" sub="Internal architecture · 2:1" sheet="05 / 09">
      <svg viewBox="0 0 1300 760" width="100%" height="100%">
        <Arrows />
        <defs>
          <linearGradient id="cs-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0d9ca" />
            <stop offset="100%" stopColor="#f0ebe0" />
          </linearGradient>
          <linearGradient id="cs-pcb" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a3d2a" />
            <stop offset="100%" stopColor="#2a5a3d" />
          </linearGradient>
        </defs>

        {/* ceiling */}
        <rect x="200" y="80" width="900" height="40" fill="#ebe6df" stroke="#c9c3ba" />
        <pattern id="hatch2" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#c9c3ba" strokeWidth="0.5" />
        </pattern>
        <rect x="200" y="80" width="900" height="40" fill="url(#hatch2)" />
        <line x1="200" y1="120" x2="1100" y2="120" stroke="#1a1816" strokeWidth="0.6" />

        {/* mains wires from ceiling */}
        <path d="M620 80 L620 130 L630 140" fill="none" stroke="#c43d2a" strokeWidth="1.2" />
        <path d="M680 80 L680 130 L670 140" fill="none" stroke="#1a1816" strokeWidth="1.2" />

        {/* mounting plate */}
        <rect x="540" y="120" width="220" height="8" fill="#7a7164" />
        <circle cx="560" cy="124" r="2.5" fill="#1a1816" />
        <circle cx="740" cy="124" r="2.5" fill="#1a1816" />

        {/* outer dome (hollowed) */}
        <path d="M425 128
                 C 425 128, 440 132, 470 134
                 C 510 138, 790 138, 830 134
                 C 860 132, 875 128, 875 128
                 L 870 175
                 C 870 195, 830 215, 650 218
                 C 470 215, 430 195, 430 175 Z"
              fill="url(#cs-body)" stroke="#9d9482" strokeWidth="0.6" />

        {/* internal cavity outline */}
        <path d="M460 134 L840 134 L834 200 C 800 215, 500 215, 466 200 Z"
              fill="#f4f1ec" stroke="#1a1816" strokeWidth="0.3" strokeDasharray="2 2" opacity="0.4" />

        {/* SMPS module — top left in cavity */}
        <g>
          <rect x="475" y="138" width="70" height="20" fill="url(#cs-pcb)" stroke="#0a1a14" strokeWidth="0.4" />
          <rect x="480" y="142" width="14" height="12" fill="#222" />
          <rect x="498" y="142" width="8" height="12" fill="#888" />
          <rect x="510" y="144" width="6" height="8" fill="#c8a050" />
          <text x="510" y="172" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#1a1816">SMPS</text>
        </g>

        {/* main PCB — center */}
        <rect x="555" y="140" width="200" height="6" fill="url(#cs-pcb)" />
        <rect x="555" y="146" width="200" height="2" fill="#0a1a14" />

        {/* battery — LiFePO4 pouch */}
        <rect x="585" y="150" width="140" height="22" rx="2" fill="#3a3530" stroke="#1a1816" strokeWidth="0.4" />
        <rect x="585" y="150" width="140" height="4" fill="#5a5048" />
        <text x="655" y="166" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#dcd5c7">LiFePO4 · 2200 mAh</text>

        {/* smoke chamber — photoelectric */}
        <g>
          <path d="M770 138 L820 138 L824 175 L766 175 Z" fill="#1a1816" />
          <circle cx="795" cy="156" r="9" fill="#222" stroke="#444" strokeWidth="0.4" />
          {/* light path */}
          <line x1="787" y1="160" x2="803" y2="153" stroke="#d4623a" strokeWidth="0.5" />
          <text x="795" y="186" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#1a1816">photo.</text>
        </g>

        {/* CO sensor */}
        <g>
          <circle cx="760" cy="195" r="8" fill="#7a7164" stroke="#1a1816" strokeWidth="0.4" />
          <circle cx="760" cy="195" r="5" fill="#3a3530" />
          {[...Array(6)].map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return <circle key={i} cx={760 + Math.cos(a) * 3} cy={195 + Math.sin(a) * 3} r="0.6" fill="#f4f1ec" />;
          })}
        </g>

        {/* PIR sensor — pointed down */}
        <g>
          <rect x="640" y="170" width="20" height="14" fill="#1a1816" />
          <ellipse cx="650" cy="184" rx="6" ry="2" fill="#f4f1ec" />
          {/* PIR cone */}
          <path d="M650 186 L600 280 L700 280 Z" fill="#f5e7c4" opacity="0.18" stroke="#d4623a" strokeWidth="0.3" strokeDasharray="2 2" />
        </g>

        {/* ambient light sensor — small */}
        <rect x="540" y="170" width="6" height="6" fill="#1a1816" />
        <circle cx="543" cy="173" r="1.2" fill="#888" />

        {/* LED ring at lower aperture */}
        <g>
          {[...Array(18)].map((_, i) => {
            const x = 488 + i * 18;
            return (
              <g key={i}>
                <rect x={x} y={196} width="14" height="6" fill="#fffae0" stroke="#c8a050" strokeWidth="0.3" />
                <ellipse cx={x + 7} cy={196} rx="6" ry="2" fill="#fff5d8" />
              </g>
            );
          })}
        </g>
        {/* diffuser */}
        <path d="M488 202 L834 202 L820 215 C 800 220, 510 220, 502 215 Z" fill="#fff8e8" opacity="0.5" stroke="#1a1816" strokeWidth="0.3" />

        {/* dial mechanism on side */}
        <g>
          <circle cx="876" cy="158" r="9" fill="#9d9482" stroke="#7a7164" strokeWidth="0.5" />
          <circle cx="876" cy="158" r="6" fill="#7a7164" />
          {[...Array(5)].map((_, i) => {
            const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
            return <circle key={i} cx={876 + Math.cos(a) * 6.5} cy={158 + Math.sin(a) * 6.5} r="0.7" fill="#1a1816" />;
          })}
          <rect x="867" y="156" width="9" height="4" fill="#3a3530" />
        </g>

        {/* USB-C port underside */}
        <rect x="445" y="195" width="14" height="5" rx="1.5" fill="#1a1816" />
        <rect x="447" y="196.5" width="10" height="2" rx="1" fill="#3a3530" />

        {/* light cone */}
        <path d="M510 218 L380 500" stroke="#d4623a" strokeWidth="0.4" strokeDasharray="4 4" opacity="0.4" />
        <path d="M790 218 L920 500" stroke="#d4623a" strokeWidth="0.4" strokeDasharray="4 4" opacity="0.4" />

        {/* Callouts */}
        <g fontFamily="Inter Tight" fontSize="11" fill="#1a1816">
          {[
            ['1', 510, 148, 280, 148, 'Mains AC/DC step-down (90–264V → 5V)'],
            ['2', 655, 162, 280, 280, 'LiFePO4 backup cell · 18-month standby'],
            ['3', 795, 156, 1080, 200, 'Photoelectric smoke chamber'],
            ['4', 760, 195, 1080, 270, 'Electrochemical CO sensor'],
            ['5', 650, 178, 280, 340, 'Wide-angle PIR motion sensor'],
            ['6', 543, 173, 280, 400, 'Ambient light sensor (auto night mode)'],
            ['7', 660, 199, 1080, 340, 'Tunable white LED ring (2700–6000K)'],
            ['8', 876, 158, 1080, 130, '5-position detent dial · Kelvin select'],
            ['9', 452, 199, 280, 460, 'USB-C service port'],
          ].map(([n, x, y, lx, ly, t]) => (
            <g key={n}>
              <line x1={x} y1={y} x2={lx} y2={ly} stroke="#1a1816" strokeWidth="0.4" />
              <circle cx={x} cy={y} r="1.5" fill="#1a1816" />
              <circle cx={lx} cy={ly} r="9" fill="#f4f1ec" stroke="#1a1816" strokeWidth="0.5" />
              <text x={lx} y={ly + 3.5} textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono">{n}</text>
              <text x={lx < 600 ? lx - 14 : lx + 14} y={ly + 3} textAnchor={lx < 600 ? 'end' : 'start'} fontSize="11">{t}</text>
            </g>
          ))}
        </g>

        {/* footer note */}
        <text x="650" y="720" textAnchor="middle" fontFamily="Inter Tight" fontStyle="italic" fontSize="13" fill="#7a7164">
          Mains-wired install drives the LED ring directly via SMPS; battery handles standby + alarm + emergency light during outage.
        </text>
      </svg>
    </TechSheet>
  );
}

window.CairnCrossSection = CairnCrossSection;
