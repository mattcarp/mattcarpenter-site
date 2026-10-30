
(() => {
  const root = document.getElementById('archbishop-retouch')
  const photos = {"lounge":{"name":"Lounge","ratio":"4 / 3","note":"Cleaner cream tones · brighter seating · more separation in the limestone and rug","before":"assets/lounge-original.jpg","after":"assets/lounge-retouched.jpg"},"bedroom":{"name":"Bedroom","ratio":"4 / 3","note":"More readable shadows · warmer timber and leather · chandelier relit in this AI proposal","before":"assets/bedroom-original.jpg","after":"assets/bedroom-retouched.jpg"},"courtyard":{"name":"Courtyard","ratio":"1600 / 1347","note":"Warmer limestone · clearer planting · softer glass glare · dusk atmosphere retained","before":"assets/courtyard-original.jpg","after":"assets/courtyard-retouched.jpg"}}
  const studies = root.querySelector('.studies')
  const template = studies.querySelector('.study')
  const sections = {}
  const positions = { lounge:50, bedroom:50, courtyard:50 }
  let saved = null
  try { saved = JSON.parse(localStorage.getItem('retouches-dividers')) } catch {}
  const clamp = value => Math.max(0, Math.min(100, value))
  function restore(state) {
    for (const key of Object.keys(photos)) {
      if (Number.isFinite(state?.dividers?.[key])) positions[key] = clamp(state.dividers[key])
    }
    if (photos[state?.photo] && Number.isFinite(state.reveal)) positions[state.photo] = clamp(state.reveal)
  }
  restore(saved)
  function save() {
    try { localStorage.setItem('retouches-dividers', JSON.stringify({ dividers:{ ...positions } })) } catch {}
  }
  Object.entries(photos).forEach(([key, photo], index) => {
    const section = index === 0 ? template : template.cloneNode(true)
    if (index !== 0) studies.append(section)
    section.dataset.photo = key
    const heading = section.querySelector('h3')
    heading.textContent = photo.name
    heading.id = `${key}-heading`
    section.setAttribute('aria-labelledby', heading.id)
    const comparison = section.querySelector('.comparison')
    const original = section.querySelector('.original')
    const retouched = section.querySelector('.retouched')
    const divider = section.querySelector('.divider')
    const handle = section.querySelector('.drag-handle')
    const range = section.querySelector('input[type="range"]')
    const output = section.querySelector('output')
    const help = section.querySelector('.comparison + .photo-labels + div')
    range.id = `${key}-reveal`
    range.setAttribute('aria-label', `${photo.name} divider: original left, retouched right`)
    section.querySelector('label').setAttribute('for', range.id)
    output.id = `${key}-percent`
    help.id = `${key}-help`
    handle.setAttribute('aria-describedby', help.id)
    handle.setAttribute('aria-label', `Drag ${photo.name.toLowerCase()} comparison handle: original left, retouched right`)
    comparison.setAttribute('aria-label', `${photo.name}: original and AI-retouched photograph`)
    original.src = photo.before
    retouched.src = photo.after
    original.alt = `${photo.name}, original photograph from 50archbishop.com`
    retouched.alt = `${photo.name}, AI-assisted retouch preview`
    comparison.style.aspectRatio = photo.ratio
    section.querySelector('.note').textContent = `Edits shown: ${photo.note}`
    function setReveal(value) {
      value = clamp(value)
      positions[key] = value
      range.value = value
      retouched.style.clipPath = `inset(0 0 0 ${value}%)`
      divider.style.left = `${value}%`
      divider.hidden = value === 0 || value === 100
      handle.style.left = `clamp(24px, ${value}%, calc(100% - 24px))`
      section.querySelector('.original-label').hidden = value < 20
      section.querySelector('.retouched-label').hidden = value > 80
      output.value = `${value}%`
      section.querySelectorAll('[data-reveal]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.reveal) === value)))
    }
    sections[key] = setReveal
    section.querySelectorAll('[data-reveal]').forEach(button => button.addEventListener('click', () => { setReveal(Number(button.dataset.reveal)); save() }))
    range.addEventListener('input', () => setReveal(Number(range.value)))
    range.addEventListener('change', save)
    let activePointer = null
    function moveDivider(event) {
      const bounds = comparison.getBoundingClientRect()
      setReveal(Math.round((event.clientX - bounds.left) / bounds.width * 100))
    }
    comparison.addEventListener('pointerdown', event => {
      if (event.button !== 0) return
      activePointer = event.pointerId
      comparison.setPointerCapture(activePointer)
      moveDivider(event)
    })
    comparison.addEventListener('pointermove', event => {
      if (event.pointerId === activePointer) moveDivider(event)
    })
    function stopDragging(event) {
      if (event.pointerId !== activePointer) return
      activePointer = null
      if (comparison.hasPointerCapture(event.pointerId)) comparison.releasePointerCapture(event.pointerId)
      save()
    }
    comparison.addEventListener('pointerup', stopDragging)
    comparison.addEventListener('pointercancel', stopDragging)
    handle.addEventListener('keydown', event => {
      const keys = { ArrowLeft:Number(range.value) - 5, ArrowRight:Number(range.value) + 5, Home:0, End:100 }
      if (!(event.key in keys)) return
      event.preventDefault()
      setReveal(keys[event.key])
      save()
    })
    setReveal(positions[key])
  })
})()
