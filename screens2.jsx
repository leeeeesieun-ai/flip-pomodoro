// screens2.jsx — Garden (S6) · Settings (S7) · Welcome (minimal onboarding)
const { useState: useStateS2 } = React;

function BackBar({ title, onBack }) {
  return (
    <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 10, padding: 'calc(var(--safe-top) + 14px) 20px 6px' }}>
      <button onClick={onBack} className="tt-glass" style={{ border: 'none', cursor: 'pointer', width: 38, height: 38, borderRadius: 999, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px -4px rgba(90,70,50,0.25)' }}>
        <svg width="11" height="18" viewBox="0 0 11 18" fill="none"><path d="M9 2L2 9l7 7" stroke="#7A6552" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div className="wordmark" style={{ fontSize: 22, color: '#5A4636', whiteSpace: 'nowrap' }}>{title}</div>
    </div>
  );
}

function dayLabel(key) {
  const today = new Date().toISOString().slice(0, 10);
  const y = new Date(); y.setDate(y.getDate() - 1);
  const yk = y.toISOString().slice(0, 10);
  if (key === today) return 'Today';
  if (key === yk) return 'Yesterday';
  return new Date(key + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function Garden2({ store, mascotName, onBack }) {
  const specimens = store.specimens || [];
  const byDay = {};
  specimens.forEach((sp) => { (byDay[sp.d] = byDay[sp.d] || []).push(sp); });
  const dayKeys = Object.keys(byDay).sort().reverse();
  const frameFor = (f) => FRAMES[Math.round(Math.max(0, Math.min(1, f)) * (FRAMES.length - 1))];

  return (
    <div style={{ position: 'absolute', inset: 0, background: CREAM, overflow: 'auto', paddingBottom: 'calc(40px + var(--safe-bottom))' }}>
      <Grain />
      <BackBar title={`${mascotName}’s Garden`} onBack={onBack} />
      <div style={{ padding: '0 20px' }}>
        <div style={{ fontSize: 13, color: '#A8927C', fontWeight: 600, margin: '0 2px 20px' }}>
          {specimens.length} specimen{specimens.length === 1 ? '' : 's'}{store.streak > 0 ? ` · ${store.streak} day streak` : ''}
        </div>

        {specimens.length === 0 ?
        <div style={{ textAlign: 'center', color: '#B9A48E', fontWeight: 600, fontSize: 14, padding: '60px 0', lineHeight: 1.6 }}>
            Nothing planted yet.<br />Grow your first tomato 🌱
          </div> :

        dayKeys.map((k) =>
        <div key={k} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#B9A48E', margin: '0 2px 10px', letterSpacing: 0.3 }}>{dayLabel(k)}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {byDay[k].slice().reverse().map((sp, i) => {
              const pct = Math.round(sp.f * 100);
              const done = pct >= 100;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 16, overflow: 'hidden', background: '#FFFDF8', boxShadow: '0 2px 9px -6px rgba(90,70,50,0.5)' }}>
                      <img src={frameFor(sp.f)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 42%' }} />
                    </div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: done ? 'var(--accent)' : '#A8927C' }}>{pct}%</div>
                  </div>);

            })}
            </div>
          </div>
        )}
      </div>
    </div>);

}

const ICOL = '#8A7561';
const svgWrap = (children) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ICOL} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{children}</svg>);
const SI = {
  pen: svgWrap(<><path d="M4 20h4L18.5 9.5l-4-4L4 16v4Z" /><path d="M13.5 6.5l4 4" /></>),
  bell: svgWrap(<><path d="M6 9.5a6 6 0 0 1 12 0c0 4.5 1.8 5.5 1.8 5.5H4.2S6 14 6 9.5Z" /><path d="M10 19a2 2 0 0 0 4 0" /></>),
  moon: svgWrap(<path d="M20 14.2A8 8 0 1 1 9.8 4 6.4 6.4 0 0 0 20 14.2Z" />),
  clock: svgWrap(<><circle cx="12" cy="13.5" r="6.6" /><path d="M12 13.5V10" /><path d="M5 4.5 2.6 6.6M19 4.5l2.4 2.1" /></>),
  speaker: svgWrap(<><path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4Z" /><path d="M16.5 9.5a3.2 3.2 0 0 1 0 5" /></>),
  haptic: svgWrap(<><rect x="8.5" y="4" width="7" height="16" rx="1.6" /><path d="M5 9v6M19 9v6" /></>),
  trash: svgWrap(<><path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.9 12.5h9.2L17.5 7" /></>)
};

function Settings2({ store, setStore, mascotName, onBack, onRename, onReset }) {
  const Row = ({ icon, title, sub, right, onClick, last }) => (
    <button onClick={onClick} style={{ border: 'none', background: 'none', cursor: onClick ? 'pointer' : 'default', width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '15px 18px', fontFamily: 'inherit', textAlign: 'left', borderBottom: last ? 'none' : '1px solid #F0E7D9' }}>
      <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15.5, fontWeight: 700, color: '#4A3A2C' }}>{title}</div>
        {sub && <div style={{ fontSize: 12.5, color: '#A8927C', fontWeight: 600, marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </button>
  );
  const Toggle = ({ on, onChange }) => (
    <div onClick={(e) => { e.stopPropagation(); onChange(!on); }} style={{ width: 48, height: 29, borderRadius: 99, background: on ? 'var(--accent)' : '#E3D5C2', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 22 : 3, width: 23, height: 23, borderRadius: 99, background: '#fff', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </div>
  );
  const card = { background: 'rgba(255,255,255,0.65)', borderRadius: 18, overflow: 'hidden', marginBottom: 18 };
  const head = { fontSize: 12, fontWeight: 800, color: '#B9A48E', margin: '6px 4px 8px', letterSpacing: 0.6 };

  return (
    <div style={{ position: 'absolute', inset: 0, background: CREAM, overflow: 'auto', paddingBottom: 'calc(40px + var(--safe-bottom))' }}>
      <BackBar title="Settings" onBack={onBack} />
      <div style={{ padding: '4px 20px 0' }}>
        <div style={head}>TOMATO</div>
        <div style={card}><Row icon={SI.pen} title="Name" sub="Rename your tomato" right={<span style={{ fontSize: 14, fontWeight: 700, color: '#9A856F' }}>{mascotName} ›</span>} onClick={onRename} last /></div>
        <div style={head}>NOTIFICATIONS · PERMISSIONS</div>
        <div style={card}>
          <Row icon={SI.bell} title="Notifications" sub="Focus-end alerts" right={<Toggle on={store.perms?.notif} onChange={(v) => setStore((s) => ({ ...s, perms: { ...s.perms, notif: v } }))} />} />
          <Row icon={SI.moon} title="Focus mode" sub="Do Not Disturb during sessions" right={<Toggle on={store.perms?.dnd} onChange={(v) => setStore((s) => ({ ...s, perms: { ...s.perms, dnd: v } }))} />} />
          <Row icon={SI.clock} title="Daily reminder" sub={store.reminder ? `Every day at ${store.reminder}` : 'Off'} right={<Toggle on={!!store.reminder} onChange={(v) => setStore((s) => ({ ...s, reminder: v ? '21:00' : null }))} />} last />
        </div>
        <div style={head}>FOCUS · SOUND</div>
        <div style={card}>
          <Row icon={SI.speaker} title="Sound effects" sub="Completion · break sounds" right={<Toggle on={store.sound} onChange={(v) => setStore((s) => ({ ...s, sound: v }))} />} />
          <Row icon={SI.haptic} title="Haptics" sub="Stage & completion buzz" right={<Toggle on={store.haptic} onChange={(v) => setStore((s) => ({ ...s, haptic: v }))} />} last />
        </div>
        <div style={head}>DATA</div>
        <div style={card}><Row icon={SI.trash} title="Reset garden" sub="Delete all specimens & records" right={<span style={{ color: '#E0573C', fontWeight: 700 }}>›</span>} onClick={onReset} last /></div>
        <div style={{ textAlign: 'center', fontSize: 12, color: '#B9A48E', marginTop: 4, lineHeight: 1.6 }}>{store.honorMode ? 'Honor mode · works without permissions' : 'Focus-protection mode'}<br/>Flip Pomodoro · offline-first</div>
      </div>
    </div>
  );
}

// welcome (single screen — no naming step; defaults to "Toma", rename later in Settings)
function Welcome2({ onStart }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: CREAM, overflow: 'hidden' }}>
      <img src={HERO_RED} alt="" className="grow-breathe tt-feather" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 42%' }} />
      <Grain />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '90px 32px calc(48px + var(--safe-bottom))', background: 'linear-gradient(to top, rgba(253,247,235,0.97) 50%, rgba(253,247,235,0))', zIndex: 5, textAlign: 'center' }}>
        <div className="wordmark" style={{ fontSize: 32, color: '#5A4636' }}>Flip Pomodoro</div>
        <div style={{ fontSize: 15.5, color: '#8B7560', fontWeight: 600, marginTop: 10, lineHeight: 1.6 }}>Flip your phone, grow a tomato.</div>
        <button onClick={() => onStart('Toma')} className="grow-cta" style={{ ...ctaStyle, width: '100%', marginTop: 26, boxSizing: 'border-box' }}>Get started</button>
      </div>
    </div>
  );
}

Object.assign(window, { Garden2, Settings2, Welcome2, BackBar });
