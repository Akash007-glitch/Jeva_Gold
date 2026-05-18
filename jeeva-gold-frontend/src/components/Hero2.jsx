import { useState, useEffect, useRef } from "react";

/*
  Hero2.jsx — Jeva Gold · Premium Hero Section (Enhanced)
  ─────────────────────────────────────────────────────────
  Palette : Ivory    #F8F6F0  (background)
            Forest   #1C3829  (primary, circle, CTA)
            Moss     #2E5540  (hover)
            Sage     #4E7A5A  (accents, steam)
            Mint     #A8C5A0  (labels, muted text)
            Gold     #C9A84C  (highlight accent)
  Fonts   : Playfair Display + DM Sans
*/

const STATS = [
  { n: "137+", l: "Years of craft" },
  { n: "12",   l: "Single estates" },
  { n: "3,200ft", l: "Elevation grown" },
  { n: "100%", l: "Whole leaf" },
];

const MARQUEE_ITEMS = [
  "Estate Grown", "Single Origin", "Award Winning",
  "Hand Picked", "Whole Leaf", "Assam Highlands",
  "Estate Grown", "Single Origin", "Award Winning",
  "Hand Picked", "Whole Leaf", "Assam Highlands",
];

/* ─── Lush Tea-Pot / Cup SVG ────────────────────────── */
function TeaPot() {
  return (
    <svg
      width="360"
      height="400"
      viewBox="0 0 380 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="bodyGrad" cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#EAE7DF" stopOpacity="1" />
        </radialGradient>
        <radialGradient id="lidGrad" cx="30%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#F8F6F0" />
          <stop offset="100%" stopColor="#DDD9CF" />
        </radialGradient>
        <radialGradient id="teaGrad" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#6BAD82" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#2E5540" stopOpacity="0.95" />
        </radialGradient>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="potBody">
          <ellipse cx="175" cy="260" rx="120" ry="130" />
        </clipPath>
      </defs>

      {/* ── Shadow ── */}
      <ellipse cx="190" cy="395" rx="130" ry="14" fill="#1C3829" opacity="0.12" />

      {/* ── Saucer ── */}
      <g style={{ animation: "bobSlow 7s ease-in-out infinite", transformOrigin: "190px 380px" }}>
        <ellipse cx="190" cy="372" rx="148" ry="22" fill="#EAE7E0" stroke="#C8D9C4" strokeWidth="1" />
        <ellipse cx="190" cy="367" rx="114" ry="14" fill="#F0EDE6" stroke="#C8D9C4" strokeWidth=".7" />
        <ellipse cx="190" cy="367" rx="114" ry="14" fill="none" stroke="#4E7A5A" strokeWidth=".4" strokeDasharray="5 12" opacity=".2" />
        {/* Saucer leaves */}
        {[[-66,0,-30],[56,4,18],[-36,-4,-50],[80,-5,40]].map(([x,ry,rot],i)=>(
          <ellipse key={i}
            cx={190+x} cy={368}
            rx={8-i*0.5} ry={2.2}
            transform={`rotate(${rot} ${190+x} 368)`}
            fill="#4E7A5A" opacity=".3"
          />
        ))}
        {/* Spoon */}
        <ellipse cx="116" cy="355" rx="11" ry="6.5" transform="rotate(-40 116 355)" fill="#F0EDE6" stroke="#C8D9C4" strokeWidth=".7" />
        <line x1="120" y1="350" x2="148" y2="330" stroke="#C8D9C4" strokeWidth="3" strokeLinecap="round" opacity=".7" />
      </g>

      {/* ── Steam ── */}
      <g style={{ transform: "translate(175px,60px)" }}>
        {[
          { d: "M-30,0 Q-50,-24 -28,-50 Q-6,-76 -24,-102", sw: 1.6, delay: 0 },
          { d: "M0,10 Q22,-20 8,-50 Q-6,-80 10,-108",       sw: 1.1, delay: 0.6 },
          { d: "M30,0 Q50,-24 30,-52 Q10,-80 26,-106",       sw: 1.6, delay: 1.2 },
        ].map((s, i) => (
          <path
            key={i}
            d={s.d}
            stroke="#4E7A5A"
            strokeWidth={s.sw}
            strokeLinecap="round"
            fill="none"
            style={{
              strokeDasharray: 65,
              strokeDashoffset: 65,
              animation: `steamRise 3.2s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </g>

      {/* ── Lid ── */}
      <g style={{ animation: "lidTilt 4s ease-in-out infinite", transformOrigin: "175px 138px" }}>
        <ellipse cx="175" cy="145" rx="80" ry="14" fill="url(#lidGrad)" stroke="#C8D9C4" strokeWidth="1" />
        <ellipse cx="175" cy="138" rx="70" ry="11" fill="#F4F1EA" stroke="#C8D9C4" strokeWidth=".8" />
        {/* Lid knob */}
        <ellipse cx="175" cy="130" rx="14" ry="9" fill="url(#lidGrad)" stroke="#C8D9C4" strokeWidth="1" />
        <ellipse cx="175" cy="122" rx="7" ry="4" fill="#EAE7DF" stroke="#C8D9C4" strokeWidth=".8" />
        {/* Lid highlight */}
        <ellipse cx="158" cy="136" rx="18" ry="5" fill="white" opacity=".4" transform="rotate(-12 158 136)" />
      </g>

      {/* ── Pot body ── */}
      <g style={{ animation: "bobSlow 7s ease-in-out infinite", transformOrigin: "175px 270px" }}>
        <ellipse cx="175" cy="264" rx="128" ry="132" fill="url(#bodyGrad)" stroke="#C8D9C4" strokeWidth="1.2" />

        {/* Tea fill */}
        <ellipse cx="175" cy="155" rx="114" ry="14" fill="#c8dfc9" opacity=".5" />
        <g clipPath="url(#potBody)">
          <rect
            x="47" y="200" width="256" height="200"
            fill="url(#teaGrad)"
            opacity=".22"
            style={{ animation: "teaFill 2.6s ease .4s both" }}
          />
        </g>

        {/* Body highlight */}
        <path d="M84,168 Q74,240 82,302" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity=".55" />
        {/* Subtle rim shadow */}
        <ellipse cx="175" cy="155" rx="114" ry="13" fill="none" stroke="#7A9982" strokeWidth="1" opacity=".25" />

        {/* Botanical motif */}
        <g transform="translate(175,265)" opacity=".22">
          <circle r="30" fill="none" stroke="#4E7A5A" strokeWidth=".6" />
          <circle r="18" fill="none" stroke="#4E7A5A" strokeWidth=".4" strokeDasharray="3 6" />
          <line x1="-18" y1="0" x2="18" y2="0" stroke="#4E7A5A" strokeWidth=".5" />
          <line x1="0" y1="-18" x2="0" y2="18" stroke="#4E7A5A" strokeWidth=".5" />
          <path d="M-7,-10 Q-14,-20 -7,-28 Q0,-18 -7,-10" fill="none" stroke="#4E7A5A" strokeWidth=".7" />
          <path d="M7,-10 Q14,-20 7,-28 Q0,-18 7,-10" fill="none" stroke="#4E7A5A" strokeWidth=".7" />
          <circle r="4.5" fill="#4E7A5A" opacity=".4" />
        </g>

        {/* Spout */}
        <path d="M303,196 Q348,170 354,200 Q360,225 310,236" fill="none" stroke="#C8D9C4" strokeWidth="18" strokeLinecap="round" />
        <path d="M303,196 Q348,170 354,200 Q360,225 310,236" fill="none" stroke="url(#bodyGrad)" strokeWidth="13" strokeLinecap="round" />
        <path d="M303,200 Q342,176 347,202 Q352,222 307,232" fill="none" stroke="#E0DDD6" strokeWidth="1" opacity=".5" strokeLinecap="round" />

        {/* Handle */}
        <path d="M47,196 Q-10,180 -14,240 Q-18,295 47,278" fill="none" stroke="#C8D9C4" strokeWidth="18" strokeLinecap="round" />
        <path d="M47,196 Q-10,180 -14,240 Q-18,295 47,278" fill="none" stroke="url(#bodyGrad)" strokeWidth="13" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ─── Floating Leaf ───────────────────────────────────── */
function Leaf({ size = "md", delay = 0, style = {}, gold = false }) {
  const dims = { sm: [14, 24], md: [20, 34], lg: [28, 48] };
  const [w, h] = dims[size];
  const cx = w / 2, cy = h / 2;
  const color = gold ? "#C9A84C" : size === "lg" ? "#A8C5A0" : "#4E7A5A";
  const opacity = gold ? ".55" : size === "lg" ? ".45" : ".35";
  return (
    <div style={{
      position: "absolute", pointerEvents: "none",
      animation: `leafFloat ${5 + delay * 0.3}s ease-in-out ${delay}s infinite`,
      ...style,
    }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
        <path
          d={`M${cx} 2C${cx} 2 ${w-2} ${Math.round(h*.28)} ${w-2} ${Math.round(h*.56)}C${w-2} ${h-4} ${Math.round(cx+4)} ${h-2} ${cx} ${h-2}C${cx-4} ${h-2} 2 ${h-4} 2 ${Math.round(h*.56)}C2 ${Math.round(h*.28)} ${cx} 2 ${cx} 2Z`}
          fill={color} opacity={opacity}
        />
        {size !== "sm" && (
          <line x1={cx} y1="5" x2={cx} y2={h-4}
            stroke={gold ? "#B8923C" : size === "lg" ? "#4E7A5A" : "#2E5540"}
            strokeWidth=".7" opacity=".5"
          />
        )}
      </svg>
    </div>
  );
}

/* ─── Particle Dot ────────────────────────────────────── */
function Particle({ x, y, delay, size }) {
  return (
    <div style={{
      position: "absolute",
      left: x, top: y,
      width: size, height: size,
      borderRadius: "50%",
      background: "#4E7A5A",
      pointerEvents: "none",
      animation: `particleFloat ${6 + delay}s ease-in-out ${delay}s infinite`,
    }} />
  );
}

/* ─── Main Component ──────────────────────────────────── */
export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    const onMove = (e) => {
      if (!heroRef.current) return;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - left) / width  - 0.5) * 18,
        y: ((e.clientY - top)  / height - 0.5) * 18,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => { clearTimeout(t); window.removeEventListener("mousemove", onMove); };
  }, []);

  const reveal = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(28px)",
    transition: `opacity .9s ease ${delay}s, transform .9s cubic-bezier(.16,1,.3,1) ${delay}s`,
  });

  const PARTICLES = [
    { x:"18%", y:"22%", delay:0,   size:4 },
    { x:"82%", y:"15%", delay:1.5, size:3 },
    { x:"68%", y:"72%", delay:2.8, size:5 },
    { x:"12%", y:"68%", delay:0.9, size:3 },
    { x:"45%", y:"88%", delay:3.5, size:4 },
    { x:"92%", y:"45%", delay:1.1, size:3 },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes steamRise {
          0%   { stroke-dashoffset:65; opacity:0; }
          15%  { opacity:.75; }
          75%  { opacity:.2; }
          100% { stroke-dashoffset:-65; opacity:0; }
        }
        @keyframes teaFill {
          from { transform: scaleY(0); transform-origin: bottom; }
          to   { transform: scaleY(1); transform-origin: bottom; }
        }
        @keyframes bobSlow {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%     { transform: translateY(-6px) rotate(.25deg); }
        }
        @keyframes lidTilt {
          0%,100% { transform: rotate(0deg); }
          40%     { transform: rotate(-1.2deg) translateY(-2px); }
          70%     { transform: rotate(.6deg); }
        }
        @keyframes leafFloat {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%     { transform: translateY(-16px) rotate(10deg); }
        }
        @keyframes particleFloat {
          0%,100% { transform: translateY(0) scale(1);   opacity:.3; }
          50%     { transform: translateY(-18px) scale(1.4); opacity:.12; }
        }
        @keyframes scrollPulse {
          0%,100% { opacity:.2; transform:scaleY(.8); }
          50%     { opacity:1;  transform:scaleY(1); }
        }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes rotateRing {
          from { transform: translateY(-50%) rotate(0deg); }
          to   { transform: translateY(-50%) rotate(360deg); }
        }
        @keyframes fadeInScale {
          from { opacity:0; transform:scale(.92); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes goldShine {
          0%,100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); }
          50%     { box-shadow: 0 0 20px 4px rgba(201,168,76,.25); }
        }

        .hero-btn-main {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 3px; text-transform: uppercase;
          color: #F8F6F0; background: #1C3829;
          border: none; padding: 16px 40px;
          border-radius: 100px; cursor: pointer;
          position: relative; overflow: hidden;
          transition: background .35s, transform .25s, box-shadow .35s;
        }
        .hero-btn-main::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.18) 50%, transparent 100%);
          transform: translateX(-100%);
          transition: transform .5s ease;
        }
        .hero-btn-main:hover { background:#2E5540; transform:translateY(-2px); box-shadow:0 8px 24px rgba(28,56,41,.28); }
        .hero-btn-main:hover::after { transform: translateX(200%); }

        .hero-btn-ghost {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 400;
          letter-spacing: 3px; text-transform: uppercase;
          color: #4E7A5A; background: transparent;
          border: 1.5px solid rgba(78,122,90,.35);
          padding: 15px 32px; border-radius: 100px; cursor: pointer;
          transition: all .35s;
          display: flex; align-items: center; gap: 10px;
        }
        .hero-btn-ghost:hover {
          border-color:#1C3829; color:#1C3829;
          background:rgba(28,56,41,.04); transform:translateY(-2px);
        }
        .hero-btn-ghost .arrow {
          display:inline-block;
          transition: transform .3s;
        }
        .hero-btn-ghost:hover .arrow { transform: translateX(4px); }

        .badge-trust {
          display:inline-flex; align-items:center; gap:7px;
          padding: 7px 14px; border-radius:100px;
          background:rgba(78,122,90,.08);
          border:1px solid rgba(78,122,90,.18);
          font-family:'DM Sans',sans-serif;
          font-size:10px; font-weight:400;
          letter-spacing:2.5px; text-transform:uppercase;
          color:#4E7A5A;
          transition: all .3s;
        }
        .badge-trust:hover { background:rgba(78,122,90,.15); }

        .stat-card:hover .stat-number {
          color: #4E7A5A;
          transition: color .3s;
        }

        @media (max-width:900px) {
          .hero-grid   { grid-template-columns:1fr !important; }
          .hero-right  { display:none !important; }
          .hero-left   { padding:140px 32px 160px !important; }
          .stats-bar   { left:32px !important; flex-wrap:wrap; gap:20px; }
          .stat-item   { border-right:none !important; padding-right:0 !important; margin-right:0 !important; }
          .scroll-hint { display:none !important; }
          .marquee-band{ font-size:9px !important; }
        }
      `}</style>

      {/* ── Marquee strip ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "#1C3829", height: "34px",
        display: "flex", alignItems: "center", overflow: "hidden",
        ...reveal(0),
      }}>
        <div style={{
          display: "flex", gap: 0, whiteSpace: "nowrap",
          animation: "marqueeScroll 24s linear infinite",
          willChange: "transform",
        }}>
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 10, fontWeight: 400,
              letterSpacing: "4px", textTransform: "uppercase",
              color: "#A8C5A0", padding: "0 28px",
              display: "flex", alignItems: "center", gap: 28,
            }}>
              {item}
              <span style={{ color: "#C9A84C", fontSize: 14, lineHeight: 0 }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO WRAPPER ── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          background: "#F8F6F0",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          fontFamily: "'DM Sans', sans-serif",
          paddingTop: "34px", // marquee height
        }}
      >
        {/* ── Textured background ── */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(26,56,41,.048) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }} />

        {/* ── Warm gradient wash ── */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 70% at 15% 50%, rgba(201,168,76,.065) 0%, transparent 70%)",
        }} />

        {/* ── Decorative thin line ── */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: "1px",
          background: "linear-gradient(to bottom, transparent 0%, rgba(78,122,90,.2) 30%, rgba(78,122,90,.2) 70%, transparent 100%)",
          marginLeft: "42px",
          pointerEvents: "none",
        }} />

        {/* ── Main green circle — parallax ── */}
        <div style={{
          position: "absolute", borderRadius: "50%", pointerEvents: "none",
          left: "50%", top: "50%",
          width: "800px", height: "800px",
          background: "radial-gradient(circle at 35% 35%, #2E5540 0%, #1C3829 65%)",
          transform: `translate(-10%, -50%) translate(${mouse.x * 0.18}px, ${mouse.y * 0.18}px)`,
          transition: "transform .8s cubic-bezier(.23,1,.32,1)",
          boxShadow: "inset 0 0 80px rgba(0,0,0,.15), -30px 0 100px rgba(28,56,41,.18)",
        }} />

        {/* ── Glowing inner circle ── */}
        <div style={{
          position: "absolute", borderRadius: "50%", pointerEvents: "none",
          left: "50%", top: "50%",
          width: "480px", height: "480px",
          background: "radial-gradient(circle, rgba(78,122,90,.35) 0%, rgba(46,85,64,.6) 100%)",
          transform: `translate(30%, -50%) translate(${mouse.x * 0.28}px, ${mouse.y * 0.28}px)`,
          transition: "transform .8s cubic-bezier(.23,1,.32,1)",
        }} />

        {/* ── Rotating dashed ring ── */}
        <div style={{
          position: "absolute", borderRadius: "50%", pointerEvents: "none",
          left: "50%", top: "50%",
          width: "900px", height: "900px",
          border: "1px dashed rgba(78,122,90,.12)",
          animation: "rotateRing 60s linear infinite",
          marginLeft: "-10px",
        }} />
        {/* ── Orbit rings ── */}
        {[920, 1060].map((s, i) => (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%", pointerEvents: "none",
            left: "50%", top: "50%",
            width: s, height: s,
            transform: `translate(-10%, -50%)`,
            border: `1px solid rgba(26,56,41,${i === 0 ? ".065" : ".035"})`,
          }} />
        ))}

        {/* ── Floating particles ── */}
        {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

        {/* ── Floating leaves ── */}
        <Leaf size="lg"  delay={0}   style={{ top: "14%",  right: "46%" }} />
        <Leaf size="md"  delay={1.4} style={{ bottom:"14%", left: "52%" }} />
        <Leaf size="sm"  delay={2.6} style={{ top: "58%",  right: "44%" }} gold />
        <Leaf size="lg"  delay={3.1} style={{ top: "10%",  right: "38%" }} gold />
        <Leaf size="sm"  delay={0.7} style={{ bottom:"22%", right:"54%" }} />

        {/* ═══════ CONTENT GRID ═══════ */}
        <div
          className="hero-grid"
          style={{
            position: "relative", zIndex: 10, width: "100%",
            display: "grid", gridTemplateColumns: "1fr 1fr",
            alignItems: "center",
            padding: "80px 88px 120px 88px",
            gap: "40px",
          }}
        >
          {/* ─────── LEFT PANEL ─────── */}
          <div className="hero-left" style={{ display: "flex", flexDirection: "column" }}>

            {/* Trust badges */}
            <div style={{ display: "flex", flexWrap:"wrap", gap: 10, marginBottom: 32, ...reveal(0.2) }}>
              <span className="badge-trust">
                <span style={{ width:5, height:5, borderRadius:"50%", background:"#C9A84C", flexShrink:0 }} />
                Estate Grown
              </span>
              <span className="badge-trust">
                <span style={{ width:5, height:5, borderRadius:"50%", background:"#4E7A5A", flexShrink:0 }} />
                Assam Highlands
              </span>
              <span className="badge-trust">
                <span style={{ width:5, height:5, borderRadius:"50%", background:"#4E7A5A", flexShrink:0 }} />
                Since 1887
              </span>
            </div>

            {/* Eyebrow line */}
            <div style={{
              display: "flex", alignItems: "center", gap: 14,
              fontSize: 10, fontWeight: 300, letterSpacing: "5px",
              textTransform: "uppercase", color: "#4E7A5A",
              marginBottom: 22, ...reveal(0.3),
            }}>
              <div style={{ width: 36, height: 1, background: "linear-gradient(to right, #4E7A5A, transparent)" }} />
              Single Origin · Whole Leaf
            </div>

            {/* Headline */}
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(50px,5.2vw,88px)",
              fontWeight: 300,
              lineHeight: 0.93,
              letterSpacing: "-2.5px",
              color: "#1C3829",
              marginBottom: 36,
              ...reveal(0.42),
            }}>
              Grown in<br />
              <em style={{ fontStyle: "italic", color: "#4E7A5A" }}>silence,</em><br />
              <span style={{ position:"relative", display:"inline-block" }}>
                poured
                <span style={{
                  position: "absolute", bottom: 3, left: 0, right: 0, height: 3,
                  background: "linear-gradient(to right, #C9A84C, rgba(201,168,76,0))",
                  borderRadius: 2,
                }} />
              </span>
              {" "}slow.
            </h1>

            {/* Description */}
            <p style={{
              fontSize: 15, fontWeight: 300, lineHeight: 1.9,
              color: "#7A9982", maxWidth: 380, marginBottom: 44,
              ...reveal(0.56),
            }}>
              From mist&#8209;wrapped hills at 3,200 feet, our single&#8209;origin teas
              carry the patience of three generations —{" "}
              <em style={{ fontStyle:"italic", color:"#4E7A5A" }}>harvested at dawn,</em>{" "}
              never blended, always whole leaf.
            </p>

            {/* CTA Row */}
            <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap:"wrap", marginBottom: 52, ...reveal(0.7) }}>
              <button className="hero-btn-main">
                Shop the Harvest
              </button>
              <button className="hero-btn-ghost">
                Our Origin <span className="arrow">→</span>
              </button>
            </div>

            {/* Divider */}
            <div style={{ width: "100%", height: 1, background: "rgba(26,56,41,.08)", marginBottom: 28, ...reveal(0.8) }} />

            {/* Stars + social proof */}
            <div style={{
              display: "flex", alignItems: "center", gap: 16,
              ...reveal(0.88),
            }}>
              <div style={{ display:"flex", gap:3 }}>
                {[...Array(5)].map((_,i)=>(
                  <span key={i} style={{ color:"#C9A84C", fontSize:16 }}>★</span>
                ))}
              </div>
              <span style={{ fontSize:13, fontWeight:300, color:"#7A9982" }}>
                <strong style={{ color:"#1C3829", fontWeight:500 }}>4.9</strong> from 2,300+ reviews
              </span>
              <span style={{ width:1, height:16, background:"rgba(26,56,41,.15)" }} />
              <span style={{ fontSize:11, fontWeight:300, letterSpacing:"2px", textTransform:"uppercase", color:"#A8C5A0" }}>
                Free shipping · £40+
              </span>
            </div>
          </div>

          {/* ─────── RIGHT PANEL ─────── */}
          <div
            className="hero-right"
            style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 520 }}
          >
            {/* Year watermark */}
            <div style={{ position: "absolute", top: 0, right: 0, textAlign:"right", ...reveal(0.38) }}>
              <div style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 64, fontWeight: 300,
                color: "rgba(168,197,160,.2)", lineHeight: 1, letterSpacing: "-4px",
              }}>1887</div>
              <div style={{ fontSize: 9, fontWeight: 300, letterSpacing: "5px", textTransform: "uppercase", color: "#A8C5A0" }}>Assam · India</div>
            </div>

            {/* Vertical label */}
            <div style={{
              position: "absolute", left: -8, top: "50%",
              transform: "rotate(-90deg) translateX(-50%)",
              fontSize: 8, fontWeight: 300, letterSpacing: "6px",
              textTransform: "uppercase", color: "#A8C5A0",
              whiteSpace: "nowrap",
              ...reveal(0.5),
            }}>
              Single Estate Collection — No. 12
            </div>

            {/* Tea pot with parallax */}
            <div style={{
              position: "relative", zIndex: 5,
              transform: `translate(${mouse.x * 0.42}px, ${mouse.y * 0.42}px)`,
              transition: "transform .8s cubic-bezier(.23,1,.32,1)",
              animation: "fadeInScale .9s cubic-bezier(.16,1,.3,1) .55s both",
              filter: "drop-shadow(0 30px 50px rgba(28,56,41,.2))",
            }}>
              <TeaPot />
            </div>

            {/* Floating card — estate detail */}
            <div style={{
              position: "absolute", bottom: "12%", right: "-20px",
              background: "#FFFFFF",
              borderRadius: 16,
              padding: "16px 20px",
              boxShadow: "0 12px 40px rgba(28,56,41,.14)",
              border: "1px solid rgba(200,217,196,.5)",
              minWidth: 152,
              animation: "goldShine 4s ease-in-out infinite",
              ...reveal(0.85),
            }}>
              <div style={{ fontSize:9, letterSpacing:"3px", textTransform:"uppercase", color:"#A8C5A0", marginBottom:6 }}>Harvest score</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:300, color:"#1C3829", lineHeight:1 }}>
                96<span style={{ fontSize:14, color:"#C9A84C" }}>/100</span>
              </div>
              <div style={{ fontSize:10, color:"#7A9982", marginTop:5, fontWeight:300 }}>Specialty Tea Institute</div>
            </div>

            {/* Floating card — altitude */}
            <div style={{
              position: "absolute", top: "20%", left: "0%",
              background: "rgba(28,56,41,.92)",
              backdropFilter: "blur(10px)",
              borderRadius: 12,
              padding: "12px 18px",
              boxShadow: "0 8px 24px rgba(0,0,0,.2)",
              ...reveal(0.78),
            }}>
              <div style={{ fontSize:9, letterSpacing:"3px", textTransform:"uppercase", color:"rgba(168,197,160,.7)", marginBottom:4 }}>Altitude</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:300, color:"#F8F6F0", lineHeight:1 }}>
                3,200 <span style={{ fontSize:11, color:"#A8C5A0", fontFamily:"'DM Sans',sans-serif" }}>ft</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ STATS BAR ═══════ */}
        <div
          className="stats-bar"
          style={{
            position: "absolute", left: 88, bottom: 42, zIndex: 20,
            display: "flex", alignItems: "center",
            ...reveal(0.95),
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.l}
              className="stat-card"
              style={{
                display: "flex", flexDirection: "column", gap: 5,
                paddingRight: i < STATS.length - 1 ? 36 : 0,
                marginRight: i < STATS.length - 1 ? 36 : 0,
                borderRight: i < STATS.length - 1 ? "1px solid rgba(26,56,41,.1)" : "none",
                cursor: "default",
              }}
            >
              <span
                className="stat-number"
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 24, fontWeight: 300,
                  color: "#1C3829", lineHeight: 1, letterSpacing: "-1px",
                  transition: "color .3s",
                }}
              >{s.n}</span>
              <span style={{
                fontSize: 9, fontWeight: 300, letterSpacing: "3.5px",
                textTransform: "uppercase", color: "#A8C5A0",
              }}>{s.l}</span>
            </div>
          ))}
        </div>

        {/* ═══════ SCROLL HINT ═══════ */}
        <div
          className="scroll-hint"
          style={{
            position: "absolute", right: 88, bottom: 42, zIndex: 20,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            ...reveal(1.05),
          }}
        >
          <span style={{
            fontSize: 8, fontWeight: 300, letterSpacing: "5px",
            textTransform: "uppercase", color: "#A8C5A0", writingMode: "vertical-rl",
          }}>Scroll</span>
          <div style={{
            width: 1, height: 50,
            background: "linear-gradient(to bottom, rgba(78,122,90,.4), transparent)",
            animation: "scrollPulse 2.2s ease-in-out infinite",
          }} />
        </div>

      </section>
    </>
  );
}