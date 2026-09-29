/* One host captures a selected browser tab; guests never capture audio. */
(() => {
  let stream = null, recorder = null, running = false, timer = null, request = null;
  const queue = [];
  let uploading = false, starting = false, generation = 0;
  const ui = () => window.devday;
  const status = text => ui()?.setCaptionStatus(text);
  function stop(message = 'Caption capture stopped.') {
    running = false;
    starting = false;
    generation++;
    clearTimeout(timer);
    if (recorder?.state === 'recording') recorder.stop();
    stream?.getTracks().forEach(track => track.stop());
    stream = null;
    queue.length = 0;
    request?.abort();
    status(message);
    const start = document.getElementById('captionStart'), end = document.getElementById('captionStop');
    if (start) start.disabled = !ui()?.getHostKey() || !ui()?.getFeatures()?.captions;
    if (end) end.disabled = true;
  }
  async function upload() {
    if (uploading || !running) return;
    uploading = true;
    try {
      while (queue.length && running) {
        const audio = queue.shift(), form = new FormData();
        form.append('audio', audio, audio.type.includes('mp4') ? 'speech.mp4' : 'speech.webm');
        request = new AbortController();
        const response = await fetch(`${ui().relayHttp}/caption`, {
          method: 'POST', headers: { Authorization: `Bearer ${ui().getHostKey()}` }, body: form,
          signal: AbortSignal.any([request.signal, AbortSignal.timeout(45000)]),
        });
        if (!response.ok) throw new Error(`Captions unavailable (${response.status}). Capture stopped.`);
        await response.json();
        if (running) status('Captions active · machine translated · delayed');
      }
    } catch (error) {
      if (running) stop(error.message || 'Caption connection failed.');
    } finally { uploading = false; request = null; }
  }
  function recordChunk() {
    if (!running || !stream) return;
    const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(type => MediaRecorder.isTypeSupported(type));
    if (!mimeType) { stop('This browser cannot record tab audio. Try desktop Chrome.'); return; }
    const parts = [];
    recorder = new MediaRecorder(new MediaStream(stream.getAudioTracks()), { mimeType });
    recorder.ondataavailable = event => { if (event.data.size) parts.push(event.data); };
    recorder.onerror = () => stop('Audio recording failed. Select the stream tab again.');
    recorder.onstop = () => {
      if (!running) return;
      // Each stop completes its own playable container; timeslice fragments are not uploads.
      const blob = new Blob(parts, { type: mimeType });
      if (blob.size > 256) queue.push(blob);
      if (queue.length > 3) { stop('Translation is falling behind. Capture stopped to avoid stale captions.'); return; }
      recordChunk();
      void upload();
    };
    recorder.start();
    timer = setTimeout(() => { if (recorder?.state === 'recording') recorder.stop(); }, 7000);
  }
  document.getElementById('captionStart')?.addEventListener('click', async () => {
    if (running || uploading || starting) return;
    if (!ui()?.getHostKey()) { status('Unlock host controls first.'); return; }
    if (!navigator.mediaDevices?.getDisplayMedia || !window.MediaRecorder) { status('Tab audio capture needs a supported desktop browser. Try Chrome.'); return; }
    starting = true;
    const attempt = ++generation;
    document.getElementById('captionStart').disabled = true;
    try {
      status('Select the keynote browser tab and enable Share tab audio.');
      const selected = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: { suppressLocalAudioPlayback: false }, selfBrowserSurface: 'exclude', systemAudio: 'exclude' });
      if (attempt !== generation) { selected.getTracks().forEach(track => track.stop()); return; }
      stream = selected;
      starting = false;
      if (!stream.getAudioTracks().length) { stop('No audio selected. Choose the keynote tab and tick Share tab audio.'); return; }
      running = true;
      stream.getTracks().forEach(track => track.addEventListener('ended', () => stop()));
      document.getElementById('captionStart').disabled = true;
      document.getElementById('captionStop').disabled = false;
      status('Listening to selected tab · first captions follow shortly');
      recordChunk();
    } catch { stop('Audio sharing was cancelled or unavailable.'); }
  });
  document.getElementById('captionStop')?.addEventListener('click', () => stop());
  window.addEventListener('pagehide', () => stop());
  window.addEventListener('devday:connection', event => { if (!event.detail.connected && (running || starting)) stop('Room disconnected. Capture stopped.'); });
  window.addEventListener('devday:auth', event => {
    const enabled = event.detail.host && event.detail.features?.captions;
    document.getElementById('captionStart').disabled = !enabled || running || starting;
    if (!enabled && (running || starting)) stop('Caption access unavailable. Capture stopped.');
  });
})();
