// Web-friendly single-column layout. Each artboard renders at its native
// pixel size and scales down via CSS transform to fit the container width.

function Board({ width, height, children }) {
  const wrapRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const update = () => {
      if (!wrapRef.current) return;
      const w = wrapRef.current.clientWidth;
      setScale(w / width);
    };
    update();
    const ro = new ResizeObserver(update);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener('resize', update);
    return () => { ro.disconnect(); window.removeEventListener('resize', update); };
  }, [width]);

  return (
    <div className="board" ref={wrapRef} style={{ height: height * scale }}>
      <div className="board-inner" style={{ width, height, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

function Section({ id, eyebrow, title, lede, children }) {
  return (
    <section id={id} className="section">
      <div className="section-head">
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        {lede && <p>{lede}</p>}
      </div>
      <div className="board-wrap">{children}</div>
    </section>
  );
}

function App() {
  return (
    <>
      <header className="top">
        <div className="brand">Cairn<span style={{ color: 'var(--ink-3)', fontWeight: 300, marginLeft: 10, fontSize: 13, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>SMOKE · CO · LIGHT</span></div>
        <nav>
          <a href="#concept">CONCEPT</a>
          <a href="#forms">FORMS</a>
          <a href="#tech">TECH</a>
          <a href="#colors">COLORS</a>
          <a href="#smart">PRO</a>
          <a href="#bom">BOM</a>
        </nav>
      </header>

      <Section id="concept" eyebrow="01 — Concept"
        title="A detector that disappears, then lights your way home."
        lede="A ceiling-mounted smoke and carbon-monoxide detector with a motion-activated downlight. Same shape, two brains: standard and Pro.">
        <Board width={1600} height={1100}><window.CairnCover /></Board>
      </Section>

      <Section id="context" eyebrow="02 — In context"
        title="Hallway, 22:14"
        lede="PIR detects motion, ambient sensor confirms night. Soft 280ms ramp, holds 90s, fades.">
        <Board width={1600} height={1100}><window.CairnLifestyle /></Board>
      </Section>

      <Section id="forms" eyebrow="03 — Form studies"
        title="Four variants on the disc"
        lede="Same problem, four answers. Halo (flush bezel), Pebble (soft dome — recommended), Stack (sectioned layers), Tier (recessed downlight).">
        <div className="grid-4">
          <Board width={900} height={1100}><window.CairnFormHalo /></Board>
          <Board width={900} height={1100}><window.CairnFormPebble /></Board>
          <Board width={900} height={1100}><window.CairnFormStack /></Board>
          <Board width={900} height={1100}><window.CairnFormTier /></Board>
        </div>
      </Section>

      <Section id="tech" eyebrow="04 — Orthographic"
        title="Bottom view & elevation"
        lede="The recommended Pebble form, drawn straight.">
        <div className="grid-2">
          <Board width={1100} height={1100}><window.CairnOrthoFront /></Board>
          <Board width={1100} height={700}><window.CairnOrthoSide /></Board>
        </div>
      </Section>

      <Section id="cross" eyebrow="05 — Cross-section"
        title="What's inside"
        lede="Mains step-down, LiFePO4 backup, photoelectric smoke chamber, electrochemical CO sensor, PIR, ambient light, tunable LED ring, and a 5-step Kelvin detent dial.">
        <Board width={1400} height={900}><window.CairnCrossSection /></Board>
      </Section>

      <Section id="colors" eyebrow="06 — Colorways"
        title="Six finishes"
        lede="Soft-touch matte polycarbonate, UV-stable for the 10-year service life.">
        <Board width={1800} height={1000}><window.CairnColorways /></Board>
      </Section>

      <Section id="dial" eyebrow="07 — Kelvin dial"
        title="Five clicks. No app. No drift."
        lede="A mechanical detent dial guarantees every unit on a hallway is set to the same color temperature.">
        <Board width={1600} height={1000}><window.CairnDial /></Board>
      </Section>

      <Section id="install" eyebrow="08 — Mounting & power"
        title="Mains, battery, USB-C"
        lede="Junction-box install or surface-mount with twist-base. Recharge via USB-C in ~2 hours.">
        <Board width={1800} height={1000}><window.CairnInstall /></Board>
      </Section>

      <Section id="smart" eyebrow="09 — Cairn Pro"
        title="Same body, different brain."
        lede="The Pro adds temperature, humidity, and a Matter-over-Thread radio. Spotted by a single matte amber dot below the lens.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Board width={1800} height={1000}><window.CairnSKU /></Board>
          <Board width={1800} height={1100}><window.CairnMesh /></Board>
        </div>
      </Section>

      <Section id="bom" eyebrow="10 — Bill of materials"
        title="What it's made of"
        lede="Candidate parts, 1k-unit pricing, plus 3D-print breakdown for prototyping.">
        <Board width={1800} height={1200}><window.CairnBOM /></Board>
      </Section>

      <footer className="foot">
        <div style={{
          fontFamily: "'Fraunces', serif",
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '15px',
          letterSpacing: 0,
          textTransform: 'none',
          color: 'var(--ink-2)',
          marginBottom: '18px',
          paddingBottom: '18px',
          borderBottom: '1px solid var(--rule-soft)',
          maxWidth: '420px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: 1.4,
        }}>
          And if you’ve read this far — tell me how the fireworks were last night.
        </div>
        CAIRN · INDUSTRIAL DESIGN · R.0 · 2026.04
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
