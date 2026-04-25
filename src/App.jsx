import { useState, useEffect, useRef, useLayoutEffect } from "react";
import ColorBends from "./components/ColorBends";
import CardSwap, { Card } from "./components/CardSwap";
import { gsap } from "gsap";
import PixelTransition from "./components/PixelTransition";
import ProfileCard from "./components/ProfileCard";
import Navbar from "./components/Navbar";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll";

gsap.registerPlugin(ScrollTrigger);

// ─── Animated Section Wrapper (GSAP) ───────────────────────────────────────
function Reveal({ children, delay = 0, className = "", style = {} }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;

    const anim = gsap.fromTo(
      el,
      { opacity: 0, y: 30, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: delay ? delay / 1000 : 0,
        ease: "power2.out",
        force3D: true, // Hardware acceleration
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
          end: "bottom 5%",
          toggleActions: "play reverse play reverse",
        },
      },
    );

    return () => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: "transform, opacity", ...style }}
    >
      {children}
    </div>
  );
}

// ─── Loader ────────────────────────────────────────────────────────────────
function Loader({ onDone }) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress bar animation
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 40);

    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(() => onDone(), 3100);
    return () => { [t1, t2, t3].forEach(clearTimeout); clearInterval(interval); };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#060608",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        opacity: phase === 2 ? 0 : 1,
        transition: "opacity 0.65s cubic-bezier(.22,1,.36,1)",
        pointerEvents: phase === 2 ? "none" : "all",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes fadeUpIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bgPulse {
          0%, 100% { opacity: 0.08; }
          50%       { opacity: 0.14; }
        }
      `}</style>

      {/* Background radial glow */}
      <div style={{
        position: "absolute",
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)",
        animation: "bgPulse 3s ease-in-out infinite",
        pointerEvents: "none",
      }} />



      {/* Text block */}
      <div style={{ textAlign: "center", animation: "fadeUpIn 0.7s ease 0.2s both" }}>
        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.3em",
          color: "#4a4a6a",
          textTransform: "uppercase",
          margin: "0 0 14px",
        }}>
          Introducing
        </p>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(52px, 10vw, 96px)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          margin: "0 0 32px",
          background: "linear-gradient(135deg, #fff 40%, #6c63ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
        }}>
          BOS
        </h1>

        {/* Progress bar */}
        <div style={{
          width: 200,
          height: 1,
          background: "rgba(108,99,255,0.15)",
          borderRadius: 999,
          overflow: "hidden",
          margin: "0 auto 12px",
        }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #6c63ff, #a78bfa)",
            borderRadius: 999,
            transition: "width 0.04s linear",
            boxShadow: "0 0 8px rgba(108,99,255,0.6)",
          }} />
        </div>
        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.2em",
          color: "#2e2e48",
          textTransform: "uppercase",
          margin: 0,
        }}>
          Initializing System...
        </p>
      </div>
    </div>
  );
}



// ─── Hero ──────────────────────────────────────────────────────────────────
function Hero({ loaded }) {
  const textRef = useRef(null);

  useLayoutEffect(() => {
    if (loaded && textRef.current) {
      const elements = textRef.current.children;
      gsap.fromTo(
        elements,
        { y: 80, opacity: 0, rotationX: -30 },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 1.4,
          stagger: 0.2,
          ease: "power3.out",
          delay: 0.4,
        },
      );
    }
  }, [loaded]);

  return (
    <section
      className="stack-section hero-section"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "120px 24px 80px",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <div style={{ position: "relative", zIndex: 1, perspective: "1000px" }}>
        <h1
          ref={textRef}
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(42px, 7vw, 88px)",
            fontWeight: 800,
            lineHeight: 1.05,
            color: "#fff",
            margin: "0 0 24px",
            maxWidth: 860,
          }}
        >
          <div style={{ opacity: loaded ? 1 : 0 }}>
            Your business isn't broken.{" "}
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #4facfe, #00f2fe)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
              opacity: loaded ? 1 : 0,
            }}
          >
            Your tools are.
          </div>
        </h1>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Reveal delay={440}>
          <a
            href="#challenge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              textDecoration: "none",
              transition: "opacity 0.2s",
              opacity: 0.7,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.7";
            }}
          >
            <svg
              width="52"
              height="52"
              viewBox="0 0 24 24"
              fill="none"
              className="animate-bounce"
            >
              <path
                d="M12 4v16m0 0l-6-6m6 6l6-6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

// ─── The Challenge ─────────────────────────────────────────────────────────
const tools = [
  {
    category: "Communication",
    name: "Slack",
    color: "#611f69",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.527 2.527 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.958 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.527 2.527 0 0 1-2.52 2.522h-2.522V8.834zM17.687 8.834a2.527 2.527 0 0 1-2.521 2.522 2.527 2.527 0 0 1-2.521-2.522V2.521A2.528 2.528 0 0 1 15.166 0a2.528 2.528 0 0 1 2.521 2.521v6.313zM15.166 18.958a2.528 2.528 0 0 1 2.521 2.522A2.528 2.528 0 0 1 15.166 24a2.527 2.527 0 0 1-2.52-2.52v-2.522h2.52zM15.166 17.687a2.527 2.527 0 0 1-2.52-2.521 2.527 2.527 0 0 1 2.52-2.521h6.313A2.528 2.528 0 0 1 24 15.166a2.528 2.528 0 0 1-2.521 2.521h-6.313z" />
      </svg>
    ),
    pain: "Conversations happen here… but decisions get lost.",
  },
  {
    category: "Files",
    name: "Google Drive",
    color: "#1a73e8",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M8.84 0L0 15.34l3.66 6.29 8.84-15.34L8.84 0z"
          fill="currentColor"
          opacity="0.8"
        />
        <path
          d="M15.16 0H8.84l7.32 12.63 3.66-6.34L15.16 0z"
          fill="currentColor"
        />
        <path
          d="M24 15.34l-3.66 6.29H3.66l1.16-2 7.32-12.63h5.34L24 15.34z"
          fill="currentColor"
          opacity="0.6"
        />
      </svg>
    ),
    pain: "Files exist… but no context around them.",
  },
  {
    category: "Customers",
    name: "CRM",
    color: "#00a1e0",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C9.5 2 7.4 3.6 6.6 5.8 4 6.4 2 8.7 2 11.5c0 3 2.5 5.5 5.5 5.5h9c3 0 5.5-2.5 5.5-5.5 0-2.8-2-5.1-4.6-5.7C16.6 3.6 14.5 2 12 2z" />
      </svg>
    ),
    pain: "Data is stored… but not connected to actual work.",
  },
  {
    category: "Projects",
    name: "JIRA",
    color: "#0052cc",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.571 11.143l-4.571 4.571 4.571 4.572h4.571l-4.571-4.572 4.571-4.571h-4.571zm7.429-7.429l-4.571 4.571 4.571 4.572h4.571l-4.571-4.572 4.571-4.571h-4.571zm-14.857 14.857l-4.571 4.571h4.571l4.572-4.571-4.572-4.572-4.571 4.572z" />
      </svg>
    ),
    pain: "Tasks are tracked… but not aligned with reality.",
  },
  {
    category: "Follow-ups",
    name: "Email",
    color: "#ea4335",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    pain: "Important updates disappear in threads.",
  },
  {
    category: "Intelligence",
    name: "AI Tools",
    color: "#10a37f",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
        <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
      </svg>
    ),
    pain: "Insights exist… but aren't integrated into workflows.",
  },
];
// ─── Responsive hook — add this near the top of your file ─────────────────
function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [breakpoint]);
  return isMobile;
}

// ─── Challenge ─────────────────────────────────────────────────────────────
function Challenge() {
  const isMobile = useIsMobile();

  return (
    <section
      id="challenge"
      className="stack-section"
      style={{
        padding: "120px 24px",
        position: "relative",
        overflow: "hidden",
        background: "rgba(6,6,8,0.82)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(108,99,255,0.08)",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            // ✅ 1 column on mobile, 2 columns on desktop
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 40 : 60,
            marginBottom: isMobile ? 60 : 100,
          }}
        >
          {/* ── LEFT: Heading ── */}
          <div style={{ paddingTop: 40 }}>
            <Reveal>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(32px, 5vw, 64px)",
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                  margin: "0 0 20px",
                  lineHeight: 1.1,
                  maxWidth: 800,
                }}
              >
                Your business isn't running on a system.
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  It's running on scattered tools.
                </span>
              </h2>
            </Reveal>
          </div>

          {/* ── RIGHT (or BELOW on mobile): CardSwap (HIDDEN ON MOBILE) ── */}
          {!isMobile && (
            <div>
              <Reveal delay={200}>
                <div
                  style={{
                    position: "relative",
                    height: 520,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: "translate(-30%, -39%)",
                  }}
                >
                  <CardSwap
                    width={380}
                    height={260}
                    cardDistance={50}
                    verticalDistance={20}
                    delay={3000}
                    pauseOnHover={true}
                    skewAmount={4}
                    easing="elastic"
                  >
                    {tools.map((tool) => (
                      <Card key={tool.name} style={{ padding: 0, overflow: "hidden" }}>
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background: `linear-gradient(135deg, ${tool.color}18 0%, #0d0d18 100%)`,
                            borderRadius: 20,
                            border: `1px solid ${tool.color}30`,
                            display: "flex",
                            flexDirection: "column",
                            padding: "36px 32px",
                            boxSizing: "border-box",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <p
                              style={{
                                fontFamily: "'Space Mono', monospace",
                                fontSize: 10,
                                color: tool.color,
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                marginBottom: 20,
                              }}
                            >
                              {tool.category}
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                              <div
                                style={{
                                  width: 44, height: 44, borderRadius: 12,
                                  background: tool.color + "22",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  flexShrink: 0, color: tool.color,
                                  border: `1px solid ${tool.color}44`,
                                }}
                              >
                                {tool.icon}
                              </div>
                              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: "#fff", margin: 0 }}>
                                {tool.name}
                              </p>
                            </div>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#8a8aaa", margin: 0, lineHeight: 1.6 }}>
                              {tool.pain}
                            </p>
                          </div>
                          <div style={{ marginTop: 16, height: 2, borderRadius: 2, background: `linear-gradient(90deg, ${tool.color}66, transparent)` }} />
                        </div>
                      </Card>
                    ))}
                  </CardSwap>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── The Shift ─────────────────────────────────────────────────────────────
const shifts = [
  {
    old: "Work is scattered across multiple tools",
    next: "All work runs inside one unified system",
  },
  {
    old: "You chase updates across teams",
    next: "The system tracks everything in real-time",
  },
  {
    old: "Follow-ups are manual and inconsistent",
    next: "Execution happens automatically",
  },
  {
    old: "Context is lost in chats and threads",
    next: "Every action has full context",
  },
  {
    old: "AI is just another tool to use",
    next: "AI runs as the operating layer",
  },
  {
    old: "Work depends on coordination",
    next: "Work executes itself through the system",
  },
];

// ─── Shift ─────────────────────────────────────────────────────────────────
function Shift() {
  const isMobile = useIsMobile();

  return (
    <section
      className="stack-section"
      style={{
        padding: "120px 24px",
        position: "relative",
        overflow: "hidden",
        background: "rgba(6,6,8,0.82)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(108,99,255,0.08)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <Reveal>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.03em",
              margin: "0 0 64px",
            }}
          >
            Old Workflow is Broken.<br /> Here's What Replaces It.
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
          {shifts.map((s, i) => (
            <Reveal key={i} delay={i * 60}>
              <PixelTransition
                firstContent={
                  <div
                    style={{
                      width: "100%", height: "100%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "#0d0d15",
                      border: "1px solid #1e1e2e",
                      borderRadius: 12, padding: "24px", boxSizing: "border-box",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: isMobile ? 18 : 24,
                        background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        margin: 0, fontWeight: 500, textAlign: "center",
                      }}
                    >
                      {s.old}
                    </p>
                  </div>
                }
                secondContent={
                  <div
                    style={{
                      width: "100%", height: "100%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "#0d0d15",
                      border: "1px solid rgba(108,99,255,0.3)",
                      borderRadius: 12, padding: "24px", boxSizing: "border-box",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: isMobile ? 18 : 24,
                        background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        margin: 0, fontWeight: 700, textAlign: "center",
                      }}
                    >
                      {s.next}
                    </p>
                  </div>
                }
                gridSize={12}
                pixelColor="#6c63ff"
                animationStepDuration={0.3}
                once={false}
                // ✅ taller cards on mobile, same as before on desktop
                aspectRatio={isMobile ? "22%" : "10%"}
                style={{ borderRadius: 12, border: "1px solid #1e1e2e" }}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── What BOS Does ─────────────────────────────────────────────────────────
const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    title: "One Interface",
    desc: "Replace your entire tool stack with a single place to work, think, and execute.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    ),
    title: "AI That Acts",
    desc: "Not just an assistant. BOS reads your context and takes action — assigns tasks, sends follow-ups, routes decisions.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    title: "Connected by Default",
    desc: "Customers, projects, files, and conversations are all linked. No more copy-pasting between tools.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "Real-Time Visibility",
    desc: "Know what's happening, what's stuck, and what needs your attention — without asking anyone.",
  },
];

function WhatBOSDoes() {
  return (
    <section
      className="stack-section"
      style={{
        padding: "120px 24px",
        position: "relative",
        overflow: "hidden",
        background: "rgba(6,6,8,0.82)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(108,99,255,0.08)",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <Reveal>

          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.03em",
              margin: "0 0 16px",
            }}
          >
            How BOS comes into play
          </h2>

        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 100}>
              <ProfileCard
                enableTilt={i === 0 ? false : true}
                behindGlowEnabled={true}
                behindGlowColor="rgba(108, 99, 255, 0.45)"
                innerGradient="linear-gradient(145deg, rgba(108,99,255,0.12) 0%, rgba(30,20,60,0.6) 100%)"
                showUserInfo={false}
                customContent={
                  <>
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 18,
                        background: "rgba(108,99,255,0.08)",
                        border: "1px solid rgba(108,99,255,0.2)",
                        backdropFilter: "blur(8px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        marginBottom: 28,
                        flexShrink: 0,
                        color: "#a78bfa",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                      }}
                    >
                      {f.icon}
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 24,
                        fontWeight: 700,
                        margin: "0 0 16px",
                        letterSpacing: "-0.02em",
                        color: "#fff",
                        lineHeight: 1.2,
                      }}
                    >
                      {f.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 16,
                        color: "#8a8aaa",
                        margin: 0,
                        lineHeight: 1.6,
                        maxWidth: "240px",
                      }}
                    >
                      {f.desc}
                    </p>
                  </>
                }
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ──────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      label: "Input",
      color: "#6c63ff",
      title: "You state your intent",
      items: [
        "Assign a project",
        "Follow up with a client",
        "Update a campaign",
        "Review team progress",
      ],
    },
    {
      label: "System",
      color: "#a855f7",
      title: "BOS orchestrates",
      items: [
        "Reads full context",
        "Breaks into actions",
        "Routes to right people",
        "Triggers automations",
      ],
    },
    {
      label: "Output",
      color: "#10b981",
      title: "Things get done",
      items: [
        "Tasks assigned",
        "Clients notified",
        "Files updated",
        "Status tracked",
      ],
    },
  ];

  return (
    <section
      id="how-it-works"
      className="stack-section"
      style={{
        padding: "120px 24px",
        position: "relative",
        overflow: "hidden",
        background: "rgba(6,6,8,0.82)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(108,99,255,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Reveal>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 56,
              color: "rgba(242, 241, 247, 1)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            How the BOS Works
          </p>

        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            position: "relative",
          }}
        >
          {steps.map((step, i) => (
            <Reveal key={i} delay={i * 120}>
              <ProfileCard
                enableTilt={true}
                behindGlowEnabled={true}
                behindGlowColor={step.color + "66"}
                innerGradient={`linear-gradient(145deg, ${step.color}11 0%, rgba(10,10,18,0.8) 100%)`}
                showUserInfo={false}
                customContent={
                  <>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: step.color + "18",
                        border: `1px solid ${step.color}44`,
                        borderRadius: 100,
                        padding: "6px 16px",
                        marginBottom: 20,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: step.color,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 11,
                          color: step.color,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          fontWeight: 700,
                        }}
                      >
                        {step.label}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 24,
                        fontWeight: 700,
                        color: "#fff",
                        margin: "0 0 24px",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {step.title}
                    </h3>



                    {/* Step number */}
                    <div
                      style={{
                        position: "absolute",
                        top: 28,
                        right: 28,
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 12,
                        color: "rgba(255,255,255,0.1)",
                        fontWeight: 700,
                      }}
                    >
                      0{i + 1}
                    </div>
                  </>
                }
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why It Matters ────────────────────────────────────────────────────────
const outcomes = [
  {
    metric: "10h+",
    label: "Saved per week",
    sub: "Per team member. No more tool-switching.",
  },
  {
    metric: "3×",
    label: "Faster execution",
    sub: "From decision to done in minutes, not days.",
  },
  {
    metric: "100%",
    label: "Visibility",
    sub: "Know exactly what's moving and what's stuck.",
  },
  {
    metric: "0",
    label: "Context lost",
    sub: "Every action is linked to a customer, project, or goal.",
  },
];

function WhyItMatters() {
  return (
    <section
      id="why-bos"
      className="stack-section"
      style={{
        padding: "120px 24px",
        position: "relative",
        overflow: "hidden",
        background: "rgba(6,6,8,0.82)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(108,99,255,0.08)",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <Reveal>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              color: "#6c63ff",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Why It Matters
          </p>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.03em",
              margin: "0 0 16px",
            }}
          >
            Built for agencies, HR teams,
            <br />
            and ecommerce brands.
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 18,
              color: "#6a6a8a",
              maxWidth: 520,
              lineHeight: 1.7,
              marginBottom: 80,
            }}
          >
            When your system works, your team does too. Here's what changes when
            you switch to BOS.
          </p>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            marginBottom: 80,
          }}
        >
          {outcomes.map((o, i) => (
            <Reveal key={i} delay={i * 100}>
              <ProfileCard
                enableTilt={true}
                behindGlowEnabled={true}
                behindGlowColor="rgba(108, 99, 255, 0.4)"
                innerGradient="linear-gradient(145deg, rgba(108,99,255,0.05) 0%, rgba(10,10,18,0.9) 100%)"
                showUserInfo={false}
                customContent={
                  <>
                    <h3
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 48,
                        fontWeight: 800,
                        color: "#fff",
                        margin: "0 0 12px",
                        letterSpacing: "-0.04em",
                        background:
                          "linear-gradient(135deg, #fff 0%, #6c63ff 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {o.metric}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 12,
                        color: "#6c63ff",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        fontWeight: 700,
                        marginBottom: 16,
                      }}
                    >
                      {o.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 15,
                        color: "#8a8aaa",
                        margin: 0,
                        lineHeight: 1.6,
                        maxWidth: "200px",
                      }}
                    >
                      {o.sub}
                    </p>
                  </>
                }
              />
            </Reveal>
          ))}
        </div>



      </div>
    </section>
  );
}

// ─── CTA ───────────────────────────────────────────────────────────────────
function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section
      id="get-access"
      className="stack-section"
      style={{
        padding: "140px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        background: "rgba(6,6,8,0.82)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(108,99,255,0.08)",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 640,
          margin: "0 auto",
        }}
      >
        <Reveal>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.04em",
              margin: "0 0 20px",
              lineHeight: 1.05,
            }}
          >
            Stop coordinating.
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Start executing.
            </span>
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 18,
              color: "#6a6a8a",
              lineHeight: 1.7,
              marginBottom: 48,
            }}
          >
            Join the waitlist. Be first to run your business on BOS.
          </p>
        </Reveal>

        <Reveal delay={150}>
          {!submitted ? (
            <div
              style={{
                display: "flex",
                gap: 12,
                maxWidth: 480,
                margin: "0 auto",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <input
                type="email"
                placeholder="your@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 240,
                  background: "#0d0d15",
                  border: "1px solid #2a2a48",
                  borderRadius: 100,
                  padding: "16px 24px",
                  color: "#fff",
                  fontSize: 15,
                  fontFamily: "'DM Sans', sans-serif",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6c63ff")}
                onBlur={(e) => (e.target.style.borderColor = "#2a2a48")}
              />
              <button
                onClick={() => email && setSubmitted(true)}
                style={{
                  background: "linear-gradient(135deg, #6c63ff, #5a52e8)",
                  color: "#fff",
                  border: "none",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "16px 28px",
                  borderRadius: 100,
                  cursor: "pointer",
                  boxShadow: "0 0 40px rgba(108,99,255,0.3)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 50px rgba(108,99,255,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 0 40px rgba(108,99,255,0.3)";
                }}
              >
                Contact Us →
              </button>
            </div>
          ) : (
            <div
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.3)",
                borderRadius: 16,
                padding: "24px 32px",
                maxWidth: 420,
                margin: "0 auto",
              }}
            >
              <p
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#10b981",
                  margin: "0 0 8px",
                }}
              >
                You're on the list. ✓
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  color: "#6a6a8a",
                  margin: 0,
                }}
              >
                We'll reach out when BOS is ready for you.
              </p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        padding: "80px 24px",
        background: "rgba(6,6,8,0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(108,99,255,0.1)",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexDirection: window.innerWidth < 768 ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
        }}
      >
        <div style={{ textAlign: window.innerWidth < 768 ? "center" : "left" }}>
          <h3
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 24,
              color: "#fff",
              letterSpacing: "-0.02em",
              margin: "0 0 8px",
            }}
          >
            BOS
          </h3>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: "#6a6a8a",
              margin: 0,
            }}
          >
            The Operating System for Modern Business.
          </p>
        </div>


      </div>
    </footer>
  );
}

// ─── Parallax note: Fixed ColorBends background + scrolling translucent
// sections naturally creates parallax — no JS pinning needed.

// ─── Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const locomotiveScroll = new LocomotiveScroll({
      lenisOptions: {
        wrapper: window,
        content: document.documentElement,
        lerp: 0.08,
        duration: 1.2,
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1.0,
      },
    });

    return () => {
      locomotiveScroll.destroy();
    };
  }, []);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #060608; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #060608; }
        ::-webkit-scrollbar-thumb { background: #2a2a48; border-radius: 4px; }
      `}</style>

      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      <div
        style={{
          background: "#060608",
          minHeight: "100vh",
          color: "#fff",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease 0.2s",
        }}
      >
        {/* Global ColorBends Background */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
          <ColorBends
            colors={[
              "#000000",
              "#020008",
              "#0d001a",
              "#261336",
              "#28004d",
              "#000000",
            ]}
            rotation={90}
            speed={0.12}
            scale={1.5}
            frequency={0.5}
            warpStrength={0.9}
            mouseInfluence={0.5}
            noise={0.04}
            parallax={0.3}
            iterations={3}
            intensity={1.8}
            bandWidth={3}
            transparent={false}
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        <Navbar />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Hero loaded={loaded} />
          <Challenge />
          <Shift />
          <WhatBOSDoes />
          <HowItWorks />
          <WhyItMatters />
          <CTA />
        </div>
        <Footer />
      </div>
    </>
  );
}
