const API_ORIGIN = document.querySelector('meta[name="belcanto-api"]')?.content?.replace(/\/$/, '') || ''
const TOKEN_KEY = 'belcanto-visitor-v1'

async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {})
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const response = await fetch(`${API_ORIGIN}${path}`, { ...options, headers })
  const refreshed = response.headers.get('X-Belcanto-Visitor')
  if (refreshed) localStorage.setItem(TOKEN_KEY, refreshed)
  return response
}

async function authenticatedMediaUrl(path) {
  const response = await apiFetch(path)
  if (!response.ok) throw new Error('audio-fetch-failed')
  return URL.createObjectURL(await response.blob())
}

const $ = selector => document.querySelector(selector)
const form = $('#analysis-form')
const songInput = $('#song')
const takeInput = $('#take')
const submit = $('#submit')
const formStatus = $('#form-status')
const current = $('#current')
const reportTitle = $('#report-title')
const report = $('#report')
const pitchChart = $('#pitch-chart')
const quota = $('#quota')
const historyList = $('#history-list')
const recordButton = $('#record')
const repeatTakeButton = $('#repeat-take')
const stopButton = $('#stop-recording')
const recorderPanel = $('#recorder')
const recordTime = $('#record-time')
const takeName = $('#take-name')
const referenceAudio = $('#reference-audio')
const countInDisplay = $('#count-in-display')
const countInControls = Array.from(document.querySelectorAll('input[name="count-in-beats"]'))

let songFile = null
let takeFile = null
let mediaRecorder = null
let recordingStream = null
let recordingTimer = null
let recordingStartedAt = 0
let meterFrame = null
let replayContext = null
let replaySources = []

songInput.addEventListener('change', async () => {
  songFile = songInput.files[0] || null
  $('#song-name').textContent = songFile?.name || 'WAV, MP3, M4A, FLAC or AIFF'
  await prepareLocalAudio('reference', songFile)
  updateReadiness()
})

takeInput.addEventListener('change', async () => {
  takeFile = takeInput.files[0] || null
  takeName.textContent = takeFile?.name || 'No take recorded yet'
  await prepareLocalAudio('take', takeFile)
  updateReadiness()
})

recordButton.addEventListener('click', startRecording)
repeatTakeButton.addEventListener('click', repeatTake)
stopButton.addEventListener('click', stopRecording)
$('#clear-take').addEventListener('click', clearTake)

form.addEventListener('submit', async event => {
  event.preventDefault()
  if (!songFile || !takeFile) return
  setBusy(true)
  setPipeline('upload')
  formStatus.classList.remove('error')
  formStatus.textContent = 'Uploading both tracks…'

  const body = new FormData()
  body.append('song', songFile, songFile.name)
  body.append('take', takeFile, takeFile.name)

  try {
    const response = await apiFetch('/api/jobs', { method: 'POST', body })
    const job = await response.json()
    if (!response.ok) throw new Error(job.detail || 'The upload failed.')
    showPending(job)
    await poll(job.id)
  } catch (error) {
    formStatus.textContent = error.message
    formStatus.classList.add('error')
    clearPipeline()
  } finally {
    setBusy(false)
    await loadSession()
  }
})

async function startRecording() {
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    formStatus.textContent = 'This browser cannot record audio here. Choose a vocal file instead.'
    formStatus.classList.add('error')
    return
  }
  try {
    recordingStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      video: false
    })
    const mimeType = preferredRecordingType()
    mediaRecorder = new MediaRecorder(recordingStream, mimeType ? { mimeType } : undefined)
    const chunks = []
    mediaRecorder.addEventListener('dataavailable', event => {
      if (event.data.size) chunks.push(event.data)
    })
    mediaRecorder.addEventListener('stop', async () => {
      const type = mediaRecorder.mimeType || mimeType || 'audio/webm'
      const extension = type.includes('mp4') ? 'm4a' : type.includes('ogg') ? 'ogg' : 'webm'
      takeFile = new File(chunks, `belcanto-take-${Date.now()}.${extension}`, { type })
      takeName.textContent = `Recorded take · ${formatTime((Date.now() - recordingStartedAt) / 1000)}`
      await prepareLocalAudio('take', takeFile)
      updateReadiness()
      stopTracks()
    })
    await runCountIn()
    await startReferencePlaybackForRecording()
    mediaRecorder.start(250)
    recordingStartedAt = Date.now()
    recorderPanel.hidden = false
    recordButton.disabled = true
    takeInput.disabled = true
    recordingTimer = setInterval(() => {
      recordTime.textContent = formatTime((Date.now() - recordingStartedAt) / 1000)
    }, 200)
    drawLiveMeter(recordingStream)
  } catch (error) {
    stopTracks()
    recorderPanel.hidden = true
    recordButton.disabled = false
    takeInput.disabled = false
    formStatus.textContent = error.name === 'NotAllowedError'
      ? 'Microphone access was not granted. You can still choose a vocal file.'
      : error.message === 'reference-playback-failed'
        ? 'Recording could not start because the reference/backing track was not ready to play. Press Record again, or choose a vocal file.'
      : 'The microphone could not be started. Choose a vocal file instead.'
    formStatus.classList.add('error')
  }
}

function stopRecording() {
  if (mediaRecorder?.state === 'recording') mediaRecorder.stop()
  referenceAudio.pause()
  recorderPanel.hidden = true
  recordButton.disabled = false
  takeInput.disabled = false
  clearInterval(recordingTimer)
  cancelAnimationFrame(meterFrame)
}

function selectedCountInBeats() {
  return Number(document.querySelector('input[name="count-in-beats"]:checked')?.value || 2)
}

async function runCountIn() {
  const beats = selectedCountInBeats()
  recordButton.disabled = true
  takeInput.disabled = true
  countInControls.forEach(control => { control.disabled = true })
  countInDisplay.hidden = false
  for (let beat = beats; beat > 0; beat -= 1) {
    countInDisplay.textContent = beat === beats ? `Count-in ${beats} beats` : String(beat)
    await delay(600)
  }
  countInDisplay.textContent = 'Sing now'
  await delay(250)
  countInDisplay.hidden = true
  countInControls.forEach(control => { control.disabled = false })
}

async function startReferencePlaybackForRecording() {
  if (!songFile || !referenceAudio.src) return
  referenceAudio.pause()
  referenceAudio.currentTime = 0
  try {
    await waitForMediaReady(referenceAudio)
    await referenceAudio.play()
  } catch {
    referenceAudio.pause()
    throw new Error('reference-playback-failed')
  }
}

function waitForMediaReady(audio) {
  if (audio.readyState >= 2) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      audio.removeEventListener('canplay', onReady)
      audio.removeEventListener('error', onError)
    }
    const onReady = () => { cleanup(); resolve() }
    const onError = () => { cleanup(); reject(new Error('media-not-ready')) }
    audio.addEventListener('canplay', onReady, { once: true })
    audio.addEventListener('error', onError, { once: true })
  })
}

function stopTracks() {
  recordingStream?.getTracks().forEach(track => track.stop())
  recordingStream = null
}

function clearTake() {
  takeFile = null
  takeInput.value = ''
  takeName.textContent = 'No take recorded yet'
  const audio = $('#take-audio')
  audio.pause()
  if (audio.src) URL.revokeObjectURL(audio.src)
  audio.removeAttribute('src')
  $('#take-waveform').hidden = true
  updateReadiness()
}

function repeatTake() {
  clearTake()
  startRecording()
}

function preferredRecordingType() {
  return ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus']
    .find(type => MediaRecorder.isTypeSupported(type)) || ''
}

async function prepareLocalAudio(kind, file) {
  const shell = $(`#${kind}-waveform`)
  const audio = $(`#${kind}-audio`)
  if (!file) {
    shell.hidden = true
    return
  }
  if (audio.src) URL.revokeObjectURL(audio.src)
  audio.src = URL.createObjectURL(file)
  shell.hidden = false
  try {
    const context = new AudioContext()
    const buffer = await context.decodeAudioData(await file.arrayBuffer())
    drawWaveform(shell.querySelector('canvas'), buffer.getChannelData(0))
    await context.close()
  } catch {
    drawPlaceholderWaveform(shell.querySelector('canvas'))
  }
  wireTransport(kind, audio)
}

function drawWaveform(canvas, samples) {
  const { context, width, height } = canvasContext(canvas)
  context.clearRect(0, 0, width, height)
  context.fillStyle = '#10110e'
  context.fillRect(0, 0, width, height)
  context.strokeStyle = '#d4ff45'
  context.lineWidth = Math.max(1, devicePixelRatio)
  const middle = height / 2
  const columns = Math.floor(width / 2)
  const stride = Math.max(1, Math.floor(samples.length / columns))
  context.beginPath()
  for (let x = 0; x < columns; x += 1) {
    let peak = 0
    const start = x * stride
    for (let i = start; i < Math.min(start + stride, samples.length); i += 1) peak = Math.max(peak, Math.abs(samples[i]))
    const px = x * 2
    context.moveTo(px, middle - peak * middle * .86)
    context.lineTo(px, middle + peak * middle * .86)
  }
  context.stroke()
}

function drawPlaceholderWaveform(canvas) {
  const samples = Float32Array.from({ length: 2000 }, (_, index) => Math.sin(index / 13) * (.15 + Math.random() * .25))
  drawWaveform(canvas, samples)
}

function wireTransport(kind, audio) {
  const button = document.querySelector(`[data-play="${kind}"]`)
  const seek = $(`#${kind}-seek`)
  const time = $(`#${kind}-time`)
  button.onclick = () => audio.paused ? audio.play() : audio.pause()
  seek.oninput = () => {
    if (audio.duration) audio.currentTime = audio.duration * Number(seek.value) / 1000
  }
  audio.ontimeupdate = () => {
    seek.value = audio.duration ? Math.round(audio.currentTime / audio.duration * 1000) : 0
    time.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`
  }
  audio.onplay = () => { button.textContent = '❚❚' }
  audio.onpause = () => { button.textContent = '▶' }
  audio.onloadedmetadata = audio.ontimeupdate
}

function drawLiveMeter(stream) {
  const context = new AudioContext()
  const source = context.createMediaStreamSource(stream)
  const analyser = context.createAnalyser()
  analyser.fftSize = 256
  source.connect(analyser)
  const values = new Uint8Array(analyser.frequencyBinCount)
  const canvas = $('#live-meter')
  const draw = () => {
    analyser.getByteTimeDomainData(values)
    const surface = canvasContext(canvas)
    surface.context.clearRect(0, 0, surface.width, surface.height)
    surface.context.strokeStyle = '#ff654f'
    surface.context.lineWidth = 2 * devicePixelRatio
    surface.context.beginPath()
    values.forEach((value, index) => {
      const x = index / (values.length - 1) * surface.width
      const y = value / 255 * surface.height
      index ? surface.context.lineTo(x, y) : surface.context.moveTo(x, y)
    })
    surface.context.stroke()
    meterFrame = requestAnimationFrame(draw)
  }
  draw()
}

async function poll(id) {
  for (;;) {
    await delay(1400)
    const response = await apiFetch(`/api/jobs/${id}`)
    if (!response.ok) throw new Error('The analysis could not be found.')
    const job = await response.json()
    if (job.status === 'succeeded') {
      setPipeline('compare', true)
      renderReport(job)
      return
    }
    if (job.status === 'failed') throw new Error(job.error || 'The audio could not be analyzed.')
    setPipeline(job.status === 'running' ? 'separate' : 'upload')
    formStatus.textContent = job.status === 'running'
      ? 'Separating the original vocal and tracking both performances…'
      : 'Your analysis is queued…'
  }
}

function showPending() {
  current.hidden = false
  reportTitle.textContent = 'Listening closely…'
  report.innerHTML = '<p class="report-summary">The original vocal is being isolated before both performances are aligned phrase by phrase. This can take a few minutes on the preview server.</p>'
  pitchChart.hidden = true
  formStatus.textContent = 'Your analysis has started.'
  current.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function renderReport(job) {
  const result = job.result || {}
  const phrases = result.phrases || []
  reportTitle.textContent = phrases.length ? `${phrases.length} phrase${phrases.length === 1 ? '' : 's'} heard` : 'No clear voiced phrases found'
  formStatus.textContent = 'Analysis complete.'
  const average = phrases.length ? phrases.reduce((sum, phrase) => sum + Math.abs(phrase.mean_cents), 0) / phrases.length : 0
  const worst = phrases.length ? Math.max(...phrases.map(phrase => phrase.max_abs_cents)) : 0
  const runtime = ((result.timings_ms?.total || 0) / 1000).toFixed(1)
  const phraseCards = phrases.map((phrase, index) => {
    const value = Number(phrase.mean_cents)
    const width = Math.min(50, Math.abs(value) / 4)
    const phraseDetails = renderPhraseDetails(phrase)
    return `<article class="phrase-card" data-cents="${value}" data-bar-left="${50 - (value < 0 ? width : 0)}" data-bar-width="${width}">
      <span class="phrase-index">${String(index + 1).padStart(2, '0')}</span>
      <div><strong>${Number(phrase.start_s).toFixed(1)}–${Number(phrase.end_s).toFixed(1)} seconds</strong>
        <div class="phrase-bar"><span></span></div>
        ${phraseDetails}
      </div>
      <span class="phrase-value">${signed(value)}¢</span>
    </article>`
  }).join('')
  const warnings = (result.warnings || []).map(warning => `<p class="warning">${escapeHtml(warning)}</p>`).join('')

  report.innerHTML = `<p class="report-summary">Positive values ran sharp of the reference; negative values ran flat. Belcanto reports the difference before pretending it knows whether the difference was expressive.</p>
    <div class="report-replay" aria-label="Shared-clock A/B replay">
      <button id="ab-replay" class="button primary" type="button" aria-pressed="false">Play shared-clock A/B replay</button>
      <span id="ab-replay-status" class="muted" aria-live="polite">Hear decoded original and take buffers launched on one audio clock.</span>
    </div>
    <div class="report-player">
      <div><span class="metric-label">Original</span><audio data-report-audio="reference" data-media-path="/api/jobs/${job.id}/media/song" controls preload="metadata"></audio></div>
      <div><span class="metric-label">Your take</span><audio data-report-audio="take" data-media-path="/api/jobs/${job.id}/media/take" controls preload="metadata"></audio></div>
    </div>
    <div class="metrics">
      <div class="metric"><span class="metric-label">Mean pitch distance</span><div class="metric-value">${average.toFixed(1)}¢</div></div>
      <div class="metric"><span class="metric-label">Largest offset</span><div class="metric-value">${worst.toFixed(1)}¢</div></div>
      <div class="metric"><span class="metric-label">Analysis time</span><div class="metric-value">${runtime}s</div></div>
    </div>
    <div class="phrase-grid">${phraseCards}</div>${warnings}`
  report.querySelectorAll('.phrase-card').forEach(card => {
    const bar = card.querySelector('.phrase-bar span')
    bar.style.left = `${card.dataset.barLeft}%`
    bar.style.width = `${card.dataset.barWidth}%`
  })
  drawPitchChart(phrases)
  current.hidden = false
  hydrateReportMedia()
  wireReportReplay()
}

async function hydrateReportMedia() {
  const players = Array.from(report.querySelectorAll('[data-media-path]'))
  await Promise.all(players.map(async player => {
    player.src = await authenticatedMediaUrl(player.dataset.mediaPath)
  }))
}

function renderPhraseDetails(phrase) {
  const pitch = phrase.pitch || {}
  const timing = phrase.timing || {}
  const direction = String(pitch.direction || pitchDirection(phrase.mean_cents))
  const magnitude = Number(pitch.magnitude_cents ?? Math.abs(Number(phrase.mean_cents) || 0))
  const timingObservation = timing.observation ? escapeHtml(timing.observation) : 'timing not measured'
  const action = nextTakeAction(
    direction,
    magnitude,
    Number(timing.onset_delta_ms || 0),
    Number(timing.duration_delta_ms || 0),
  )
  return `<p class="phrase-detail">timing ${timingObservation}; next take: ${escapeHtml(action)}</p>`
}

function pitchDirection(meanCents) {
  const value = Number(meanCents) || 0
  if (value > 0) return 'sharp'
  if (value < 0) return 'flat'
  return 'in tune'
}

function nextTakeAction(direction, magnitudeCents, onsetDeltaMs, durationDeltaMs) {
  const timingAction = timingActionFor(onsetDeltaMs, durationDeltaMs)
  const pitchAction = pitchActionFor(direction, magnitudeCents)
  if (timingAction && pitchAction) return `${timingAction} and ${pitchAction} through this phrase`
  if (timingAction) return `${timingAction} through this phrase`
  if (pitchAction) return `${pitchAction} through this phrase`
  return 'repeat this phrase with the same pitch center and entrance'
}

function timingActionFor(onsetDeltaMs, durationDeltaMs) {
  if (onsetDeltaMs < 0) return `start ${Math.abs(onsetDeltaMs)} ms later`
  if (onsetDeltaMs > 0) return `start ${onsetDeltaMs} ms earlier`
  if (durationDeltaMs > 0) return `release ${durationDeltaMs} ms earlier`
  if (durationDeltaMs < 0) return `hold ${Math.abs(durationDeltaMs)} ms longer`
  return ''
}

function pitchActionFor(direction, magnitudeCents) {
  if (direction === 'flat') return `aim ${Math.round(magnitudeCents)} cents higher`
  if (direction === 'sharp') return `aim ${Math.round(magnitudeCents)} cents lower`
  return ''
}

function wireReportReplay() {
  const button = $('#ab-replay')
  if (!button) return
  const reference = report.querySelector('[data-report-audio="reference"]')
  const take = report.querySelector('[data-report-audio="take"]')
  const status = $('#ab-replay-status')
  const setReplayState = playing => {
    button.textContent = playing ? 'Stop shared-clock A/B replay' : 'Play shared-clock A/B replay'
    button.setAttribute('aria-pressed', String(playing))
    status.textContent = playing ? 'Original and take are playing from the shared audio clock.' : 'Replay stopped.'
  }
  button.onclick = async () => {
    if (!reference || !take) return
    if (replaySources.length) {
      stopSharedClockReplay()
      setReplayState(false)
      return
    }
    reference.pause()
    take.pause()
    reference.currentTime = 0
    take.currentTime = 0
    try {
      await startSharedClockReplay(reference.src, take.src, () => setReplayState(false))
      setReplayState(true)
    } catch {
      setReplayState(false)
      status.textContent = 'Shared-clock replay could not start. Use the individual players for coordinated manual A/B playback.'
    }
  }
}

async function startSharedClockReplay(referenceSrc, takeSrc, onEnded) {
  stopSharedClockReplay()
  replayContext = replayContext || new AudioContext()
  await replayContext.resume?.()
  const [referenceBuffer, takeBuffer] = await Promise.all([
    fetchDecodedBuffer(replayContext, referenceSrc),
    fetchDecodedBuffer(replayContext, takeSrc),
  ])
  const startAt = replayContext.currentTime + 0.05
  replaySources = [referenceBuffer, takeBuffer].map(buffer => {
    const source = replayContext.createBufferSource()
    source.buffer = buffer
    source.connect(replayContext.destination)
    source.addEventListener?.('ended', () => {
      if (replaySources.includes(source)) {
        stopSharedClockReplay()
        onEnded?.()
      }
    }, { once: true })
    source.start(startAt)
    return source
  })
}

async function fetchDecodedBuffer(context, src) {
  const response = await apiFetch(src)
  if (!response.ok) throw new Error('audio-fetch-failed')
  return context.decodeAudioData(await response.arrayBuffer())
}

function stopSharedClockReplay() {
  replaySources.forEach(source => {
    try { source.stop() } catch {}
  })
  replaySources = []
}

function drawPitchChart(phrases) {
  if (!phrases.length) {
    pitchChart.hidden = true
    return
  }
  pitchChart.hidden = false
  const { context, width, height } = canvasContext(pitchChart)
  context.clearRect(0, 0, width, height)
  context.fillStyle = '#141511'
  context.fillRect(0, 0, width, height)
  const padding = 36 * devicePixelRatio
  const max = Math.max(100, ...phrases.map(item => Math.abs(item.mean_cents)))
  context.strokeStyle = '#34362e'
  context.beginPath()
  context.moveTo(padding, height / 2)
  context.lineTo(width - padding, height / 2)
  context.stroke()
  context.strokeStyle = '#d4ff45'
  context.lineWidth = 2 * devicePixelRatio
  context.beginPath()
  phrases.forEach((phrase, index) => {
    const x = padding + index / Math.max(1, phrases.length - 1) * (width - padding * 2)
    const y = height / 2 - phrase.mean_cents / max * (height / 2 - padding)
    index ? context.lineTo(x, y) : context.moveTo(x, y)
  })
  context.stroke()
}

async function loadSession() {
  try {
    const response = await apiFetch('/api/session')
    const session = await response.json()
    quota.textContent = `${session.free_jobs_remaining} of ${session.free_jobs_per_day} free today`
    renderHistory(session.jobs || [])
  } catch {
    quota.textContent = 'Free private preview'
  }
}

function renderHistory(jobs) {
  if (!jobs.length) {
    historyList.innerHTML = '<p class="muted">Nothing here yet. Your finished analyses return with this browser.</p>'
    return
  }
  historyList.innerHTML = jobs.map(job => `<div class="history-item" data-job-id="${job.id}" role="button" tabindex="0">
      <span><strong>${escapeHtml(job.take_name)}</strong><small>Against ${escapeHtml(job.song_name)}</small></span>
      <span class="pill">${escapeHtml(job.status)}</span>
      <button class="delete-button" type="button" data-delete="${job.id}" aria-label="Delete this analysis">Delete</button>
    </div>`).join('')
  historyList.querySelectorAll('[data-job-id]').forEach(item => {
    const open = async () => {
      const response = await apiFetch(`/api/jobs/${item.dataset.jobId}`)
      const job = await response.json()
      if (job.status === 'succeeded') renderReport(job)
      else if (job.status === 'failed') showError(job.error)
      else showPending(job)
      current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    item.addEventListener('click', event => { if (!event.target.closest('[data-delete]')) open() })
    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        open()
      }
    })
  })
  historyList.querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', async () => {
    button.disabled = true
    const response = await apiFetch(`/api/jobs/${button.dataset.delete}`, { method: 'DELETE' })
    if (response.ok) await loadSession()
  }))
}

function showError(message) {
  current.hidden = false
  reportTitle.textContent = 'Analysis failed'
  report.innerHTML = `<p class="report-summary">${escapeHtml(message)}</p>`
}

function updateReadiness() {
  submit.disabled = !(songFile && takeFile)
  repeatTakeButton.hidden = !takeFile
}

function setBusy(busy) {
  submit.disabled = busy || !(songFile && takeFile)
  songInput.disabled = busy
  takeInput.disabled = busy
  recordButton.disabled = busy
}

function setPipeline(stage, completed = false) {
  const order = ['upload', 'separate', 'track', 'compare']
  const currentIndex = order.indexOf(stage)
  document.querySelectorAll('[data-stage]').forEach(element => {
    const index = order.indexOf(element.dataset.stage)
    element.classList.toggle('done', completed || index < currentIndex)
    element.classList.toggle('active', !completed && index === currentIndex)
  })
}

function clearPipeline() {
  document.querySelectorAll('[data-stage]').forEach(element => element.classList.remove('done', 'active'))
}

function canvasContext(canvas) {
  const rect = canvas.getBoundingClientRect()
  const ratio = devicePixelRatio || 1
  canvas.width = Math.max(1, Math.floor(rect.width * ratio))
  canvas.height = Math.max(1, Math.floor(rect.height * ratio))
  return { context: canvas.getContext('2d'), width: canvas.width, height: canvas.height }
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00'
  const rounded = Math.max(0, Math.floor(seconds))
  return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, '0')}`
}

function signed(value) {
  const number = Number(value)
  return `${number >= 0 ? '+' : ''}${number.toFixed(1)}`
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character])
}

const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))
loadSession()
updateReadiness()
