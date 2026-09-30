'use strict';
(() => {
  const $ = (id) => document.getElementById(id);
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  let relayHttp = local ? 'http://127.0.0.1:8790' : 'https://devday-relay.matt-889.workers.dev';
  if (local) { try { const override = new URL(new URLSearchParams(location.search).get('relay')); if (['localhost','127.0.0.1'].includes(override.hostname) && ['ws:','wss:','http:','https:'].includes(override.protocol)) relayHttp = override.origin.replace(/^ws/, 'http'); } catch { /* Default local relay. */ } }
  const wsUrl = relayHttp.replace(/^http/, 'ws') + '/ws';
  const read = (key, fallback = '') => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Private browsing still works. */ } };
  const id = read('devday-v2-id', crypto.randomUUID().replaceAll('-', '').slice(0, 32));
  // Visitors who leave the name blank get a stable anonymous name so their messages thread together.
  const guestName = (() => {
    const saved = read('devday-v2-guest');
    if (/^SottoSound-\d{6}$/.test(saved)) return saved;
    const made = 'SottoSound-' + (100000 + crypto.getRandomValues(new Uint32Array(1))[0] % 900000);
    write('devday-v2-guest', made);
    return made;
  })();
  write('devday-v2-id', id);
  let socket, ready = false, host = false, hostKey = '', captions = [], language = 'mt', lastChat = 0, pending = null, toastTimer, lastReact = 0;
  let features = {}, latestCaption = 0;
  const params = new URLSearchParams(location.search);
  if (params.has('host')) {
    hostKey = params.get('host') || '';
    params.delete('host');
    history.replaceState(null, '', location.pathname + (params.size ? '?' + params : '') + location.hash);
  }
  $('name').value = read('devday-v2-name');
  $('message').value = read('devday-v2-draft');
  $('name').addEventListener('input', () => write('devday-v2-name', $('name').value));
  $('message').addEventListener('input', () => write('devday-v2-draft', $('message').value));
  const time = (ts) => new Date(ts || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const element = (tag, className, text) => { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; };
  function toast(text) { $('toast').textContent = text; $('toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').hidden = true, 4500); }
  function send(data) { if (!ready || socket.readyState !== WebSocket.OPEN) return false; socket.send(JSON.stringify(data)); return true; }
  function setCaptionStatus(text) { $('caption-status').textContent = text; }
  window.devday = { player: () => player, getHostKey: () => host && ready ? hostKey : '', relayHttp, setCaptionStatus, getFeatures: () => features };
  function connection(connected) {
    ready = connected;
    $('connection').textContent = connected ? 'Room connected' : 'Reconnecting';
    $('connection').classList.toggle('connected', connected);
    $('send').disabled = !connected;
    document.querySelectorAll('[data-reaction]').forEach(button => button.disabled = !connected);
    $('send-status').textContent = connected ? 'Shared with everyone here' : 'Not connected. Your draft is saved.';
    if (!connected) {
      host = false; $('host-controls').hidden = true; $('presence').textContent = '— in room';
      if (pending) { pending = null; $('send-status').textContent = 'Connection lost. Check the room before resending.'; }
      setCaptionStatus('Room disconnected · captions may be out of date');
    }
    window.dispatchEvent(new CustomEvent('devday:connection', {detail:{connected}}));
  }
  function addChat(data) {
    const list = $('chat'), nearBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 80;
    list.querySelector('.empty')?.remove();
    const row = element('article', 'chat-message');
    const meta = element('div', 'message-meta');
    meta.append(element('span', 'author', data.user || 'Guest'));
    if (data.host) meta.append(element('span', 'host-badge', 'HOST'));
    meta.append(element('time', '', time(data.ts)));
    row.append(meta, element('p', '', data.text || ''));
    list.append(row);
    while (list.children.length > 60) list.firstElementChild.remove();
    if (nearBottom) list.scrollTop = list.scrollHeight;
    if (pending && (data.clientId === pending.clientId || (!data.clientId && data.text === pending.text && data.user === pending.user))) {
      if ($('message').value === pending.text) { $('message').value = ''; write('devday-v2-draft', ''); }
      pending = null; $('send-status').textContent = 'Sent to the room'; $('send').disabled = !ready;
    }
  }
  function addLog(data) {
    const list = $('announcements'); list.querySelector('.empty')?.remove();
    const row = element('article', 'announcement'); row.append(element('time', '', time(data.ts)), element('p', '', data.text || ''));
    if (data.url) { try { const url = new URL(data.url); if (['https:', 'http:'].includes(url.protocol)) { const a = element('a', '', 'Source · ' + url.hostname); a.href = url.href; a.target = '_blank'; a.rel = 'noopener noreferrer'; row.append(a); } } catch { /* Invalid source links are omitted. */ } }
    if (data.jev?.topic) row.append(element('p', 'jev-tag', 'Jev · ' + data.jev.topic + ' · automatic classification'));
    list.prepend(row); while (list.children.length > 40) list.lastElementChild.remove();
  }
  function youtube(raw) {
    try { const url = new URL(raw); const hostname = url.hostname.toLowerCase(); let videoId;
      if (hostname === 'youtu.be') videoId = url.pathname.split('/')[1];
      else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(hostname)) videoId = url.searchParams.get('v') || (/^\/(?:live|embed|shorts)\//.test(url.pathname) ? url.pathname.split('/')[2] : '');
      return ['http:', 'https:'].includes(url.protocol) && /^[A-Za-z0-9_-]{11}$/.test(videoId || '') ? videoId : null;
    } catch { return null; }
  }
  // --- Player: muted autoplay at the live edge, Sound on, Back to the start, Jump to live ---
  // Positions are in stream seconds. OpenAI ran a two-minute countdown after the scheduled 19:00 (Malta) start,
  // so the keynote's real first frame is about 111 s after the scheduled time. For the known video the exact
  // point was measured on 29 Sep 2026 (countdown reached zero at 821 s; 3 s of pre-roll).
  const YT_ORIGIN = 'https://www.youtube-nocookie.com';
  const KEYNOTE_START_MS = Date.parse('2026-09-29T17:00:00Z');
  const KEYNOTE_LEAD_SECONDS = 111;
  // 30 Sep 2026: YouTube re-cut the recording (68 min -> 53 min, countdown removed); speech starts at about 0:20.
  const KNOWN_KEYNOTE_START = { Fls_onRviPM: 15 };
  const player = { videoId: null, scheduledPos: null, live: false, rewound: false, state: null, stateAt: Date.now(), time: null, movedTime: null, movedAt: Date.now(), heardAt: 0, nudged: false, reloadedAt: 0, captionsOff: false, soundTried: false, muted: null, userMuted: false, sent: [] };
  function ytSend(func, args) { player.sent.push(func); if (player.sent.length > 120) player.sent.shift(); const w = $('stream').contentWindow; if (w) w.postMessage(JSON.stringify({ event: 'command', func, args: args || [] }), YT_ORIGIN); }
  function ytListen() { const w = $('stream').contentWindow; if (w) w.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), YT_ORIGIN); }
  function updateSoundUi() {
    const soundOn = player.muted === false;
    $('unmute').hidden = !player.heardAt;
    $('unmute').textContent = soundOn ? 'Sound off' : 'Sound on';
    $('unmute').setAttribute('aria-pressed', String(soundOn));
    $('sound-prompt').hidden = !(player.state === 1 && !soundOn && !player.userMuted);
    if (soundOn && !player.rewound) $('stream-status').textContent = 'English audio \u00b7 live from OpenAI';
  }
  function captionsOff() { ytSend('unloadModule', ['captions']); ytSend('setOption', ['captions', 'track', {}]); }
  function keynoteStartPosition() {
    if (KNOWN_KEYNOTE_START[player.videoId] != null) return KNOWN_KEYNOTE_START[player.videoId];
    if (player.scheduledPos != null) return Math.max(0, player.scheduledPos + KEYNOTE_LEAD_SECONDS);
    return 0;
  }
  window.addEventListener('message', event => {
    if (event.origin !== YT_ORIGIN || event.source !== $('stream').contentWindow) return;
    let data; try { data = JSON.parse(event.data); } catch { return; }
    const info = data && data.event === 'infoDelivery' && data.info; if (!info) return;
    if (typeof info.muted === 'boolean') player.muted = info.muted;
    if (info.videoData && typeof info.videoData.isLive === 'boolean') { player.live = info.videoData.isLive; player.liveKnown = true; }
    // The first "playing" report after load is at the live edge: pin where the scheduled start sits in the stream.
    if (info.playerState === 1 && player.scheduledPos === null && player.live && typeof info.currentTime === 'number' && info.currentTime > 30) {
      player.scheduledPos = info.currentTime - (Date.now() - KEYNOTE_START_MS) / 1000;
    }
    // The broadcast has ended and YouTube serves it as a recording that starts at 0:00 (the countdown): open at the keynote itself.
    if (info.playerState === 1 && player.liveKnown && !player.live && !player.autoSeeked && KNOWN_KEYNOTE_START[player.videoId] != null && typeof info.currentTime === 'number') {
      player.autoSeeked = true;
      if (info.currentTime < KNOWN_KEYNOTE_START[player.videoId] - 5) { ytSend('seekTo', [KNOWN_KEYNOTE_START[player.videoId], true]); player.time = KNOWN_KEYNOTE_START[player.videoId]; }
    }
    if (info.playerState === 1 && !player.soundTried) {
      player.soundTried = true;
      setTimeout(() => { if (player.userMuted) return; ytSend('unMute'); ytSend('setVolume', [100]); }, 800); // never undo a viewer who already chose Sound off
      setTimeout(() => {
        if (player.userMuted) return;
        if (player.state !== 1 || player.muted !== false) { ytSend('mute'); ytSend('playVideo'); player.muted = true; updateSoundUi(); $('stream-status').textContent = 'Live from OpenAI \u00b7 tap for sound'; }
      }, 3800);
    }
    if (info.playerState === 1) { $('rewind').hidden = false; if (!player.captionsOff) { player.captionsOff = true; captionsOff(); [1500, 4000, 9000, 16000].forEach(ms => setTimeout(captionsOff, ms)); } }
    // Health tracking for the stall watchdog below.
    const now = Date.now();
    player.heardAt = now;
    updateSoundUi();
    if (typeof info.playerState === 'number') { if (info.playerState !== player.state) player.stateAt = now; player.state = info.playerState; }
    if (typeof info.currentTime === 'number') { if (player.movedTime === null || Math.abs(info.currentTime - player.movedTime) > 0.4) { player.movedAt = now; player.movedTime = info.currentTime; } player.time = info.currentTime; }
  });
  // Stall watchdog: if the picture freezes or sits buffering, nudge it once, then reconnect it (at most 3 times).
  // A deliberate pause (state 2) and a finished stream (state 0) are left alone.
  let reloads = 0;
  document.addEventListener('visibilitychange', () => { player.movedAt = Date.now(); player.stateAt = Date.now(); player.nudged = false; });
  setInterval(() => {
    if ($('stream').hidden || document.hidden || !player.videoId || !player.heardAt) return;
    const now = Date.now();
    const stuck = [3, -1, 5].includes(player.state) && now - player.stateAt > 12000;
    const frozen = player.state === 1 && now - player.movedAt > 10000;
    if (!stuck && !frozen) { player.nudged = false; return; }
    if (!player.nudged) { player.nudged = true; ytSend('playVideo'); return; }
    if (reloads < 3 && now - (player.reloadedAt || 0) > 20000) {
      reloads++; player.reloadedAt = now; player.scheduledPos = null; player.rewound = false; player.captionsOff = false; player.soundTried = false; $('go-live').hidden = true;
      toast('Reconnecting the stream'); $('stream').src = $('stream').getAttribute('src');
    }
  }, 4000);
  const soundOn = () => { player.userMuted = false; ytSend('unMute'); ytSend('setVolume', [100]); ytSend('playVideo'); };
  $('unmute').addEventListener('click', () => { if (player.muted === false) { player.userMuted = true; ytSend('mute'); } else soundOn(); });
  $('sound-prompt').addEventListener('click', soundOn);
  // Browsers only allow sound after a touch on the page, so the first touch anywhere turns it on (unless the viewer muted it).
  const onGesture = () => { if (player.muted !== false && !player.userMuted && player.state === 1) { ytSend('unMute'); ytSend('setVolume', [100]); } };
  for (const type of ['pointerdown', 'keydown', 'touchstart']) document.addEventListener(type, onGesture, true);
  setInterval(() => { if (player.state === 1) captionsOff(); }, 20000);
  $('rewind').addEventListener('click', () => { ytSend('seekTo', [keynoteStartPosition(), true]); ytSend('playVideo'); player.rewound = true; $('go-live').hidden = false; $('stream-status').textContent = 'Replaying from the start of the keynote'; });
  $('go-live').addEventListener('click', () => { ytSend('seekTo', [1e9, true]); ytSend('playVideo'); player.rewound = false; $('go-live').hidden = true; $('stream-status').textContent = 'English audio · live from OpenAI'; });
  $('stream').addEventListener('load', () => { ytListen(); setTimeout(ytListen, 1500); setTimeout(ytListen, 4000); });
  function setStream(data) {
    const url = typeof data === 'string' ? data : data?.url;
    const videoId = youtube(url);
    if (!videoId) return;
    const source = YT_ORIGIN + '/embed/' + videoId + '?rel=0&cc_load_policy=0&autoplay=1&mute=1&playsinline=1&enablejsapi=1&origin=' + encodeURIComponent(location.origin);
    if (player.videoId !== videoId) { player.videoId = videoId; player.autoSeeked = false; player.liveKnown = false; player.scheduledPos = null; player.rewound = false; player.soundTried = false; }
    if ($('stream').getAttribute('src') !== source) $('stream').src = source;
    $('stream').hidden = false; $('player-empty').hidden = true;
    $('stream-status').textContent = 'Live from OpenAI · sound is off, tap Sound on';
    $('stream-url').value = url;
  }
  let captionsShown = false;
  let captionStyle = 'mt'; // 'mt' Maltese, 'mte' Maltenglish
  try { if (localStorage.getItem('devday-caption-style') === 'mte') captionStyle = 'mte'; } catch { /* storage can be blocked */ }
  function setCaptionStyle(style) {
    captionStyle = style === 'mte' ? 'mte' : 'mt';
    try { localStorage.setItem('devday-caption-style', captionStyle); } catch { /* storage can be blocked */ }
    $('cap-mt').setAttribute('aria-pressed', String(captionStyle === 'mt')); $('cap-mte').setAttribute('aria-pressed', String(captionStyle === 'mte'));
    captionsShown = false; renderCaptions(); // jump to the newest line in the chosen style
  }
  $('cap-mt').addEventListener('click', () => setCaptionStyle('mt'));
  $('cap-mte').addEventListener('click', () => setCaptionStyle('mte'));
  $('cap-mt').setAttribute('aria-pressed', String(captionStyle === 'mt')); $('cap-mte').setAttribute('aria-pressed', String(captionStyle === 'mte'));
  function renderCaptions() {
    if (!captions.length) return;
    const list = $('captions');
    const follow = !captionsShown || list.scrollHeight - list.scrollTop - list.clientHeight < 80; // stay put if the reader scrolled up
    list.replaceChildren(); list.lang = 'mt';
    const latestByPos = new Map(); captions.forEach((c, i) => { if (c.pos !== null && c.pos !== undefined) latestByPos.set(c.pos, i); }); // a replayed piece replaces its earlier version
    for (const [index, caption] of captions.entries()) {
      if (caption.pos !== null && caption.pos !== undefined && latestByPos.get(caption.pos) !== index) continue;
      const text = (captionStyle === 'mte' && caption.mte) || caption.mt; // Maltenglish falls back to Maltese when a line has no second version
      if (!text) continue;
      const stamp = Number.isFinite(Number(caption.pos)) && caption.pos !== null && caption.pos !== undefined ? Math.floor(caption.pos / 60) + ':' + String(caption.pos % 60).padStart(2, '0') : time(caption.ts);
      const row = element('div', 'caption-entry'); row.append(element('time', '', stamp), element('p', '', text)); list.append(row);
    }
    captionsShown = true;
    if (follow) list.scrollTop = list.scrollHeight;
  }
  function caption(data) {
    captions.push(data); captions = captions.slice(-700); latestCaption = Number(data.ts) || Date.now(); renderCaptions();
    setCaptionStatus('Captions received · ' + time(latestCaption));
  }
  const reactions = { fire: 'On fire', mind: 'Mind blown', ship: 'Ship it', rate: 'Rate limit?', cisk: 'Cisk o’clock' };
  function react(kind) {
    if (!reactions[kind] || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const area = $('reaction-floats'); if (area.children.length >= 10) return;
    const pill = element('span', 'reaction-float', reactions[kind]); pill.style.right = 24 + Math.random() * 80 + 'px'; area.append(pill); setTimeout(() => pill.remove(), 2100);
  }
  function connect() {
    socket = new WebSocket(wsUrl);
    socket.addEventListener('open', () => socket.send(JSON.stringify({ type: 'hello', id })));
    socket.addEventListener('message', event => {
      let data; try { data = JSON.parse(event.data); } catch { return; }
      switch (data.type) {
        case 'hello':
          connection(true); features = data.features || {};
          $('questions-panel').hidden = !features.jev; $('rank-questions').hidden = !features.jev;
          $('presence').textContent = data.n + (data.n === 1 ? ' in room' : ' in room');
          if (data.chat?.length) { $('chat').replaceChildren(); data.chat.forEach(addChat); $('chat').scrollTop = $('chat').scrollHeight; }
          if (data.logs?.length) { $('announcements').replaceChildren(); data.logs.forEach(addLog); }
          setStream(data.stream); captions = (data.captions || []).slice(-700); renderCaptions();
          if (captions.length) { latestCaption = Number(captions.at(-1).ts) || 0; setCaptionStatus('Latest captions · ' + time(latestCaption)); }
          else setCaptionStatus(features.captions ? 'Waiting for the first words' : 'Maltese captions are not connected yet');
          if (hostKey) send({ type: 'auth', key: hostKey });
          window.dispatchEvent(new CustomEvent('devday:features', {detail:features})); break;
        case 'presence': $('presence').textContent = data.n + ' in room'; break;
        case 'authed':
          host = Boolean(data.ok); $('host-controls').hidden = !host; $('auth-form').hidden = host;
          $('auth-status').textContent = host ? 'Host connected' : 'Host key not accepted.';
          if (!host) { hostKey = ''; $('auth-form').hidden = false; }
          window.dispatchEvent(new CustomEvent('devday:auth', {detail:{host,features}})); break;
        case 'chat': addChat(data); break;
        case 'log': addLog(data); break;
        case 'stream': setStream(data); toast('The host updated the keynote link'); break;
        case 'caption': caption(data); break;
        case 'react': react(data.kind); break;
        case 'questions':
          $('questions').replaceChildren();
          if (!data.items?.length) $('questions').append(element('p','empty','No discussion questions selected yet.'));
          for (const item of (data.items || []).slice(0,8)) { const row = element('article','question'); row.append(element('span','small muted',item.user || 'Guest'),element('p','',item.text || '')); $('questions').append(row); }
          $('questions-panel').open = true; $('rank-questions').disabled = false; break;
        case 'slow': pending = null; $('send').disabled = !ready; $('send-status').textContent = 'A little fast. Your draft is still here.'; break;
        case 'denied': toast('Host access is required for that action.'); break;
        case 'error': pending = null; $('send').disabled = !ready; $('rank-questions').disabled = false; toast(data.message || data.error || 'The room could not complete that request.'); break;
      }
    });
    socket.addEventListener('close', () => { connection(false); setTimeout(connect, 4000); });
    socket.addEventListener('error', () => socket.close());
  }
  $('chat-form').addEventListener('submit', event => {
    event.preventDefault(); const text = $('message').value.trim(), user = $('name').value.trim() || guestName;
    if (!text || pending) return;
    if (Date.now() - lastChat < 750) { $('send-status').textContent = 'Give the room a moment.'; return; }
    const clientId = crypto.randomUUID();
    if (send({ type: 'chat', text, user, clientId })) {
      lastChat = Date.now(); pending = {text, user: host ? 'Matt' : /^(matt|host|admin|mod|moderator)$/i.test(user) ? user + ' (guest)' : user, clientId};
      $('send-status').textContent = 'Sending…'; $('send').disabled = true;
      setTimeout(() => { if (pending?.clientId === clientId) { pending = null; $('send').disabled = !ready; $('send-status').textContent = 'Delivery unconfirmed. Check the room before resending.'; } }, 8000);
    }
  });
  $('message').addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); $('chat-form').requestSubmit(); } });
  $('auth-form').addEventListener('submit', event => { event.preventDefault(); if (!ready) { $('auth-status').textContent = 'Wait for the room to reconnect.'; return; } hostKey = $('host-key').value; $('host-key').value = ''; send({type:'auth',key:hostKey}); });
  $('stream-form').addEventListener('submit', event => { event.preventDefault(); const url = $('stream-url').value.trim(); if (!youtube(url)) { toast('Use a complete YouTube watch or live video link.'); return; } send({type:'stream',url}); });
  $('log-form').addEventListener('submit', event => { event.preventDefault(); const text = $('log-text').value.trim(); if (text && send({type:'log',text,url:$('log-url').value.trim()})) { $('log-text').value = ''; $('log-url').value = ''; } });
  document.querySelectorAll('[data-reaction]').forEach(button => button.addEventListener('click', () => { if (Date.now() - lastReact < 250) return; if (send({type:'react',kind:button.dataset.reaction})) { lastReact = Date.now(); react(button.dataset.reaction); } }));
  const tabs = [...document.querySelectorAll('[data-tab]')];
  function selectTab(button) { tabs.forEach(tab => { tab.setAttribute('aria-selected', String(tab === button)); tab.tabIndex = tab === button ? 0 : -1; }); document.querySelectorAll('[data-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.panel === button.dataset.tab)); }
  tabs.forEach((button, index) => { button.addEventListener('click', () => selectTab(button)); button.addEventListener('keydown', event => { let next; if (event.key === 'ArrowRight') next = (index + 1) % tabs.length; if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length; if (event.key === 'Home') next = 0; if (event.key === 'End') next = tabs.length - 1; if (next !== undefined) { event.preventDefault(); selectTab(tabs[next]); tabs[next].focus(); } }); });
  $('rank-questions').addEventListener('click', () => { if (send({type:'rank'})) { $('rank-questions').disabled = true; toast('Jev is reading the recent chat.'); setTimeout(() => $('rank-questions').disabled = false, 16000); } });
  $('focus-mode').addEventListener('click', () => { const enabled = document.body.classList.toggle('theatre'); $('focus-mode').setAttribute('aria-pressed', String(enabled)); $('focus-mode').textContent = enabled ? 'Standard view' : 'Theatre view'; });
  function clock() {
    const remaining = Date.parse('2026-09-29T17:00:00Z') - Date.now();
    if (remaining > 0) { const s = Math.floor(remaining / 1000); $('countdown').textContent = [Math.floor(s/3600), Math.floor(s/60)%60, s%60].map(n=>String(n).padStart(2,'0')).join(':'); $('schedule-label').textContent = 'UNTIL SCHEDULED START'; }
    else { $('countdown').textContent = '29 September'; $('schedule-label').textContent = 'RECORDED'; }
    if (latestCaption && ready && Date.now() - latestCaption > 45000) setCaptionStatus('No new captions · last received ' + time(latestCaption));
  }
  clock(); setInterval(clock,1000); connect();
  // Built-in default: the keynote plays even if the room connection is down. The host can still change it for everyone.
  setStream('https://www.youtube.com/watch?v=Fls_onRviPM');
})();
