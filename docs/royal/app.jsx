/* App root — two React trees:
   - SiteApp mounts into #site (the scrolling invitation)
   - ShellApp mounts into #envelope-root (envelope overlay + petal layer + slim tweaks) */

const { useState, useEffect, useRef } = React;
const S = window.Sections;
const O = window.Ornaments;

/* Ornament style locked to "deco". Animation intensity locked to 10. */
const ORNAMENT = "deco";
const INTENSITY = 10;

/* ---------- Site tree ---------- */
function SiteApp() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-draw');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <S.Hero />
      <S.Countdown />
      <S.BrideGroom />
      <S.Story />
      <S.Events />
      <S.Venue />
      <S.Gallery />
      <S.RSVP />
      <S.Gift />
      <S.Quote />
      <S.ThankYou />
    </>
  );
}

/* ---------- Shell: envelope + petals + slim tweaks ---------- */
function ShellApp() {
  const [opened, setOpened] = useState(false);
  const intensityRef = useRef(INTENSITY);

  useEffect(() => {
    const stop = window.startPetals(() => intensityRef.current);
    return stop;
  }, []);

  useEffect(() => {
    document.body.dataset.ornament = ORNAMENT;
    document.body.dataset.intensity = String(INTENSITY);
    document.documentElement.style.setProperty('--anim-mult', '1.6');
  }, []);

  return (
    <>
      {!opened && <Envelope onOpen={() => setOpened(true)} />}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Replay" />
        <TweakButton label="Replay envelope opening" onClick={() => {
          document.body.classList.add('locked');
          window.location.reload();
        }} />
        <div style={{
          fontSize: 11, color: 'rgba(255,255,255,0.55)',
          padding: '14px 14px 6px', lineHeight: 1.55,
        }}>
          Ornaments are locked to <strong style={{color:'#c9a961'}}>Art-Deco</strong> and animation intensity to <strong style={{color:'#c9a961'}}>10</strong>.
        </div>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('site')).render(<SiteApp />);
ReactDOM.createRoot(document.getElementById('envelope-root')).render(<ShellApp />);
