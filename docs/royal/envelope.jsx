/* Envelope cover — full-screen overlay that opens on tap to reveal the invitation. */

const { useState, useEffect } = React;

function Envelope({ onOpen, names = "Jhon & Jiny", date = "30.05.2026" }) {
  const [state, setState] = useState('idle'); // idle | opening | done
  const O = window.Ornaments;

  useEffect(() => {
    // little intro
    const t = setTimeout(() => {
      document.querySelectorAll('.env-reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('in'), i * 180);
      });
    }, 200);
    return () => clearTimeout(t);
  }, []);

  function open() {
    if (state !== 'idle') return;
    setState('opening');
    // Unlock the body early so #app-frame eases in BEHIND the overlay
    // while the flap is still finishing — they cross-fade instead of stepping.
    setTimeout(() => {
      document.body.classList.remove('locked');
    }, 900);
    // Then fade the overlay out completely
    setTimeout(() => {
      setState('done');
      onOpen && onOpen();
    }, 1900);
  }

  return (
    <>
      <style>{`
        .env-overlay {
          position: fixed; inset: 0; z-index: 100;
          background:
            radial-gradient(140% 80% at 50% 30%, #3a2240 0%, #1d1020 70%, #0a050c 100%);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          transition: opacity 1.6s cubic-bezier(.4,0,.2,1), transform 1.6s cubic-bezier(.2,.7,.2,1), background 1.6s ease;
          will-change: opacity, transform;
        }
        .env-overlay.opening {
          background:
            radial-gradient(140% 80% at 50% 30%, rgba(58,34,64,0) 0%, rgba(29,16,32,0) 70%, rgba(10,5,12,0) 100%);
        }
        .env-overlay.done {
          opacity: 0; pointer-events: none; transform: scale(1.03);
        }
        .env-frame {
          position: relative;
          width: min(360px, 88vw);
          aspect-ratio: 5/7;
          perspective: 1400px;
          display: flex; align-items: center; justify-content: center;
        }
        .env-glow {
          position: absolute; inset: -40px;
          background: radial-gradient(closest-side, rgba(201,169,97,0.25), transparent 70%);
          animation: glow-pulse 4s ease-in-out infinite;
          border-radius: 50%;
          pointer-events: none;
        }
        .env-body {
          position: relative;
          width: 100%; height: 100%;
          background: linear-gradient(155deg, #f2e3d5 0%, #e3d2bf 100%);
          box-shadow:
            0 30px 80px -20px rgba(0,0,0,0.6),
            0 0 0 1px rgba(201,169,97,0.4) inset;
          color: var(--ink);
          display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
          padding: 36px 28px 44px;
          transition: transform 1.2s cubic-bezier(.6,.1,.2,1) .7s, opacity .8s ease 1s;
          transform-style: preserve-3d;
          will-change: transform, opacity;
        }
        .env-flap {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 55%;
          background:
            linear-gradient(180deg, #efe0cf 0%, #d8c4ad 100%);
          clip-path: polygon(0 0, 100% 0, 50% 100%);
          transform-origin: top center;
          transform: rotateX(0deg);
          transition: transform 1.6s cubic-bezier(.6,.1,.2,1);
          z-index: 5;
          box-shadow: 0 2px 0 rgba(0,0,0,0.04) inset;
        }
        .env-flap::after {
          content: ""; position: absolute; inset: 0;
          background:
            radial-gradient(60% 80% at 50% 0%, rgba(201,169,97,0.18), transparent 60%);
        }
        .env-overlay.opening .env-flap {
          transform: rotateX(-180deg);
        }
        .env-overlay.opening .env-body {
          transform: translateY(-130%) rotateZ(-2deg);
          opacity: 0;
        }
        .env-seal {
          position: absolute;
          top: 22%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px; height: 60px;
          background: radial-gradient(circle at 30% 30%, var(--plum-soft), var(--plum) 60%, #3a1331 100%);
          border-radius: 50%;
          box-shadow:
            0 6px 18px rgba(0,0,0,0.4),
            inset 0 0 0 2px rgba(201,169,97,0.4),
            inset 0 -8px 18px rgba(0,0,0,0.4),
            inset 0 6px 12px rgba(255,255,255,0.08);
          z-index: 6;
          display: flex; align-items: center; justify-content: center;
          color: var(--gold);
          font-family: var(--f-script);
          font-size: 24px;
          transition: opacity .4s ease, transform .8s ease;
        }
        .env-seal::before {
          content: ""; position: absolute; inset: 6px;
          border: 1px dashed rgba(201,169,97,0.4);
          border-radius: 50%;
        }
        .env-overlay.opening .env-seal {
          opacity: 0; transform: translate(-50%, -50%) scale(0.6);
        }
        .env-inner-eyebrow {
          font-family: var(--f-sans);
          font-size: 9px; letter-spacing: 0.4em; text-transform: uppercase;
          color: var(--gold-soft);
        }
        .env-names {
          font-family: var(--f-script);
          font-size: 56px; color: var(--plum);
          line-height: 1.15; margin: 14px 0;
          text-align: center;
          padding: 0.05em 0;
        }
        .env-date {
          font-family: var(--f-serif);
          font-size: 11px; letter-spacing: 0.4em; text-transform: uppercase;
          color: var(--ink);
        }
        .env-cta {
          margin-top: 32px;
          display: inline-flex; align-items: center; gap: 10px;
          padding: 12px 22px;
          border: 1px solid var(--plum);
          color: var(--plum);
          font-family: var(--f-sans);
          font-size: 10px; letter-spacing: 0.32em; text-transform: uppercase;
          cursor: pointer;
          background: transparent;
          position: relative;
        }
        .env-cta::after {
          content: "";
          position: absolute; inset: -4px;
          border: 1px solid rgba(92,42,77,0.3);
          opacity: 0.6;
          animation: pulse-soft 2.4s ease-in-out infinite;
        }
        .env-tap-hint {
          margin-top: 18px;
          font-family: var(--f-script);
          font-size: 18px;
          color: var(--plum);
          opacity: 0.7;
          animation: float-soft 3s ease-in-out infinite;
        }
        .env-reveal { opacity: 0; transform: translateY(14px);
          transition: opacity 1s ease, transform 1s ease; }
        .env-reveal.in { opacity: 1; transform: translateY(0); }
        .env-corner {
          position: absolute; opacity: 0.65;
        }
        .env-corner.tl { top: 14px; left: 14px; }
        .env-corner.br { bottom: 14px; right: 14px; transform: rotate(180deg); }
      `}</style>

      <div className={`env-overlay ${state}`} onClick={open}>
        <div className="env-glow" />
        <div className="env-frame">
          <div className="env-body">
            <div className="env-corner tl"><O.Corner size={56} className="in" /></div>
            <div className="env-corner br"><O.Corner size={56} className="in" /></div>

            <div className="env-reveal" data-delay="1">
              <div className="env-inner-eyebrow">— You are cordially invited —</div>
            </div>

            <div className="env-reveal" data-delay="2" style={{ margin: '12px 0' }}>
              <O.Divider width={180} className="in" />
            </div>

            <div className="env-names env-reveal" data-delay="3">
              Jhon<br/>
              <span style={{ fontSize: 28, opacity: 0.7, fontFamily: 'var(--f-serif)', fontStyle: 'italic', display: 'inline-block', margin: '8px 0' }}>&amp;</span><br/>
              Jiny
            </div>

            <div className="env-reveal" data-delay="4" style={{ margin: '8px 0 4px' }}>
              <O.Divider width={140} className="in" />
            </div>

            <div className="env-date env-reveal" data-delay="4">{date}</div>

            <div className="env-tap-hint env-reveal" data-delay="5">tap to open</div>
          </div>

          <div className="env-flap" />
          <div className="env-seal">
            <span style={{ position: 'relative', zIndex: 2 }}>J&amp;J</span>
          </div>
        </div>
      </div>
    </>
  );
}

window.Envelope = Envelope;
