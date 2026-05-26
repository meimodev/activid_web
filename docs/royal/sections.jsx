/* All page sections — pure presentational components composed by app.jsx */

const O = window.Ornaments;
const { useState, useEffect, useRef } = React;

/* ---------- Shared bits ---------- */

const SectionHead = ({ eyebrow, title, em, sub }) => (
  <>
    {eyebrow && (
      <div className="reveal" style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <O.BloomStar size={26} className="in" />
      </div>
    )}
    {eyebrow && <div className="eyebrow section-eyebrow reveal" data-delay="1">{eyebrow}</div>}
    <h2 className="section-title reveal" data-delay="2">
      {title} {em && <em>{em}</em>}
    </h2>
    <div className="reveal" data-delay="3" style={{ display: 'flex', justifyContent: 'center', margin: 'var(--s-4) auto var(--s-6)' }}>
      <O.GrandDivider width={240} className="in" />
    </div>
    {sub && <p className="body reveal" data-delay="3" style={{ textAlign: 'center', maxWidth: 320, margin: '0 auto var(--s-5)' }}>{sub}</p>}
  </>
);

/* ---------- 1. Hero (after envelope) ---------- */

function Hero() {
  return (
    <section id="hero" style={{ padding: '64px 28px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Side vines — pinned hard to the edges, narrower, behind content */}
      <div className="reveal" style={{
        position: 'absolute', top: 60, bottom: 60, left: -8,
        width: 44, opacity: 0.45, pointerEvents: 'none', zIndex: 0,
      }}>
        <O.VineBorder height={780} side="left" className="in" />
      </div>
      <div className="reveal" style={{
        position: 'absolute', top: 60, bottom: 60, right: -8,
        width: 44, opacity: 0.45, pointerEvents: 'none', zIndex: 0,
      }}>
        <O.VineBorder height={780} side="right" className="in" />
      </div>

      {/* Content column — capped width + extra horizontal margin so it never touches the vines */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 300, margin: '0 auto' }}>

        <div className="eyebrow reveal" style={{ marginBottom: 18 }}>The Wedding of</div>

        <div className="reveal" data-delay="1" style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
          <O.GrandDivider width={220} className="in" />
        </div>

        <div className="reveal" data-delay="2" style={{
          position: 'relative',
          width: 220, height: 220,
          margin: '0 auto',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0.5, zIndex: 0,
          }}>
            <O.WreathSpinner size={220} />
          </div>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1,
          }}>
            <O.Crest size={130} initials="J&J" className="in idle-float" />
          </div>
        </div>

        <h1 className="display reveal" data-delay="3" style={{
          fontSize: 13, letterSpacing: '0.46em', textTransform: 'uppercase',
          color: 'var(--gold)', marginTop: 28,
        }}>
          Save The Date
        </h1>

        <div className="reveal" data-delay="3" style={{ marginTop: 14 }}>
          <div className="script shimmer" style={{ fontSize: 72, lineHeight: 1.18, padding: '0.1em 0 0.18em' }}>Jhon</div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 14, margin: '4px auto',
            fontFamily: 'var(--f-serif)', fontStyle: 'italic',
            color: 'var(--cream-soft)', fontSize: 22,
            maxWidth: 220,
          }}>
            <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            <span>&amp;</span>
            <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          </div>
          <div className="script shimmer" style={{ fontSize: 72, lineHeight: 1.18, padding: '0.1em 0 0.18em' }}>Jiny</div>
        </div>

        <div className="reveal" data-delay="4" style={{ marginTop: 26 }}>
          <O.Flourish width={260} className="in" />
        </div>

        <div className="meta reveal" data-delay="5" style={{ marginTop: 22, lineHeight: 1.6 }}>
          Saturday · 30 May 2026<br/>Los Angeles
        </div>

        <div className="reveal" data-delay="5" style={{
          marginTop: 36,
          display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          color: 'var(--gold)',
        }}>
          <div className="meta" style={{ color: 'var(--gold-warm)' }}>scroll</div>
          <svg width="18" height="36" viewBox="0 0 18 36" className="idle-float" fill="none" stroke="currentColor">
            <rect x="1" y="1" width="16" height="26" rx="8" />
            <circle cx="9" cy="9" r="2" fill="currentColor">
              <animate attributeName="cy" values="9;16;9" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <path d="M9 30 l-4 -4 M9 30 l4 -4" />
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ---------- 2. Save the Date / Countdown ---------- */

function useCountdown(target) {
  const [t, setT] = useState(() => diff(target));
  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;

  function diff(d) {
    const ms = Math.max(0, d - Date.now());
    const days = Math.floor(ms / 86400000);
    const hrs  = Math.floor(ms / 3600000) % 24;
    const min  = Math.floor(ms / 60000) % 60;
    const sec  = Math.floor(ms / 1000) % 60;
    return { days, hrs, min, sec };
  }
}

function FlipDigit({ value }) {
  const [prev, setPrev] = useState(value);
  const [flipping, setFlipping] = useState(false);
  useEffect(() => {
    if (value !== prev) {
      setFlipping(true);
      const t = setTimeout(() => { setPrev(value); setFlipping(false); }, 600);
      return () => clearTimeout(t);
    }
  }, [value, prev]);
  return (
    <div style={{
      position: 'relative',
      width: 52, height: 64,
      background: 'linear-gradient(180deg, #3a2240, #221128)',
      border: '1px solid var(--line)',
      borderRadius: 4,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.03), inset 0 -10px 16px rgba(0,0,0,0.4)',
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: 0, right: 0,
        height: 1, background: 'rgba(0,0,0,0.4)', zIndex: 3,
      }} />
      <div className="display" style={{
        fontSize: 36, color: 'var(--gold)',
        fontVariantNumeric: 'tabular-nums',
        transition: 'transform .6s cubic-bezier(.6,.1,.2,1), opacity .6s',
        transform: flipping ? 'translateY(-8px)' : 'translateY(0)',
        opacity: flipping ? 0.2 : 1,
      }}>{String(value).padStart(2, '0')}</div>
    </div>
  );
}

function Countdown() {
  const target = new Date('2026-05-30T16:00:00-07:00').getTime();
  const { days, hrs, min, sec } = useCountdown(target);

  const units = [
    { label: 'days', value: days },
    { label: 'hours', value: hrs },
    { label: 'minutes', value: min },
    { label: 'seconds', value: sec },
  ];

  return (
    <section id="countdown">
      <SectionHead eyebrow="A moment to remember" title="Counting the" em="days" />
      <div className="reveal" data-delay="3" style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10,
        maxWidth: 360, margin: '0 auto', position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: '-60px 0 -60px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', opacity: 0.35, zIndex: 0 }}>
          <O.WreathSpinner size={260} />
        </div>
        {units.map(u => (
          <div key={u.label} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <FlipDigit value={u.value} />
            <div className="meta" style={{ marginTop: 8, fontSize: 9 }}>{u.label}</div>
          </div>
        ))}
      </div>
      <div className="reveal" data-delay="4" style={{ marginTop: 36, textAlign: 'center' }}>
        <O.Sprig width={120} className="in" />
        <div className="body" style={{ fontStyle: 'italic', marginTop: 14, fontSize: 18 }}>
          “Two souls. One story.<br/>The pages turn ever closer.”
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. Bride & Groom ---------- */

function Person({ role, name, parents, side }) {
  return (
    <div className="reveal" data-delay={side === 'left' ? '1' : '2'} style={{ textAlign: 'center' }}>
      <div className="reveal" data-delay="1">
        <O.Arch w={180} h={240}>
          <O.PhotoPlaceholder label={`${role.toUpperCase()} PHOTO`} />
        </O.Arch>
      </div>
      <div className="meta" style={{ marginTop: 16 }}>{role}</div>
      <div className="script shimmer" style={{ fontSize: 52, lineHeight: 1.25, marginTop: 6, padding: '0.1em 0 0.15em' }}>
        {name}
      </div>
      <div className="body" style={{ fontSize: 14, marginTop: 10, color: 'var(--cream-soft)' }}>
        {parents}
      </div>
    </div>
  );
}

function BrideGroom() {
  return (
    <section id="couple">
      <SectionHead
        eyebrow="With joyful hearts"
        title="The"
        em="couple"
        sub="Together with their families, they ask for your blessing on this sacred day."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
        <Person role="The Bride" name="Jiny Arumz" parents="Daughter of Mr. &amp; Mrs. Arumz" side="left" />
        <div className="reveal" style={{ textAlign: 'center', color: 'var(--gold)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.55, pointerEvents: 'none' }}>
            <O.BloomStar size={80} className="in" />
          </div>
          <span className="script" style={{ fontSize: 64, position: 'relative' }}>&amp;</span>
        </div>
        <Person role="The Groom" name="Jhon Manemz" parents="Son of Mr. &amp; Mrs. Manemz" side="right" />
      </div>
    </section>
  );
}

/* ---------- 4. Our Story timeline ---------- */

const STORY = [
  { date: 'Spring 2021', title: 'First Glance',
    text: 'A chance meeting at a small bookstore café — coffee spilled, apologies exchanged, and a number written on a napkin.' },
  { date: 'Winter 2022', title: 'The First Trip',
    text: 'A quiet weekend in the mountains turned into a thousand inside jokes and a promise to never travel alone again.' },
  { date: 'Summer 2024', title: 'The Question',
    text: 'Under a sky full of fireflies, with one knee on the grass, the only answer that mattered was yes.' },
  { date: 'May 2026', title: 'Forever',
    text: 'And so, the next chapter begins — surrounded by those we love most.' },
];

function Story() {
  return (
    <section id="story">
      <SectionHead eyebrow="How it began" title="Our" em="story" />
      <div style={{ position: 'relative', paddingLeft: 36 }}>
        <div className="reveal" style={{
          position: 'absolute', left: 14, top: 6, bottom: 6, width: 1,
          background: 'linear-gradient(180deg, transparent, var(--gold) 10%, var(--gold) 90%, transparent)',
          opacity: 0.5,
        }} />
        {STORY.map((s, i) => (
          <div key={i} className="reveal" data-delay={String(Math.min(i+1, 5))}
               style={{ position: 'relative', marginBottom: 36 }}>
            <div style={{
              position: 'absolute', left: -29, top: 6, width: 12, height: 12,
              border: '1px solid var(--gold)', background: 'var(--bg)',
              transform: 'rotate(45deg)',
              animation: `pulse-soft ${2 + i*0.3}s ease-in-out infinite`,
            }} />
            <div className="meta" style={{ fontSize: 10 }}>{s.date}</div>
            <div className="display" style={{ fontSize: 24, color: 'var(--cream)', marginTop: 4 }}>
              {s.title}
            </div>
            <div className="body" style={{ fontSize: 14, marginTop: 6 }}>{s.text}</div>
          </div>
        ))}
      </div>
      <div className="reveal" style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
        <O.Flourish width={260} className="in idle-sway" />
      </div>
    </section>
  );
}

/* ---------- 5. Event Details ---------- */

function EventCard({ kind, title, time, place, address }) {
  return (
    <div className="card reveal" data-delay="1">
      <div className="meta" style={{ color: 'var(--gold-warm)', textAlign: 'center' }}>{kind}</div>
      <div className="display" style={{
        fontSize: 30, color: 'var(--cream)', textAlign: 'center', marginTop: 6,
      }}>{title}</div>
      <div style={{ margin: '14px auto', display: 'flex', justifyContent: 'center' }}>
        <O.Sprig width={80} className="in" />
      </div>
      <div style={{ display: 'grid', gap: 12, marginTop: 10 }}>
        <Row label="When" value={time} />
        <Row label="Where" value={place} />
        <Row label="Address" value={address} />
      </div>
    </div>
  );

  function Row({ label, value }) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: 8, alignItems: 'baseline' }}>
        <div className="meta" style={{ fontSize: 9, color: 'var(--gold)' }}>{label}</div>
        <div className="body" style={{ fontSize: 14, color: 'var(--cream)' }}>{value}</div>
      </div>
    );
  }
}

function Events() {
  return (
    <section id="events">
      <SectionHead eyebrow="The celebration" title="Event" em="details" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <EventCard
          kind="Ceremony"
          title="The Vows"
          time="Saturday, 30 May 2026 · 4:00 PM"
          place="The Rose Garden Chapel"
          address="1200 Sunset Blvd, Los Angeles, CA"
        />
        <div className="reveal" style={{ textAlign: 'center', color: 'var(--gold)' }}>
          <O.RoseSm size={36} className="in idle-float" />
        </div>
        <EventCard
          kind="Reception"
          title="The Banquet"
          time="Saturday, 30 May 2026 · 7:00 PM"
          place="The Velvet Hall"
          address="44 Beverly Crescent, Los Angeles, CA"
        />
      </div>
    </section>
  );
}

/* ---------- 6. Venue & Map ---------- */

function Venue() {
  return (
    <section id="venue">
      <SectionHead
        eyebrow="Find your way"
        title="The"
        em="venue"
        sub="Both the ceremony and reception will take place in Los Angeles. Tap the card to open in maps."
      />
      <div className="card reveal" data-delay="1" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Stylized map */}
        <div style={{
          position: 'relative', height: 220,
          background: 'linear-gradient(160deg, #2b1a2e, #1d1020)',
          overflow: 'hidden',
        }}>
          <svg viewBox="0 0 400 220" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"
               fill="none" stroke="var(--line)" strokeWidth="0.5">
            {/* grid blocks */}
            {Array.from({length: 8}).map((_, i) =>
              <line key={'v'+i} x1={i*50} y1="0" x2={i*50} y2="220" />
            )}
            {Array.from({length: 5}).map((_, i) =>
              <line key={'h'+i} x1="0" y1={i*50} x2="400" y2={i*50} />
            )}
            {/* "roads" */}
            <path d="M0 60 Q120 80 240 60 T400 80" stroke="var(--gold)" strokeWidth="1" opacity="0.6" />
            <path d="M0 160 Q120 140 240 160 T400 140" stroke="var(--gold)" strokeWidth="1" opacity="0.6" />
            <path d="M180 0 L180 220" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
            <path d="M280 0 Q260 110 300 220" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
            {/* "park" */}
            <path d="M40 90 Q70 80 100 90 Q110 120 90 140 Q60 150 40 130 Z" fill="rgba(201,169,97,0.08)" stroke="var(--line)"/>
            {/* pin location */}
            <circle cx="200" cy="110" r="22" fill="rgba(201,169,97,0.15)" stroke="var(--gold)">
              <animate attributeName="r" values="22;34;22" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0.2;1" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="200" cy="110" r="6" fill="var(--gold)" />
          </svg>
          <div style={{
            position: 'absolute', bottom: 12, left: 12,
            padding: '6px 10px',
            background: 'rgba(29,16,32,0.8)',
            border: '1px solid var(--line)',
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 9, color: 'var(--gold-warm)',
            letterSpacing: '0.15em',
          }}>34.0522° N · 118.2437° W</div>
        </div>
        <div style={{ padding: 20, textAlign: 'center' }}>
          <div className="display" style={{ fontSize: 22, color: 'var(--cream)' }}>The Velvet Hall</div>
          <div className="body" style={{ fontSize: 13, marginTop: 4 }}>44 Beverly Crescent, Los Angeles</div>
          <button className="btn" style={{ marginTop: 18 }}>
            <span>Open in Maps</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------- 7. Gallery ---------- */

function Gallery() {
  const tiles = [
    { w: 2, h: 2, label: 'PORTRAIT 01' },
    { w: 1, h: 1, label: 'DETAIL' },
    { w: 1, h: 1, label: 'CANDID' },
    { w: 1, h: 2, label: 'BOUQUET' },
    { w: 2, h: 1, label: 'TWO OF US' },
    { w: 1, h: 1, label: 'RING' },
    { w: 2, h: 1, label: 'GOLDEN HOUR' },
  ];
  return (
    <section id="gallery">
      <SectionHead eyebrow="Frozen in time" title="The" em="gallery" />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridAutoRows: '70px',
        gap: 6,
      }}>
        {tiles.map((t, i) => (
          <div key={i} className="reveal" data-delay={String((i % 5) + 1)}
               style={{
                 gridColumn: `span ${t.w}`,
                 gridRow: `span ${t.h}`,
                 overflow: 'hidden',
                 border: '1px solid var(--line-soft)',
                 position: 'relative',
                 transition: 'transform .8s ease',
               }}
               onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <O.PhotoPlaceholder label={t.label} />
          </div>
        ))}
      </div>
      <div className="reveal" style={{ textAlign: 'center', marginTop: 28 }}>
        <O.Divider width={180} className="in" />
      </div>
    </section>
  );
}

/* ---------- 8. RSVP ---------- */

function RSVP() {
  const [step, setStep] = useState('form'); // form | submitted
  const [name, setName] = useState('');
  const [attend, setAttend] = useState(null);
  const [guests, setGuests] = useState(1);
  const [note, setNote] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!name || attend === null) return;
    setStep('submitted');
  }

  if (step === 'submitted') {
    return (
      <section id="rsvp">
        <div className="reveal in" style={{ textAlign: 'center' }}>
          <O.Crest size={120} initials="✓" className="in idle-float" />
          <div className="display" style={{ fontSize: 32, marginTop: 16 }}>
            Thank you, <span className="script shimmer" style={{ fontSize: 40 }}>{name.split(' ')[0]}</span>
          </div>
          <div className="body" style={{ marginTop: 12 }}>
            {attend
              ? "We can't wait to celebrate with you."
              : "We'll miss you — your love still travels with us."}
          </div>
          <button className="btn btn-ghost" style={{ marginTop: 24 }} onClick={() => setStep('form')}>
            <span>Edit Response</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp">
      <SectionHead
        eyebrow="Kindly respond"
        title="Will you"
        em="join us?"
        sub="Please share your reply by 1 May 2026 so we may prepare for your arrival."
      />
      <form onSubmit={submit} style={{ display: 'grid', gap: 18 }}>
        <FormField label="Your full name">
          <input value={name} onChange={e => setName(e.target.value)}
                 placeholder="As written on the invitation"
                 style={inputStyle} />
        </FormField>

        <FormField label="Will you attend?">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Choice active={attend === true} onClick={() => setAttend(true)}>
              Joyfully accept
            </Choice>
            <Choice active={attend === false} onClick={() => setAttend(false)}>
              Regretfully decline
            </Choice>
          </div>
        </FormField>

        {attend && (
          <FormField label="Number of guests (including you)">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button type="button" onClick={() => setGuests(Math.max(1, guests-1))} style={stepperBtn}>−</button>
              <div className="display" style={{ fontSize: 32, color: 'var(--gold)', minWidth: 32, textAlign: 'center' }}>{guests}</div>
              <button type="button" onClick={() => setGuests(Math.min(6, guests+1))} style={stepperBtn}>+</button>
            </div>
          </FormField>
        )}

        <FormField label="A message for the couple (optional)">
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                    placeholder="Wishes, prayers, anything…"
                    style={{ ...inputStyle, resize: 'none', fontFamily: 'var(--f-serif)' }} />
        </FormField>

        <button type="submit" className="btn" style={{ marginTop: 6 }}>
          <span>Send My Reply</span>
        </button>
      </form>
    </section>
  );

  function FormField({ label, children }) {
    return (
      <label className="reveal" data-delay="1" style={{ display: 'grid', gap: 8 }}>
        <span className="meta" style={{ fontSize: 9 }}>{label}</span>
        {children}
      </label>
    );
  }

  function Choice({ active, onClick, children }) {
    return (
      <button type="button" onClick={onClick} style={{
        padding: '14px 10px',
        background: active ? 'rgba(201,169,97,0.12)' : 'transparent',
        border: `1px solid ${active ? 'var(--gold)' : 'var(--line-soft)'}`,
        color: active ? 'var(--gold)' : 'var(--cream)',
        fontFamily: 'var(--f-serif)', fontSize: 14,
        cursor: 'pointer',
        transition: 'all .3s ease',
        position: 'relative',
      }}>
        {active && <span style={{
          position: 'absolute', top: 4, right: 6, color: 'var(--gold)', fontSize: 10,
        }}>✓</span>}
        {children}
      </button>
    );
  }
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(0,0,0,0.2)',
  border: '1px solid var(--line-soft)',
  color: 'var(--cream)',
  fontFamily: 'var(--f-serif)',
  fontSize: 15,
  outline: 'none',
  transition: 'border-color .3s, background .3s',
};
const stepperBtn = {
  width: 36, height: 36, border: '1px solid var(--line)',
  background: 'transparent', color: 'var(--gold)',
  fontSize: 18, cursor: 'pointer',
};

/* ---------- 9. Gift / Registry ---------- */

function Gift() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState('');

  const accounts = [
    { bank: 'Bank of America', name: 'Jiny Arumz', number: '4421 ‧ 9872 ‧ 1130' },
    { bank: 'Chase', name: 'Jhon Manemz', number: '8810 ‧ 4521 ‧ 3392' },
  ];

  function copy(num) {
    navigator.clipboard && navigator.clipboard.writeText(num.replace(/\s|‧/g,''));
    setCopied(num);
    setTimeout(() => setCopied(''), 1800);
  }

  return (
    <section id="gift">
      <SectionHead
        eyebrow="Your blessings are enough"
        title="A token of"
        em="love"
        sub="If you wish to send a gift to brighten our new beginning, here is the way."
      />
      <div className="reveal" data-delay="1" style={{ textAlign: 'center' }}>
        {!open && (
          <button className="btn" onClick={() => setOpen(true)}>
            <span>Reveal Gift Details</span>
          </button>
        )}
      </div>

      <div style={{
        maxHeight: open ? 600 : 0,
        opacity: open ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height .9s cubic-bezier(.6,.1,.2,1), opacity .6s ease',
        marginTop: open ? 24 : 0,
      }}>
        <div style={{ display: 'grid', gap: 14 }}>
          {accounts.map((a, i) => (
            <div key={i} className="card" style={{ padding: 18 }}>
              <div className="meta" style={{ color: 'var(--gold-warm)' }}>{a.bank}</div>
              <div className="display" style={{ fontSize: 18, color: 'var(--cream)', marginTop: 6 }}>{a.name}</div>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginTop: 10, gap: 12,
              }}>
                <div style={{
                  fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                  fontSize: 14, color: 'var(--gold)',
                  letterSpacing: '0.05em',
                }}>{a.number}</div>
                <button onClick={() => copy(a.number)} style={{
                  background: 'transparent', border: '1px solid var(--line)',
                  color: copied === a.number ? 'var(--gold)' : 'var(--cream)',
                  fontFamily: 'var(--f-sans)', fontSize: 10, letterSpacing: '0.2em',
                  padding: '8px 12px', cursor: 'pointer', textTransform: 'uppercase',
                  transition: 'all .3s ease',
                }}>
                  {copied === a.number ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 10. Quote / Verse ---------- */

function Quote() {
  return (
    <section id="quote" style={{ textAlign: 'center', padding: '88px 28px', position: 'relative', overflow: 'hidden' }}>
      <div className="reveal" style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        <O.Flourish width={320} className="in idle-sway" />
      </div>
      <div className="reveal" data-delay="1" style={{ color: 'var(--gold)', fontSize: 96, lineHeight: 1, fontFamily: 'var(--f-script)', padding: '0.1em 0' }}>
        “
      </div>
      <p className="reveal" data-delay="2" style={{
        fontFamily: 'var(--f-serif)', fontStyle: 'italic',
        fontSize: 24, lineHeight: 1.5, color: 'var(--cream)',
        margin: '20px auto', maxWidth: 320,
      }}>
        And out of all the souls in all the world,<br/>
        <span className="shimmer">I am most certain</span><br/>
        of yours.
      </p>
      <div className="reveal" data-delay="3" style={{ marginTop: 24 }}>
        <O.GrandDivider width={220} className="in" />
      </div>
      <div className="reveal meta" data-delay="3" style={{ marginTop: 14, letterSpacing: '0.3em' }}>
        — a vow, unspoken
      </div>
      <div className="reveal" data-delay="4" style={{ display: 'flex', justifyContent: 'center', marginTop: 22, transform: 'rotate(180deg)' }}>
        <O.Flourish width={320} className="in" />
      </div>
    </section>
  );
}

/* ---------- 11. Thank You / Closing ---------- */

function ThankYou() {
  return (
    <section id="thanks" style={{ textAlign: 'center', paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
      <div className="reveal" style={{ position: 'relative', display: 'inline-block', marginBottom: 22 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.55 }}>
          <O.WreathSpinner size={220} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <O.Crest size={130} initials="J&J" className="in idle-float" />
        </div>
      </div>
      <div className="meta reveal" data-delay="1">With love &amp; gratitude</div>
      <div className="script shimmer reveal" data-delay="2" style={{
        fontSize: 64, lineHeight: 1.2, marginTop: 12, padding: '0.1em 0 0.2em',
      }}>
        Thank You
      </div>
      <div className="body reveal" data-delay="3" style={{
        maxWidth: 300, margin: '20px auto', fontSize: 15,
      }}>
        Your presence — in person or in prayer — is the greatest gift we could ask for.
      </div>
      <div className="reveal" data-delay="4" style={{ display: 'flex', justifyContent: 'center', margin: '28px auto 0' }}>
        <O.Flourish width={280} className="in idle-sway" />
      </div>
      <div className="reveal" data-delay="5" style={{ marginTop: 18 }}>
        <div className="script" style={{ fontSize: 36, color: 'var(--gold)' }}>
          Jhon &amp; Jiny
        </div>
        <div className="meta" style={{ marginTop: 8 }}>30 · 05 · 2026</div>
      </div>

      <div className="reveal" data-delay="5" style={{
        marginTop: 48, paddingTop: 24,
        borderTop: '1px solid var(--line-soft)',
        fontFamily: 'var(--f-sans)', fontSize: 10, letterSpacing: '0.3em',
        color: 'rgba(242,227,213,0.4)', textTransform: 'uppercase',
      }}>
        Made with love · Los Angeles · 2026
      </div>
    </section>
  );
}

window.Sections = { Hero, Countdown, BrideGroom, Story, Events, Venue, Gallery, RSVP, Gift, Quote, ThankYou };
