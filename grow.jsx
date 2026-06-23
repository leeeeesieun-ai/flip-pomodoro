// grow.jsx — full-bleed growth screen (home+focus merged) · complete · break
const { useState: useStateG, useEffect: useEffectG, useRef: useRefG } = React;

// 33-frame growth sequence (seed → ripe red), driven by progress.
const FRAMES = Array.from({ length: 33 }, (_, i) => `assets/seq/f${String(i).padStart(2, '0')}.jpg`);
const RIPE = FRAMES[32]; // full plant, cluster of red tomatoes
const HERO_RED = FRAMES[28]; // close-up single ripe tomato
const SEED = FRAMES[0];

// session length → frame density (longer focus = smoother, richer growth)
const FRAME_SETS = {
  short: [0, 4, 11, 17, 22, 27, 32],
  mid: [0, 2, 4, 7, 9, 11, 14, 17, 20, 22, 24, 27, 29, 32],
  full: Array.from({ length: 33 }, (_, i) => i)
};
function framesFor(duration) {
  return FRAME_SETS.full;
}

const STAGE_LABELS = [[0.08, 'Seed'], [0.32, 'Sprout'], [0.56, 'Flower'], [0.84, 'Green tomato'], [2, 'Ripe tomato']];
function stageLabelFor(p) {for (const [t, l] of STAGE_LABELS) if (p < t) return l;return 'Ripe tomato';}

const CREAM = '#FDF7EB';

const VARIETY_LABELS = { classic: 'Classic tomato', cherry: 'Cherry tomato', date: 'Plum tomato', black: 'Black tomato', golden: 'Golden tomato' };

function farmerLevel(harvest, streak) {
  if (streak >= 30) return { name: 'Tomato Master', next: null, icon: '👑' };
  if (streak >= 7) return { name: 'Veteran Farmer', next: { label: '30-day streak', cur: streak, goal: 30 }, icon: '🏅' };
  if (harvest >= 10) return { name: 'Regular Farmer', next: { label: '7-day streak', cur: streak, goal: 7 }, icon: '🌟' };
  if (harvest >= 1) return { name: 'Rookie Farmer', next: { label: '10 total harvests', cur: harvest, goal: 10 }, icon: '🌱' };
  return { name: 'Future Farmer', next: { label: 'first harvest', cur: 0, goal: 1 }, icon: '🥚' };
}

function fmtTime(sec) {
  const m = Math.floor(sec / 60),s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function Confetti({ n = 32 }) {
  const colors = ['#EF5239', '#5BAE5A', '#FFCF4D', '#FF9166', '#E5B53C'];
  const bits = React.useMemo(() => Array.from({ length: n }).map((_, i) => ({
    left: Math.random() * 100, delay: Math.random() * 0.6, dur: 1.8 + Math.random() * 1.4,
    col: colors[i % colors.length], size: 7 + Math.random() * 6, rot: Math.random() * 360, round: Math.random() > 0.5
  })), [n]);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 25 }}>
      {bits.map((b, i) =>
      <div key={i} className="tt-confetti" style={{ position: 'absolute', top: -20, left: b.left + '%', width: b.size, height: b.size * (b.round ? 1 : 1.6), background: b.col, borderRadius: b.round ? '50%' : 2, animationDelay: b.delay + 's', animationDuration: b.dur + 's', transform: `rotate(${b.rot}deg)` }} />
      )}
    </div>);

}

function Grain() {
  return <div className="tt-grain" />;
}

// plant frame sequence — crossfade between the two frames bracketing progress
function PlantStack({ progress, frames, dim, idle }) {
  const m = frames.length;
  const pos = idle ? 0 : Math.max(0, Math.min(progress, 1)) * (m - 1);
  const i = Math.min(Math.floor(pos), m - 1);
  const frac = pos - i;
  const e = frac * frac * (3 - 2 * frac); // smoothstep — eased continuous dissolve
  return (
    <div className={'tt-feather' + (dim ? ' grow-dim' : '')} style={{ position: 'absolute', inset: 0 }}>
      {frames.map((srcIdx, k) => {
        const o = k < i ? 1 : k === i ? 1 : k === i + 1 ? e : 0;
        // morph feel: incoming frame grows in slightly; current eases up a touch as it hands off
        const sc = k === i + 1 ? 1.04 + 0.06 * e : 1.10;
        return (
          <img key={srcIdx} src={FRAMES[srcIdx]} alt="" draggable="false" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'contain', objectPosition: 'center center', transform: `scale(${sc})`,
            opacity: o, transition: 'opacity 90ms linear',
            zIndex: k, userSelect: 'none', pointerEvents: 'none'
          }} />);
      })}
    </div>);
}

// flip-phone icon — thin line, one clean arrow arcing over the phone (= turn it face down)
function PhoneFlipIcon() {
  const c = '#A8927C';
  return (
    <svg width="50" height="50" viewBox="0 0 48 48" fill="none" stroke={c} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="17" y="17" width="14" height="21" rx="3" />
      <line x1="22" y1="34.5" x2="26" y2="34.5" />
      <path d="M15 14.5C15 8 32 8 32 14.5" />
      <path d="M32 19L29.4 14.3H34.6L32 19Z" fill={c} stroke="none" />
    </svg>);
}

// focusing: phone is face down — the plant (at current progress) shows behind, from GrowScreen
function FocusFace({ mascotName, remaining, progress, onLift }) {
  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 220, background: 'linear-gradient(to bottom, rgba(253,247,235,0.95) 32%, rgba(253,247,235,0))', zIndex: 20, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 64, left: 0, right: 0, zIndex: 21, textAlign: 'center' }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#B9A48E', letterSpacing: 2 }}>FOCUSING</div>
        <div style={{ fontSize: 52, fontWeight: 300, color: '#4A3A2C', letterSpacing: 2, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{fmtTime(remaining)}</div>
        <div style={{ fontSize: 13.5, color: '#8B7560', fontWeight: 600, marginTop: 6 }}>Phone down · {mascotName} is growing 🌱</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 21, paddingBottom: 42, paddingTop: 56, textAlign: 'center', background: 'linear-gradient(to top, rgba(253,247,235,0.92) 50%, rgba(253,247,235,0))' }}>
        <button onClick={onLift} className="tt-glass" style={{ border: 'none', background: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 700, color: '#6B5746', padding: '11px 22px', borderRadius: 999, boxShadow: '0 2px 8px -4px rgba(90,70,50,0.3)' }}>🙃 들어올리기 (시뮬)</button>
      </div>
      <div style={{ position: 'absolute', left: 0, bottom: 0, height: 4, width: progress * 100 + '%', background: 'var(--accent)', zIndex: 22, transition: 'width .3s linear', opacity: 0.85 }} />
    </>);
}

// face up: prompt to put the phone down (start, or paused after a pick-up) — plant shows behind
function FaceUpPrompt({ mascotName, started, remaining, armed, onPrimary, onStop }) {
  const title = started ? 'Put me back down' : armed ? 'Now flip it over' : 'Place your phone face down';
  const sub = started ? `${mascotName} paused · ${fmtTime(remaining)} left`
    : armed ? 'Flip your phone face-down and Toma starts growing.' : 'A seed grows into a tomato.';
  const btn = started ? 'Resume' : armed ? 'Start without flipping' : 'Start';
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 21, padding: '88px 32px 42px', textAlign: 'center', background: 'linear-gradient(to top, rgba(253,247,235,0.97) 56%, rgba(253,247,235,0))' }}>
      <PhoneFlipIcon />
      <div className="wordmark" style={{ fontSize: 25, color: '#5A4636', marginTop: 12 }}>{title}</div>
      <div style={{ fontSize: 15, color: '#8B7560', fontWeight: 600, marginTop: 8, lineHeight: 1.5 }}>{sub}</div>
      {armed
        ? <button onClick={onPrimary} className="tt-glass" style={{ marginTop: 22, border: 'none', background: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 700, color: '#6B5746', padding: '11px 22px', borderRadius: 999, boxShadow: '0 2px 8px -4px rgba(90,70,50,0.3)' }}>{btn}</button>
        : <button onClick={onPrimary} className="grow-cta" style={{ ...ctaStyle, marginTop: 22, padding: '14px 46px' }}>{btn}</button>}
      <div style={{ marginTop: 14 }}><button onClick={onStop} style={{ border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, color: '#A8927C', fontWeight: 600 }}>{started ? 'Stop for today' : 'Cancel'}</button></div>
    </div>);
}

// end-of-session growth — flipbook through all frames (fixed time per frame → length scales with stage reached)
// 'flipbook' = hard cut (static swap) · 'soft' = each frame fades in briefly over the previous (no scale, no ghosting)
function GrowthReplay({ target, style, mode, onDone }) {
  const lastFrame = Math.round(Math.max(0, Math.min(1, target)) * (FRAMES.length - 1));
  const soft = style === 'soft';
  const [idx, setIdx] = useStateG(0);
  useEffectG(() => {
    const stepMs = 280;
    if (lastFrame < 1) { const t = setTimeout(onDone, 1100); return () => clearTimeout(t); }
    let i = 0;
    const id = setInterval(() => {
      i++;
      if (i > lastFrame) { clearInterval(id); setTimeout(onDone, 1100); return; }
      setIdx(i);
    }, stepMs);
    return () => clearInterval(id);
  }, []);
  const f = Math.min(idx, lastFrame);
  const pct = Math.round((f / (FRAMES.length - 1)) * 100);
  const imgBase = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center center', transform: 'scale(1.10)' };
  return (
    <div style={{ position: 'absolute', inset: 0, background: CREAM, overflow: 'hidden' }}>
      <div className="tt-feather" style={{ position: 'absolute', inset: 0 }}>
        {soft && f > 0 && <img src={FRAMES[f - 1]} alt="" draggable="false" style={imgBase} />}
        <img key={f} src={FRAMES[f]} alt="" draggable="false" className={soft ? 'tt-fade' : undefined} style={imgBase} />
      </div>
      <Grain />
      <div style={{ position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', zIndex: 21 }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: '#B9A48E', letterSpacing: 1.5 }}>{mode === 'complete' ? 'ALL DONE' : mode === 'preview' ? 'PREVIEW' : 'HOW FAR TOMA GREW'}</div>
        <div className="wordmark" style={{ fontSize: 28, color: '#5A4636', marginTop: 4 }}>{pct}%</div>
      </div>
    </div>);
}

// growth screen — face-down to focus (wall-clock timer), growth revealed only at the end
function GrowScreen({ store, mascotName, secPerMin, replayStyle, onToggleReplay, onComplete, onExitSession, onOpenGarden, onOpenSettings, initialSession }) {
  const [running, setRunning] = useStateG(!!initialSession);
  const [duration, setDuration] = useStateG(initialSession?.duration || 25);
  const [faceDown, setFaceDown] = useStateG(false);
  const [replay, setReplay] = useStateG(null);       // { mode:'complete'|'stop', target } during end animation
  const [sensorArmed, setSensorArmed] = useStateG(false); // real gyro flip-detection active
  const [, setTick] = useStateG(0);                  // forces countdown re-render
  const elapsedRef = useRefG(initialSession?.elapsed || 0); // committed focus-seconds
  const anchorRef = useRefG(null);                   // wall-clock ms when current face-down segment started
  const pickups = useRefG(0);                        // times phone was lifted mid-session
  const total = duration * 60;

  // wall-clock elapsed: committed + time since phone went down → screen-off never loses time
  const calcElapsed = () => {
    let e = elapsedRef.current;
    if (anchorRef.current != null) e += (Date.now() - anchorRef.current) / 1000 * (60 / secPerMin);
    return Math.min(e, total);
  };

  const start = (m) => { setDuration(m); elapsedRef.current = 0; anchorRef.current = null; pickups.current = 0; setFaceDown(false); setReplay(null); setSensorArmed(false); setRunning(true); };

  const setFace = (v) => {
    if (v === false && running && !replay && calcElapsed() > 0) pickups.current++;
    setFaceDown(v);
  };

  // request motion permission (iOS needs a user gesture) and arm gyro flip-detection
  const requestMotion = async () => {
    try {
      const DME = window.DeviceMotionEvent;
      if (!DME) return false;
      if (typeof DME.requestPermission === 'function') {
        const r = await DME.requestPermission();
        return r === 'granted';
      }
      return true; // Android / browsers that don't gate it
    } catch (e) { return false; }
  };
  // Start tap: on a real phone arm the sensor (flip to begin); otherwise start manually
  const onStartTap = async () => {
    const ok = await requestMotion();
    if (ok) setSensorArmed(true); else setFace(true);
  };

  const beginReplay = (mode) => {
    if (anchorRef.current != null) { elapsedRef.current = calcElapsed(); anchorRef.current = null; }
    const target = Math.min(elapsedRef.current / total, 1);
    setFaceDown(false); setReplay({ mode, target });
  };

  const previewReplay = () => setReplay({ mode: 'preview', target: 1 }); // prototype: watch the replay without a full session

  const finishReplay = () => {
    const r = replay; if (!r) return;
    if (r.mode === 'preview') { setReplay(null); return; }
    try { localStorage.removeItem('tomatoTimer.session'); } catch (e) {}
    const elapsedMin = Math.round((r.target * total) / 60);
    setRunning(false); elapsedRef.current = 0; setReplay(null); setSensorArmed(false);
    if (r.mode === 'complete') onComplete({ duration, distractCount: pickups.current });
    else onExitSession && onExitSession({ frac: r.target, minutes: elapsedMin });
  };

  const stop = () => beginReplay('stop');

  // preload all frames once
  useEffectG(() => { FRAMES.forEach((s) => { const im = new Image(); im.src = s; }); }, []);

  // gyro flip-detection: face down (z ≈ -9.8) counts, face up (z ≈ +9.8) pauses
  useEffectG(() => {
    if (!sensorArmed || !running || replay) return;
    let faceNow = false, gotData = false;
    const onMotion = (e) => {
      const g = e.accelerationIncludingGravity; if (!g || g.z == null) return;
      gotData = true;
      if (g.z < -6 && !faceNow) { faceNow = true; setFace(true); }
      else if (g.z > 2 && faceNow) { faceNow = false; setFace(false); }
    };
    window.addEventListener('devicemotion', onMotion);
    // no sensor data (e.g. desktop) → fall back to manual start
    const fb = setTimeout(() => { if (!gotData) { setSensorArmed(false); setFace(true); } }, 2500);
    return () => { clearTimeout(fb); window.removeEventListener('devicemotion', onMotion); };
  }, [sensorArmed, running, replay]);

  // commit / open a wall-clock segment when face-down or run state changes
  useEffectG(() => {
    if (running && faceDown && !replay) {
      if (anchorRef.current == null) anchorRef.current = Date.now();
    } else if (anchorRef.current != null) {
      elapsedRef.current = calcElapsed(); anchorRef.current = null; setTick((t) => t + 1);
    }
  }, [running, faceDown, replay, secPerMin, total]);

  // tick while focusing: refresh countdown, persist for resume, detect completion
  useEffectG(() => {
    if (!(running && faceDown && !replay)) return;
    let id;
    const loop = () => {
      const e = calcElapsed();
      setTick((t) => t + 1);
      try { localStorage.setItem('tomatoTimer.session', JSON.stringify({ duration, elapsed: Math.round(e) })); } catch (err) {}
      if (e >= total) { beginReplay('complete'); return; }
      id = setTimeout(loop, 250);
    };
    id = setTimeout(loop, 250);
    return () => clearTimeout(id);
  }, [running, faceDown, replay, total, secPerMin, duration]);

  // catch up the countdown when the page becomes visible again (after screen-off)
  useEffectG(() => {
    const onVis = () => { if (!document.hidden) setTick((t) => t + 1); };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const elapsed = calcElapsed();
  const remaining = Math.max(0, total - elapsed);
  const progress = running ? Math.min(elapsed / total, 1) : 0;
  const frames = framesFor(duration);

  // ── end-of-session growth replay (stop-motion) ──
  if (replay) {
    return <GrowthReplay target={replay.target} style={replayStyle || 'flipbook'} mode={replay.mode} onDone={finishReplay} />;
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: CREAM, overflow: 'hidden' }}>
      <Grain />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 150, background: 'linear-gradient(to bottom, rgba(253,247,235,0.92), rgba(253,247,235,0))', zIndex: 20, pointerEvents: 'none' }} />

      {!running ? (
        <>
          <PlantStack progress={0} frames={frames} idle={true} />
          <div style={{ position: 'absolute', top: 60, left: 24, right: 24, zIndex: 21, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#A8927C', fontFamily: "'Satoshi', sans-serif", fontSize: "13px" }}>{store.streak > 0 ? `${store.streak} day streak` : 'Take it slow today'}</div>
              <div className="wordmark" style={{ color: '#5A4636', marginTop: 2, fontSize: "24px" }}>Hi, {mascotName}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, pointerEvents: 'auto' }}>
              <CornerIcon onClick={onOpenGarden} kind="garden" />
              <CornerIcon onClick={onOpenSettings} kind="gear" />
            </div>
          </div>

          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 21, paddingBottom: 46, paddingTop: 60, background: 'linear-gradient(to top, rgba(253,247,235,0.96) 55%, rgba(253,247,235,0))' }}>
            <div style={{ textAlign: 'center', fontSize: 13.5, fontWeight: 200, color: '#A8927C', marginBottom: 14, letterSpacing: 0.3, fontFamily: "'Satoshi', -apple-system, system-ui, sans-serif" }}>How many minutes will you focus?</div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
              {[10, 25, 50].map((m) =>
                <button key={m} onClick={() => start(m)} className="grow-num" style={{ border: 'none', background: 'none', cursor: 'pointer', fontFamily: "'Zodiak', Georgia, serif", fontWeight: 700, color: '#4A3A2C', lineHeight: 1, fontSize: "34px" }}>{m}</button>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <PlantStack progress={progress} frames={frames} idle={false} />
          {faceDown ? (
            <FocusFace mascotName={mascotName} remaining={remaining} progress={progress} onLift={() => setFace(false)} />
          ) : (
            <FaceUpPrompt mascotName={mascotName} started={elapsed > 0} remaining={remaining} armed={sensorArmed && elapsed === 0}
          onPrimary={() => { if (elapsed > 0 || sensorArmed) setFace(true); else onStartTap(); }} onStop={stop} />
          )}
        </>
      )}
    </div>);
}

const ctaStyle = {
  border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 16,
  background: 'var(--accent)', color: '#fff', borderRadius: 999, padding: '15px 32px',
  marginTop: 26, boxShadow: '0 10px 24px -8px var(--accent-shadow)'
};

function GhostText({ children, onClick }) {
  return <button onClick={onClick} className="tt-glass" style={{ border: 'none', background: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14.5, fontWeight: 700, color: '#6B5746', padding: '10px 22px', borderRadius: 999, whiteSpace: 'nowrap' }}>{children}</button>;
}

function CornerIcon({ onClick, kind }) {
  const c = '#7A6552';
  return (
    <button onClick={onClick} className="tt-glass" style={{ border: 'none', cursor: 'pointer', width: 40, height: 40, borderRadius: 999, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px -4px rgba(90,70,50,0.3)' }}>
      {kind === 'garden' ?
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 21V9.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" /><path d="M12 11.5C12 7 14.5 4 19 4c0 4.5-2.5 7.5-7 7.5Z" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 14.5C12 10.5 9.5 8 5 8c0 4 2.5 6.5 7 6.5Z" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg> :
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>}
    </button>);

}

// complete / harvest
function Complete2({ result, mascotName, firstRun, totalHarvest, onBreak, onAgain, onGarden }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: CREAM, overflow: 'hidden' }}>
      <img src={RIPE} alt="" className="grow-breathe tt-feather" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center center' }} />
      <Grain />
      <div style={{ position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', zIndex: 21 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#A8927C', letterSpacing: 1 }}>{firstRun ? 'FIRST HARVEST' : 'HARVEST'}</div>
        <div className="wordmark" style={{ fontSize: 32, color: '#5A4636', marginTop: 4 }}>All ripe!</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 21, background: 'linear-gradient(to top, rgba(253,247,235,0.97) 55%, rgba(253,247,235,0))', padding: '70px 32px 44px' }}>
        <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 600, color: '#8B7560', marginBottom: 18 }}>
          {result.distractCount === 0 ? `Perfectly ripe — ${result.duration} min done!` : 'Thanks for coming back. It ripened!'}
          <br /><span style={{ fontSize: 13, color: '#B9A48E' }}>#{totalHarvest} in your garden</span>
        </div>
        {firstRun ?
        <button onClick={onGarden} className="grow-cta" style={{ ...ctaStyle, width: '100%', marginTop: 0, boxSizing: 'border-box' }}>Add your first tomato →</button> :

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={onBreak} className="grow-cta" style={{ ...ctaStyle, width: '100%', marginTop: 0, boxSizing: 'border-box' }}>Take a break</button>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onAgain} className="tt-glass" style={{ flex: 1, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 15, background: 'rgba(255,255,255,0.7)', color: '#6B5746', borderRadius: 999, padding: '14px' }}>Again</button>
              <button onClick={onGarden} className="tt-glass" style={{ flex: 1, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 15, background: 'rgba(255,255,255,0.7)', color: '#6B5746', borderRadius: 999, padding: '14px' }}>Garden</button>
            </div>
          </div>
        }
      </div>
    </div>);

}

// break — fixed 5 min, a random still image, no motion
function Break2({ duration, mascotName, secPerMin, onDone }) {
  const total = (duration || 5) * 60;
  const startRef = useRefG(Date.now());
  const imgRef = useRefG(FRAMES[Math.floor(Math.random() * FRAMES.length)]); // any random frame
  const [, setTick] = useStateG(0);
  useEffectG(() => {
    const id = setInterval(() => {
      const el = (Date.now() - startRef.current) / 1000 * (60 / secPerMin);
      if (el >= total) { clearInterval(id); onDone(); } else setTick((t) => t + 1);
    }, 500);
    return () => clearInterval(id);
  }, []);
  const remaining = Math.max(0, total - (Date.now() - startRef.current) / 1000 * (60 / secPerMin));
  return (
    <div style={{ position: 'absolute', inset: 0, background: CREAM, overflow: 'hidden' }}>
      <img src={imgRef.current} alt="" draggable="false" className="tt-feather" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center center' }} />
      <Grain />
      <div style={{ position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', zIndex: 21 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#A8927C', letterSpacing: 1 }}>TAKE A BREAK</div>
        <div style={{ fontSize: 52, fontWeight: 300, color: '#4A3A2C', letterSpacing: 2, fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>{fmtTime(remaining)}</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 21, paddingBottom: 44, paddingTop: 60, textAlign: 'center', background: 'linear-gradient(to top, rgba(253,247,235,0.96) 55%, rgba(253,247,235,0))' }}>
        <div style={{ fontSize: 15, color: '#8B7560', fontWeight: 600, marginBottom: 18, lineHeight: 1.5 }}>Rest your eyes — look out the window.</div>
        <button onClick={onDone} className="tt-glass" style={{ border: 'none', background: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14.5, fontWeight: 700, color: '#6B5746', padding: '12px 26px', borderRadius: 999, boxShadow: '0 2px 8px -4px rgba(90,70,50,0.3)' }}>Skip break</button>
      </div>
    </div>);

}

Object.assign(window, { GrowScreen, Complete2, Break2, Grain, FRAMES, RIPE, HERO_RED, SEED, CREAM, farmerLevel, fmtTime, VARIETY_LABELS, Confetti });