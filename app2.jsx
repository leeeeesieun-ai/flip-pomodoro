// app2.jsx — 풀블리드 버전 앱 셸
const { useState: useStateA2, useLayoutEffect: useLayoutEffectA2 } = React;

const STORE_KEY2 = 'tomatoTimer.v2';
const DEFAULT2 = {
  onboarded: false, name: 'Toma', specimens: [], streak: 0,
  totalMinutes: 0, daily: {}, lastDate: null,
  perms: { notif: false, dnd: false }, reminder: null, sound: true, haptic: true, honorMode: true,
};
const ACCENTS2 = {
  'Tomato': { a: '#E0573C', soft: '#FBEAE3', ink: '#B7401F', sh: 'rgba(224,87,60,0.45)' },
  'Apricot': { a: '#E08A3C', soft: '#FBF0E3', ink: '#B76C1F', sh: 'rgba(224,138,60,0.45)' },
  'Plum': { a: '#B5527A', soft: '#FAE7EF', ink: '#8E3A5C', sh: 'rgba(181,82,122,0.45)' },
  'Olive': { a: '#7E9450', soft: '#EEF2E2', ink: '#5E7237', sh: 'rgba(126,148,80,0.45)' },
  'Blue': { a: '#5B79C4', soft: '#E8EEFA', ink: '#3D5BA3', sh: 'rgba(91,121,196,0.45)' },
};

function load2() { try { const r = localStorage.getItem(STORE_KEY2); if (r) return { ...DEFAULT2, ...JSON.parse(r) }; } catch (e) {} return { ...DEFAULT2 }; }
function loadSession() { try { const r = localStorage.getItem('tomatoTimer.session'); if (r) { const s = JSON.parse(r); if (s && s.elapsed < (s.duration * 60) - 1) return s; } } catch (e) {} return null; }
const tkey2 = () => new Date().toISOString().slice(0, 10);

const PHONE_W2 = 402, PHONE_H2 = 874;
function Scaler2({ children }) {
  const [s, setS] = useStateA2(1);
  useLayoutEffectA2(() => {
    const fit = () => setS(Math.min((window.innerWidth - 16) / PHONE_W2, (window.innerHeight - 16) / PHONE_H2, 1.1));
    fit(); window.addEventListener('resize', fit); return () => window.removeEventListener('resize', fit);
  }, []);
  return <div style={{ width: PHONE_W2 * s, height: PHONE_H2 * s }}><div style={{ width: PHONE_W2, height: PHONE_H2, transform: `scale(${s})`, transformOrigin: 'top left', position: 'relative' }}>{children}</div></div>;
}

const TWEAK_DEFAULTS2 = /*EDITMODE-BEGIN*/{
  "accentTheme": "Tomato",
  "secPerMin": 1,
  "replayStyle": "flipbook"
}/*EDITMODE-END*/;

function App2() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS2);
  const [store, setStoreRaw] = useStateA2(load2);
  const resumed = React.useRef(loadSession());
  const [screen, setScreen] = useStateA2(() => (load2().onboarded ? 'grow' : 'welcome'));
  const [result, setResult] = useStateA2(null);
  const [firstRun, setFirstRun] = useStateA2(false);
  const [lastDur, setLastDur] = useStateA2(25);
  const [modal, setModal] = useStateA2(null);
  const [renameVal, setRenameVal] = useStateA2('');
  // real-device = fill the screen (no simulated bezel); desktop = framed mockup
  const [fullscreen, setFullscreen] = useStateA2(() => {
    try { return window.matchMedia('(max-width: 600px)').matches || window.matchMedia('(pointer: coarse)').matches; } catch (e) { return false; }
  });
  useLayoutEffectA2(() => {
    const fit = () => { try { setFullscreen(window.matchMedia('(max-width: 600px)').matches || window.matchMedia('(pointer: coarse)').matches); } catch (e) {} };
    window.addEventListener('resize', fit); return () => window.removeEventListener('resize', fit);
  }, []);

  const setStore = (u) => setStoreRaw((s) => { const n = typeof u === 'function' ? u(s) : u; try { localStorage.setItem(STORE_KEY2, JSON.stringify(n)); } catch (e) {} return n; });

  const tk = tkey2();
  const eff = { ...store, todayMinutes: store.daily?.[tk] || 0 };
  const mascotName = store.name || 'Toma';
  const accent = ACCENTS2[t.accentTheme] || ACCENTS2['Tomato'];
  const secPerMin = 60; // real time: 1 focus-minute = 60 real seconds
  const [replayStyle, setReplayStyleState] = useStateA2(() => { try { return localStorage.getItem('tomatoTimer.replayStyle') || 'flipbook'; } catch (e) { return 'flipbook'; } });
  const toggleReplayStyle = () => { const v = replayStyle === 'soft' ? 'flipbook' : 'soft'; try { localStorage.setItem('tomatoTimer.replayStyle', v); } catch (e) {} setReplayStyleState(v); };

  const recordSpecimen = ({ frac, minutes }) => setStore((s) => {
    const k = tkey2();
    const daily = { ...(s.daily || {}), [k]: (s.daily?.[k] || 0) + minutes };
    let streak = s.streak; const y = new Date(); y.setDate(y.getDate() - 1); const yk = y.toISOString().slice(0, 10);
    if (s.lastDate === k) {} else if (s.lastDate === yk) streak += 1; else streak = 1;
    return { ...s, daily, lastDate: k, totalMinutes: (s.totalMinutes || 0) + minutes, streak,
      specimens: [...(s.specimens || []), { d: k, f: Math.max(0, Math.min(1, frac)), ts: Date.now() }] };
  });

  const handleComplete = (res) => {
    recordSpecimen({ frac: 1, minutes: res.duration });
    setResult(res);
    setScreen('complete');
  };

  let content;
  if (screen === 'welcome') {
    content = <Welcome2 onStart={(name) => { setStore((s) => ({ ...s, name, onboarded: true })); setFirstRun(true); setScreen('grow'); }} />;
  } else if (screen === 'grow') {
    content = <GrowScreen store={eff} mascotName={mascotName} secPerMin={secPerMin} replayStyle={replayStyle} onToggleReplay={toggleReplayStyle}
      initialSession={resumed.current}
      onComplete={(r) => { resumed.current = null; setFirstRun(false); handleComplete(r); }}
      onExitSession={(info) => { resumed.current = null; if (info && info.minutes >= 1) recordSpecimen({ frac: info.frac, minutes: info.minutes }); }}
      onOpenGarden={() => setScreen('garden')} onOpenSettings={() => setScreen('settings')} />;
    resumed.current = null;
  } else if (screen === 'complete') {
    content = <Complete2 result={result} mascotName={mascotName} firstRun={firstRun} totalHarvest={store.specimens.length}
      onBreak={() => setScreen('break')} onAgain={() => setScreen('grow')} onGarden={() => { setFirstRun(false); setScreen('garden'); }} />;
  } else if (screen === 'break') {
    content = <Break2 duration={5} mascotName={mascotName} secPerMin={secPerMin} onDone={() => setScreen('grow')} />;
  } else if (screen === 'garden') {
    content = <Garden2 store={eff} mascotName={mascotName} onBack={() => setScreen('grow')} />;
  } else {
    content = <Settings2 store={eff} setStore={setStore} mascotName={mascotName} onBack={() => setScreen('grow')}
      onRename={() => { setRenameVal(store.name); setModal('rename'); }} onReset={() => setModal('reset')} />;
  }

  const modals = (
    <>
      {modal === 'rename' && (
        <Modal2 onClose={() => setModal(null)}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#4A3A2C', textAlign: 'center' }}>Tomato name</div>
          <input value={renameVal} onChange={(e) => setRenameVal(e.target.value)} maxLength={8} autoFocus
            style={{ width: '100%', boxSizing: 'border-box', textAlign: 'center', border: 'none', outline: 'none', background: '#FBF4E8', borderRadius: 14, padding: '13px', fontSize: 17, fontWeight: 700, color: '#4A3A2C', fontFamily: 'inherit', margin: '14px 0' }} />
          <button onClick={() => { if (renameVal.trim()) setStore((s) => ({ ...s, name: renameVal.trim() })); setModal(null); }} className="grow-cta" style={{ ...ctaStyle, width: '100%', marginTop: 0, boxSizing: 'border-box' }}>Save</button>
        </Modal2>
      )}
      {modal === 'reset' && (
        <Modal2 onClose={() => setModal(null)}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#4A3A2C' }}>Reset your garden?</div>
            <div style={{ fontSize: 13.5, color: '#8B7560', fontWeight: 600, marginTop: 6, lineHeight: 1.45 }}>All your specimens and records will be gone. This can’t be undone.</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 18 }}>
            <button onClick={() => { setStore({ ...DEFAULT2, onboarded: true, name: store.name }); setModal(null); setScreen('grow'); }} style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 16, background: '#E0573C', color: '#fff', borderRadius: 999, padding: '15px' }}>Reset</button>
            <button onClick={() => setModal(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, color: '#A8927C', padding: '8px' }}>Cancel</button>
          </div>
        </Modal2>
      )}
    </>
  );

  const vars = { '--accent': accent.a, '--accent-soft': accent.soft, '--accent-ink': accent.ink, '--accent-shadow': accent.sh };

  if (fullscreen) {
    return (
      <div style={{ ...vars, position: 'fixed', inset: 0, overflow: 'hidden', background: '#FDF7EB' }}>
        {content}
        {modals}
      </div>
    );
  }

  return (
    <div style={{ ...vars, position: 'relative' }}>
      <Scaler2>
        <IOSDevice>{content}</IOSDevice>
        {modals}
      </Scaler2>
      <Tweaks2 t={t} setTweak={setTweak} />
    </div>
  );
}

function Modal2({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 90, background: 'rgba(74,58,44,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 36 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 26, padding: '24px 22px', width: '100%', maxWidth: 320 }}>{children}</div>
    </div>
  );
}

function Tweaks2({ t, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Color theme" />
      <TweakSelect label="Accent" value={t.accentTheme} options={['Tomato', 'Apricot', 'Plum', 'Olive', 'Blue']} onChange={(v) => setTweak('accentTheme', v)} />
      <TweakSection label="Growth replay" />
      <TweakSelect label="Style" value={t.replayStyle} options={['staged', 'flipbook']} onChange={(v) => setTweak('replayStyle', v)} />
      <div style={{ fontSize: 11.5, color: '#9A8B7E', padding: '4px 2px 0', lineHeight: 1.5 }}>staged = key stages (타타탁), flipbook = all 33 frames fast.</div>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App2 />);
