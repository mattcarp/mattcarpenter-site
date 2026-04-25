// Bill of materials — both Cairn (standard) and Cairn Pro.
// Real candidate parts; price estimates are 1k-unit ballpark for budgeting.

function CairnBOM() {
  const cats = [
    {
      name: 'Detection',
      rows: [
        ['Photoelectric smoke chamber', 'Amphenol Advanced Sensors SM-PWM-01C', 1, 1, '$3.80', 'Drop-in module, 5V, analog out. UL217 reference design available.'],
        ['Electrochemical CO sensor', 'Figaro TGS5042-A00', 1, 1, '$11.20', '5-yr life. Pair with op-amp transimpedance front-end.'],
        ['Sensor analog front-end', 'TI LMP91000', 1, 1, '$2.40', 'Configurable AFE for electrochemical sensors.'],
        ['Temp + humidity sensor', '—', 0, 1, '$1.10', 'Sensirion SHT40 · I²C · ±0.2°C. Pro only.'],
      ],
    },
    {
      name: 'Compute & radio',
      rows: [
        ['MCU (standard)', 'Nordic nRF52805 / STM32G0', 1, 0, '$1.40', 'Cortex-M4 / M0+. BLE optional but unused on standard.'],
        ['MCU + Thread radio (Pro)', 'Nordic nRF54L15', 0, 1, '$3.80', 'Matter-over-Thread certified. 802.15.4 + BLE provisioning.'],
        ['Antenna', 'Johanson 2450AT43B100', 0, 1, '$0.30', 'Chip antenna, tuned for 2.4GHz, integrated trace.'],
        ['Crystal 32.768kHz', 'Abracon ABS07', 1, 1, '$0.20', 'RTC for low-power standby.'],
      ],
    },
    {
      name: 'Light',
      rows: [
        ['Tunable white LED, warm', 'Lumileds Luxeon 3535L 2700K', 12, 12, '$0.18 ea', '~80 lm @ 350mA, CRI 90+.'],
        ['Tunable white LED, cool', 'Lumileds Luxeon 3535L 6500K', 12, 12, '$0.18 ea', 'Mixed with warm in 1:1 array for tunable output.'],
        ['LED driver', 'TI TPS92200', 1, 1, '$1.10', 'Buck driver, dimmable, 5V → LED string.'],
        ['Diffuser disc', '76mm PMMA 90% transmission', 1, 1, '$0.40', 'Frosted polycarbonate alternative for impact.'],
      ],
    },
    {
      name: 'Sensing & control',
      rows: [
        ['PIR motion sensor', 'Panasonic EKMC1601112', 1, 1, '$5.40', 'Wide-angle digital PIR, 5V. Detection 5m / 90°.'],
        ['Ambient light sensor', 'Vishay VEML7700', 1, 1, '$0.85', 'I²C, 16-bit lux output.'],
        ['Test/hush button', 'Alps SKHHA series', 1, 1, '$0.20', 'Tactile dome, hidden under bezel flex.'],
        ['Kelvin detent dial', 'Custom CW Industries 5-position rotary', 1, 1, '$1.20', '5 positions, 30° detent, mechanical only — no encoder.'],
        ['Piezo alarm buzzer', 'Murata PKLCS1212E4001', 1, 1, '$1.40', '85dB @ 3m, UL217-compliant horn.'],
      ],
    },
    {
      name: 'Power',
      rows: [
        ['SMPS module (mains)', 'MeanWell IRM-02-5', 1, 1, '$5.20', '90–264VAC → 5VDC, 2W, 18×33×15mm. Optional for battery-only SKU.'],
        ['LiFePO4 cell', 'Tenergy 14430 600mAh × 3', 3, 3, '$2.10 ea', '10-yr cycle life, no thermal runaway. 18-month standby.'],
        ['Battery management IC', 'TI BQ25180', 1, 1, '$0.95', 'Single-cell linear charger, USB-C input, JEITA support.'],
        ['USB-C receptacle', 'GCT USB4105-GF-A', 1, 1, '$0.45', 'Mid-mount, through-hole. CC1/CC2 for 5V detection.'],
        ['Buck converter', 'TI TPS62840', 1, 1, '$0.65', '60nA quiescent, 5V → 3.3V for MCU + sensors.'],
      ],
    },
    {
      name: 'Mechanical · 3D printable',
      rows: [
        ['Outer dome (show surface)', 'PLA / PETG · matte', 1, 1, '—', '⌀135 × 34mm. Print upside down, 0.12mm layers, supports off. Sand + matte coat for finish.'],
        ['Inner chassis', 'PLA · structural', 1, 1, '—', 'Holds PCB stack, sensor ducts, dial mechanism. Print as separate part.'],
        ['Light bezel ring', 'PETG · black', 1, 1, '—', '⌀76mm aperture rim. Light-blocking.'],
        ['Mounting plate', 'PETG · structural', 1, 1, '—', 'Twist-lock to junction box. 2× M4 standard ceiling mount.'],
        ['Smoke chamber baffle', 'Black PLA', 1, 1, '—', 'Dust-resistant labyrinth, prevents direct light/insect ingress.'],
      ],
    },
    {
      name: 'PCBs & misc',
      rows: [
        ['Main PCB', '2-layer FR4, 1.6mm', 1, 1, '$2.40', '⌀120mm round. ENIG for reliability.'],
        ['LED PCB', 'MCPCB · aluminium core', 1, 1, '$1.80', '⌀76mm thermal substrate for LED ring.'],
        ['Inter-board connector', 'JST-SH 6-pin', 2, 2, '$0.30 ea', 'Power + I²C between main and LED PCBs.'],
        ['Fasteners', 'M2 × 6mm × 6', 6, 6, '$0.60', 'Securing PCBs and chassis layers.'],
      ],
    },
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
          <div className="display" style={{fontSize: 32, fontWeight: 300, lineHeight: 1}}>Bill of materials</div>
          <div style={{fontSize: 13, color: 'var(--ink-2)', marginTop: 4}}>Candidate parts · 1k-unit pricing · 3D-print breakdown for prototyping</div>
        </div>
        <div className="mono" style={{fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-3)', textAlign: 'right'}}>
          CAIRN · BOM<br/>SHEET 11 / 11
        </div>
      </div>

      <div style={{flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 24, overflow: 'hidden'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 18, overflow: 'auto'}}>
          {cats.slice(0, 4).map(c => <BOMCat key={c.name} cat={c} />)}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 18, overflow: 'auto'}}>
          {cats.slice(4).map(c => <BOMCat key={c.name} cat={c} />)}
          <BOMSummary />
        </div>
      </div>
    </div>
  );
}

function BOMCat({ cat }) {
  return (
    <div>
      <div className="mono" style={{fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-3)', marginBottom: 8, textTransform: 'uppercase'}}>
        {cat.name}
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1.6fr 28px 28px 70px', columnGap: 8, fontSize: 10, color: 'var(--ink-3)'}} className="mono">
        <div style={{paddingBottom: 4, borderBottom: '1px solid var(--rule)'}}>PART</div>
        <div style={{paddingBottom: 4, borderBottom: '1px solid var(--rule)'}}>CANDIDATE</div>
        <div style={{paddingBottom: 4, borderBottom: '1px solid var(--rule)', textAlign: 'center'}}>STD</div>
        <div style={{paddingBottom: 4, borderBottom: '1px solid var(--rule)', textAlign: 'center'}}>PRO</div>
        <div style={{paddingBottom: 4, borderBottom: '1px solid var(--rule)', textAlign: 'right'}}>EST.</div>
      </div>
      {cat.rows.map((r, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '1.5fr 1.6fr 28px 28px 70px',
          columnGap: 8, padding: '6px 0',
          borderBottom: '1px solid var(--rule-soft)',
          fontSize: 11.5, alignItems: 'baseline',
        }}>
          <div style={{color: 'var(--ink)'}}>{r[0]}</div>
          <div className="mono" style={{fontSize: 10.5, color: 'var(--ink-2)'}}>{r[1]}</div>
          <div className="mono" style={{fontSize: 11, textAlign: 'center', color: r[2] === 0 ? 'var(--ink-3)' : 'var(--ink)'}}>{r[2] === 0 ? '—' : r[2]}</div>
          <div className="mono" style={{fontSize: 11, textAlign: 'center'}}>{r[3]}</div>
          <div className="mono" style={{fontSize: 10.5, textAlign: 'right', color: 'var(--ink-2)'}}>{r[4]}</div>
        </div>
      ))}
      {cat.rows.map((r, i) => r[5] && (
        <div key={'note-' + i} style={{
          fontSize: 10.5, color: 'var(--ink-3)',
          padding: '2px 0 6px 12px',
          borderLeft: '1px solid var(--rule-soft)',
          marginLeft: 0,
          fontStyle: 'italic',
          display: 'none',
        }}>
          {r[5]}
        </div>
      ))}
    </div>
  );
}

function BOMSummary() {
  return (
    <div style={{borderTop: '2px solid var(--ink)', paddingTop: 14, marginTop: 8}}>
      <div className="mono" style={{fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-3)', marginBottom: 12}}>ROLLUP · 1K UNITS</div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 90px 90px', gap: 6, fontSize: 12}}>
        <div className="mono" style={{fontSize: 10, color: 'var(--ink-3)'}}></div>
        <div className="mono" style={{fontSize: 10, color: 'var(--ink-3)', textAlign: 'right'}}>STD</div>
        <div className="mono" style={{fontSize: 10, color: 'var(--ink-3)', textAlign: 'right'}}>PRO</div>

        {[
          ['Electronics', '$22.40', '$28.10'],
          ['LEDs + driver + diffuser', '$5.80', '$5.80'],
          ['Battery + charging', '$8.60', '$8.60'],
          ['SMPS (optional)', '$5.20', '$5.20'],
          ['PCBs + connectors', '$5.40', '$5.40'],
          ['Fasteners + misc', '$0.60', '$0.60'],
          ['Mechanical (injection-mold)', '$3.20', '$3.20'],
        ].map(([k, a, b]) => (
          <React.Fragment key={k}>
            <div style={{padding: '5px 0', borderBottom: '1px solid var(--rule-soft)'}}>{k}</div>
            <div className="mono" style={{padding: '5px 0', borderBottom: '1px solid var(--rule-soft)', textAlign: 'right'}}>{a}</div>
            <div className="mono" style={{padding: '5px 0', borderBottom: '1px solid var(--rule-soft)', textAlign: 'right'}}>{b}</div>
          </React.Fragment>
        ))}
        <div style={{padding: '8px 0 0', fontWeight: 500}}>Estimated BOM</div>
        <div className="mono" style={{padding: '8px 0 0', textAlign: 'right', fontWeight: 600}}>~$51</div>
        <div className="mono" style={{padding: '8px 0 0', textAlign: 'right', fontWeight: 600, color: 'var(--accent)'}}>~$57</div>
      </div>
      <div style={{fontSize: 10.5, color: 'var(--ink-3)', fontStyle: 'italic', marginTop: 14, lineHeight: 1.5}}>
        For 3D-printed prototype: skip injection-mold parts ($3.20) and print outer dome, chassis, bezel, plate, and baffle in PLA/PETG. Add ~$2 in filament + ~6 hrs print time per unit.
        UL217 / UL2034 certification not included — budget $25–60k for compliance testing on the production form.
      </div>
    </div>
  );
}

window.CairnBOM = CairnBOM;
