import React, { useState, useEffect, useRef } from "react";
import {
  Box, Typography, Stack, Button, Card, CardContent,
  Avatar, Chip, Grid, TextField, Rating,
  Fade, CircularProgress, Divider, Alert,
  Dialog, DialogContent, DialogTitle, DialogActions,
  LinearProgress, Tooltip, Paper,
} from "@mui/material";
import {
  ArrowForward, ArrowBack, CheckCircle,
  Lock, Groups, VerifiedUser,
  SmartToy, RecordVoiceOver, QuestionAnswer, Refresh,
  EmojiEvents, Campaign, Mic, VolumeUp, VolumeOff,
  Close, Gavel,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/client";
import {
  GUT_QUESTIONS, getAllQuestions, getLLMDoctors, getLLMPeerScore,
  type LLMDoctor,
} from "./virtualPanelData";

type Phase = "setup" | "question" | "panel" | "summary";

const BADGE_COLOR: Record<string, string> = {
  distinguished: "#E53935", elevated: "#1565C0", standard: "#616161",
};

const SPECIALTY_GRADIENT: Record<string, string> = {
  Cardiology: "linear-gradient(135deg, #E53935, #B71C1C)",
  Neurology:  "linear-gradient(135deg, #8E24AA, #4A148C)",
  Paediatrics:"linear-gradient(135deg, #00ACC1, #006064)",
};

function gradientFor(specialty: string) {
  for (const key of Object.keys(SPECIALTY_GRADIENT)) {
    if (specialty?.toLowerCase().includes(key.toLowerCase())) return SPECIALTY_GRADIENT[key];
  }
  return "linear-gradient(135deg, #1565C0, #0D47A1)";
}

// Doctors whose answers are generated live via a backend LLM endpoint.
const LIVE_DOCTORS: Record<string, { endpoint: string; label: string; apiName: string }> = {
  kimi:      { endpoint: "/gut-panel/kimi",      label: "Kimi",    apiName: "Moonshot Kimi API" },
  sensenova: { endpoint: "/gut-panel/sensenova", label: "Nova",    apiName: "SenseTime SenseNova API" },
  minimax:   { endpoint: "/gut-panel/minimax",   label: "Minimax", apiName: "TokenRouter MiniMax API" },
  seed:      { endpoint: "/gut-panel/seed",      label: "Seed",    apiName: "TokenRouter Seed API" },
};

// Typewriter hook
function useTypewriter(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    ref.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(ref.current!);
        setDone(true);
      }
    }, speed);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [text, speed]);

  return { displayed, done };
}

function drExtras(doctorId: string, size: number): React.ReactNode {
  switch (doctorId) {
    case "openai":
      return (
        <>
          {/* Neat dark parted hair */}
          <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: size*0.17, bgcolor: "#1A1A1A", borderRadius: "0 0 20% 20%" }} />
          <Box sx={{ position: "absolute", top: 0, left: "46%", width: "8%", height: size*0.14, bgcolor: "rgba(255,255,255,0.12)" }} />
        </>
      );
    case "anthropic":
      return (
        <>
          {/* Warm auburn wavy hair */}
          <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: size*0.2, bgcolor: "#8B3A0F", borderRadius: "0 0 40% 40%" }} />
          {/* Blush */}
          <Box sx={{ position: "absolute", top: "41%", left: "7%", width: size*0.16, height: size*0.08, borderRadius: "50%", bgcolor: "rgba(255,140,100,0.45)" }} />
          <Box sx={{ position: "absolute", top: "41%", right: "7%", width: size*0.16, height: size*0.08, borderRadius: "50%", bgcolor: "rgba(255,140,100,0.45)" }} />
        </>
      );
    case "kimi":
      return (
        <>
          {/* Spiky anime hair */}
          <Box sx={{ position: "absolute", top: 0, left: "15%", width: "70%", height: size*0.14, bgcolor: "#111827" }} />
          <Box sx={{ position: "absolute", top: -size*0.04, left: "22%", width: size*0.13, height: size*0.18, bgcolor: "#111827", borderRadius: "50% 50% 0 0", transform: "rotate(-18deg)", transformOrigin: "bottom center" }} />
          <Box sx={{ position: "absolute", top: -size*0.06, left: "40%", width: size*0.13, height: size*0.22, bgcolor: "#111827", borderRadius: "50% 50% 0 0" }} />
          <Box sx={{ position: "absolute", top: -size*0.03, left: "58%", width: size*0.13, height: size*0.17, bgcolor: "#111827", borderRadius: "50% 50% 0 0", transform: "rotate(18deg)", transformOrigin: "bottom center" }} />
          {/* Energy lines */}
          <Box sx={{ position: "absolute", top: "32%", left: "2%", width: size*0.08, height: 2, bgcolor: "rgba(255,255,255,0.5)", transform: "rotate(-30deg)" }} />
          <Box sx={{ position: "absolute", top: "38%", left: "2%", width: size*0.06, height: 2, bgcolor: "rgba(255,255,255,0.35)", transform: "rotate(-25deg)" }} />
        </>
      );
    case "sensenova":
      return (
        <>
          {/* Formal flat dark hair */}
          <Box sx={{ position: "absolute", top: 0, left: "8%", right: "8%", height: size*0.15, bgcolor: "#1F2937", borderRadius: "0 0 6px 6px" }} />
          {/* Glasses — overlays eyes */}
          <Box sx={{ position: "absolute", top: "23%", left: "8%", right: "8%", height: size*0.18, display: "flex", alignItems: "center", gap: "4%" }}>
            <Box sx={{ flex: 1, height: "100%", borderRadius: "35%", border: `${Math.max(1,size*0.025)}px solid rgba(255,255,255,0.8)`, bgcolor: "rgba(200,230,255,0.08)" }} />
            <Box sx={{ width: "7%", height: 2, bgcolor: "rgba(255,255,255,0.65)" }} />
            <Box sx={{ flex: 1, height: "100%", borderRadius: "35%", border: `${Math.max(1,size*0.025)}px solid rgba(255,255,255,0.8)`, bgcolor: "rgba(200,230,255,0.08)" }} />
          </Box>
        </>
      );
    case "gemini":
      return (
        <>
          {/* Rainbow forehead band */}
          <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: size*0.13, background: "linear-gradient(90deg,#EA4335,#FBBC04,#34A853,#4285F4)", opacity: 0.8 }} />
          {/* Sparkle */}
          <Typography component="span" sx={{ position: "absolute", top: "11%", left: "50%", transform: "translateX(-50%)", fontSize: size*0.17, lineHeight: 1, userSelect: "none" }}>✨</Typography>
          {/* Colorful dots on cheeks */}
          <Box sx={{ position: "absolute", top: "41%", left: "6%", width: size*0.08, height: size*0.08, borderRadius: "50%", bgcolor: "#FBBC0488" }} />
          <Box sx={{ position: "absolute", top: "41%", right: "6%", width: size*0.08, height: size*0.08, borderRadius: "50%", bgcolor: "#34A85388" }} />
        </>
      );
    case "minimax":
      return (
        <>
          {/* Sleek swept-back hair */}
          <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: size*0.16, bgcolor: "#3A1F12", borderRadius: "0 0 30% 30%" }} />
          {/* Half-moon visor accent */}
          <Box sx={{ position: "absolute", top: "13%", left: "50%", transform: "translateX(-50%)", width: size*0.5, height: size*0.06, borderRadius: 10, bgcolor: "rgba(255,255,255,0.35)" }} />
        </>
      );
    case "seed":
      return (
        <>
          {/* Leafy sprout tuft */}
          <Box sx={{ position: "absolute", top: -size*0.05, left: "44%", width: size*0.12, height: size*0.16, bgcolor: "#0F766E", borderRadius: "50% 50% 50% 0", transform: "rotate(-20deg)", transformOrigin: "bottom center" }} />
          <Box sx={{ position: "absolute", top: -size*0.04, left: "50%", width: size*0.12, height: size*0.15, bgcolor: "#0F766E", borderRadius: "50% 50% 0 50%", transform: "rotate(20deg)", transformOrigin: "bottom center" }} />
          {/* Forehead band */}
          <Box sx={{ position: "absolute", top: size*0.1, left: 0, right: 0, height: size*0.07, bgcolor: "rgba(255,255,255,0.25)" }} />
        </>
      );
    default:
      return null;
  }
}

function TalkingFace({ color, logo, speaking, size = 88, doctorId = "" }: { color: string; logo: string; speaking: boolean; size?: number; doctorId?: string }) {
  return (
    <Box sx={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {speaking && <>
        <Box sx={{ position: "absolute", inset: -7, borderRadius: "50%", border: `3px solid ${color}44`, animation: "tfp1 1.5s ease-in-out infinite", "@keyframes tfp1": { "0%,100%": { transform: "scale(1)", opacity: 1 }, "50%": { transform: "scale(1.1)", opacity: 0 } } }} />
        <Box sx={{ position: "absolute", inset: -3, borderRadius: "50%", border: `2px solid ${color}33`, animation: "tfp2 1.5s ease-in-out infinite 0.35s", "@keyframes tfp2": { "0%,100%": { transform: "scale(1)", opacity: 0.8 }, "50%": { transform: "scale(1.06)", opacity: 0 } } }} />
      </>}
      <Box sx={{
        width: size, height: size, borderRadius: "50%",
        background: `radial-gradient(circle at 36% 30%, rgba(255,255,255,0.28) 0%, transparent 55%), ${color}`,
        border: "3px solid rgba(255,255,255,0.55)",
        position: "relative", overflow: "hidden",
        boxShadow: speaking ? `0 0 28px ${color}66` : `0 4px 12px ${color}33`,
        animation: speaking ? "tfhb 0.6s ease-in-out infinite alternate" : "none",
        "@keyframes tfhb": { from: { transform: "translateY(0) rotate(-1deg)" }, to: { transform: "translateY(-5px) rotate(1deg)" } },
      }}>
        {/* Doctor-specific features (hair, glasses, etc.) */}
        {drExtras(doctorId, size)}
        {/* Left eye */}
        <Box sx={{ position: "absolute", top: "26%", left: "20%", width: size*0.17, height: size*0.17, borderRadius: "50%", bgcolor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ width: size*0.09, height: size*0.09, borderRadius: "50%", bgcolor: "#111827", animation: "tfbl 4s ease-in-out infinite", "@keyframes tfbl": { "0%,44%,46%,48%,100%": { transform: "scaleY(1)" }, "45%,47%": { transform: "scaleY(0.05)" } } }} />
        </Box>
        {/* Right eye */}
        <Box sx={{ position: "absolute", top: "26%", right: "20%", width: size*0.17, height: size*0.17, borderRadius: "50%", bgcolor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ width: size*0.09, height: size*0.09, borderRadius: "50%", bgcolor: "#111827", animation: "tfbl 4s ease-in-out infinite 0.15s" }} />
        </Box>
        {/* Nose */}
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", display: "flex", gap: `${size*0.04}px` }}>
          <Box sx={{ width: size*0.05, height: size*0.05, borderRadius: "50%", bgcolor: "rgba(0,0,0,0.18)" }} />
          <Box sx={{ width: size*0.05, height: size*0.05, borderRadius: "50%", bgcolor: "rgba(0,0,0,0.18)" }} />
        </Box>
        {/* Mouth */}
        <Box sx={{
          position: "absolute", bottom: "16%", left: "50%", transform: "translateX(-50%)",
          width: size * 0.44, bgcolor: "rgba(0,0,0,0.5)",
          height: `${size*0.055}px`, overflow: "hidden",
          animation: speaking ? "tfmouth 0.25s ease-in-out infinite alternate" : "none",
          "@keyframes tfmouth": { "0%": { height: `${size*0.055}px`, borderRadius: `${size}px` }, "100%": { height: `${size*0.23}px`, borderRadius: `0 0 ${size}px ${size}px` } },
          transition: speaking ? "none" : "height 0.3s, border-radius 0.3s",
        }}>
          {speaking && <Box sx={{ width: "80%", height: 4, bgcolor: "rgba(255,255,255,0.8)", mx: "auto", borderRadius: 1, mt: "2px" }} />}
        </Box>
        {/* Logo badge */}
        <Box sx={{ position: "absolute", bottom: 2, right: 2, width: size*0.27, height: size*0.27, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size*0.15, border: `1.5px solid ${color}66` }}>{logo}</Box>
      </Box>
    </Box>
  );
}

// Clickable red "cross" badge a real specialist places on a Dr Virtual AI input to signal disagreement.
function DisagreeToggle({ active, onClick, size = 26 }: { active: boolean; onClick: () => void; size?: number }) {
  return (
    <Tooltip title={active ? "Specialist flagged disagreement — click to remove" : "Flag specialist disagreement"}>
      <Box
        onClick={onClick}
        sx={{
          cursor: "pointer", width: size, height: size, borderRadius: "50%", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
          bgcolor: active ? "#E53935" : "rgba(0,0,0,0.05)",
          color: active ? "white" : "rgba(0,0,0,0.4)",
          border: active ? "2px solid #B71C1C" : "1px dashed rgba(0,0,0,0.35)",
          "&:hover": { bgcolor: active ? "#C62828" : "rgba(229,57,53,0.15)", color: active ? "white" : "#E53935" },
        }}
      >
        <Close sx={{ fontSize: size * 0.62 }} />
      </Box>
    </Tooltip>
  );
}

// Semi-transparent red overlay drawn over a flagged input card.
function DisagreeOverlay() {
  return (
    <Box sx={{ position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", overflow: "hidden", zIndex: 2 }}>
      <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(229,57,53,0.10)" }} />
      <Box sx={{ position: "absolute", top: "50%", left: "-10%", width: "120%", height: 2, bgcolor: "rgba(229,57,53,0.55)", transform: "rotate(-12deg)" }} />
    </Box>
  );
}

export default function VirtualPanel() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>("setup");
  // LLM doctors are fixed — no API fetch needed
  const [question, setQuestion] = useState("");
  const [questionSpec, setQuestionSpec] = useState("");
  const [questionIdx, setQuestionIdx] = useState(0);
  const [customQ, setCustomQ] = useState("");
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [speakerIdx, setSpeakerIdx] = useState(0);
  const [showReactions, setShowReactions] = useState(false);
  const [scoresRevealed, setScoresRevealed] = useState(false);
  const [speakerFinalScores, setSpeakerFinalScores] = useState<Record<string, number>>({});
  const [isMuted, setIsMuted] = useState(false);
  // Live doctors' answers are generated live via their backend LLM endpoints, keyed by doctor id
  const [liveAnswers, setLiveAnswers] = useState<Record<string, string>>({});
  const [liveLoadingMap, setLiveLoadingMap] = useState<Record<string, boolean>>({});
  const [liveErrors, setLiveErrors] = useState<Record<string, string>>({});
  // Real specialist's disagreement flags ("cross" badges) placed on Dr Virtual AI inputs.
  // Keyed so they persist across rounds and into the summary: see disagreeKey().
  const [disagreements, setDisagreements] = useState<Record<string, boolean>>({});

  // Only verified specialists (and admins) may flag disagreement with the AI panel.
  const isSpecialist = user?.role === "specialist" || user?.role === "admin";

  // Derived state — must be before useEffects that reference them
  const panelists = getLLMDoctors();
  const currentSpeaker: LLMDoctor | null = panelists[speakerIdx] ?? null;
  const otherPanelists = panelists.filter((_, i) => i !== speakerIdx);
  const isLastSpeaker = speakerIdx === panelists.length - 1;
  const liveCfg = currentSpeaker ? LIVE_DOCTORS[currentSpeaker.id] : undefined;
  const isLiveSpeaker = !!liveCfg;
  // Active live speaker details, used to drive the live UI generically
  const liveAnswer = currentSpeaker ? liveAnswers[currentSpeaker.id] ?? null : null;
  const liveError = currentSpeaker ? liveErrors[currentSpeaker.id] ?? null : null;
  // While a live answer is in flight (and hasn't fallen back), pause the panel flow
  const livePending = isLiveSpeaker && !!currentSpeaker && (liveLoadingMap[currentSpeaker.id] ?? false) && !liveAnswer && !liveError;
  const liveLabel = liveCfg?.label ?? "";
  const liveApiName = liveCfg?.apiName ?? "";
  function hardcodedResponse(doc: LLMDoctor): string {
    return doc.responses[questionIdx] ?? doc.responses[0] ?? "";
  }
  const responseText = !currentSpeaker
    ? ""
    : isLiveSpeaker
      ? (liveAnswer ?? (liveError ? hardcodedResponse(currentSpeaker) : ""))
      : hardcodedResponse(currentSpeaker);

  // Fetch every live doctor's answer once per question (ready before they speak)
  useEffect(() => {
    if (phase !== "panel" || !question) return;
    let cancelled = false;
    setLiveAnswers({});
    setLiveErrors({});
    setLiveLoadingMap(Object.fromEntries(Object.keys(LIVE_DOCTORS).map(id => [id, true])));
    Object.entries(LIVE_DOCTORS).forEach(([id, cfg]) => {
      api.post<{ answer: string }>(cfg.endpoint, { question })
        .then(res => { if (!cancelled) setLiveAnswers(prev => ({ ...prev, [id]: res.data.answer })); })
        .catch(err => {
          if (!cancelled) setLiveErrors(prev => ({ ...prev, [id]: err?.response?.data?.error ?? `${cfg.label} is unavailable` }));
        })
        .finally(() => { if (!cancelled) setLiveLoadingMap(prev => ({ ...prev, [id]: false })); });
    });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, question]);

  function cleanForSpeech(text: string): string {
    return text.replace(/[\u{1F300}-\u{1F9FF}\u{1F000}-\u{1F02F}\u{2600}-\u{27BF}\u{FE00}-\u{FEFF}]/gu, "").replace(/\s+/g, " ").trim();
  }

  function speak(text: string, rate = 1.0, pitch = 1.0) {
    if (!window.speechSynthesis || isMuted) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(cleanForSpeech(text));
    utt.rate = rate;
    utt.pitch = pitch;
    utt.volume = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const pick = voices.find(v => v.name.includes("Samantha")) ||
                 voices.find(v => v.name.includes("Google UK English Female")) ||
                 voices.find(v => v.lang === "en-GB") ||
                 voices.find(v => v.lang.startsWith("en")) ||
                 voices[0];
    if (pick) utt.voice = pick;
    window.speechSynthesis.speak(utt);
  }

  function stopSpeech() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  // Speak host intro when speaker changes
  useEffect(() => {
    if (phase !== "panel" || !currentSpeaker || isMuted) return;
    stopSpeech();
    const intro = getHostIntro(speakerIdx, panelists.length, currentSpeaker);
    const t = setTimeout(() => speak(intro, 1.08, 1.15), 300);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speakerIdx, phase, isMuted]);

  // Speak specialist response (after brief host-intro gap)
  useEffect(() => {
    if (phase !== "panel" || !responseText || isMuted) return;
    const t = setTimeout(() => speak(responseText, 0.93, 0.95), 3800);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseText, phase, isMuted]);

  // Speak score reveal
  useEffect(() => {
    if (!scoresRevealed || phase !== "panel" || !currentSpeaker || isMuted) return;
    const score = computeRoundScore(currentSpeaker, otherPanelists, questionIdx);
    const r = audienceReaction(score);
    stopSpeech();
    speak(`The final score is ${score} out of 10. ${r.text}`, 0.98, 0.9);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scoresRevealed]);

  // Cancel speech when leaving panel
  useEffect(() => {
    if (phase !== "panel") stopSpeech();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);


  const { displayed, done } = useTypewriter(
    phase === "panel" ? responseText : "", 14
  );
  // A live speaker's empty placeholder finishes the typewriter instantly while loading —
  // don't treat that as a real "answer locked in".
  const answerReady = done && !livePending;

  useEffect(() => {
    if (answerReady) setShowReactions(true);
  }, [answerReady]);

  function computeRoundScore(speaker: LLMDoctor, others: LLMDoctor[], qIdx: number): number {
    const peerScores = others.map(r => getLLMPeerScore(r.id, speaker.id, qIdx).score);
    if (peerScores.length === 0) return 8.0;
    return +(peerScores.reduce((a, b) => a + b, 0) / peerScores.length).toFixed(1);
  }

  function audienceReaction(score: number): { text: string; color: string; bg: string; emoji: string } {
    if (score >= 9.0) return { emoji: "🔥🔥🔥", text: "STANDING OVATION! The crowd is absolutely wild!", color: "#B71C1C", bg: "#FFF5F5" };
    if (score >= 8.5) return { emoji: "🔥👏", text: "Incredible answer! The judges leap to their feet!", color: "#C62828", bg: "#FFF8F5" };
    if (score >= 8.0) return { emoji: "👏👏", text: "Strong showing — the panel is clearly impressed!", color: "#1B5E20", bg: "#F1F8F1" };
    if (score >= 7.0) return { emoji: "👍", text: "Solid response. The judges nod in approval.", color: "#1565C0", bg: "#F0F4FF" };
    return { emoji: "🤔", text: "Interesting take. The judges have mixed reactions.", color: "#E65100", bg: "#FFF8F0" };
  }

  function getHostIntro(idx: number, total: number, speaker: LLMDoctor): string {
    if (idx === 0) return `Welcome to MediQ Live — Gut Health Edition! 🎙️ Tonight's first contestant: ${speaker.name}, the ${speaker.title}. The gauntlet BEGINS!`;
    if (idx === total - 1) return `We've reached the FINAL round! 🏁 The leaderboard is razor-close. Can ${speaker.name} steal the crown? Let's find out!`;
    return `Round ${idx + 1} is underway! 🎙️ Please welcome ${speaker.name} — the ${speaker.title}!`;
  }

  function startPanel(q: string, spec: string, idx: number) {
    setQuestion(q); setQuestionSpec(spec); setQuestionIdx(idx);
    setSpeakerIdx(0); setShowReactions(false); setScoresRevealed(false);
    setSpeakerFinalScores({}); setPhase("panel");
  }

  function nextSpeaker() {
    if (currentSpeaker) {
      const score = computeRoundScore(currentSpeaker, otherPanelists, questionIdx);
      setSpeakerFinalScores(prev => ({ ...prev, [currentSpeaker.id]: score }));
    }
    if (isLastSpeaker) { setPhase("summary"); return; }
    setSpeakerIdx(i => i + 1);
    setShowReactions(false);
    setScoresRevealed(false);
  }

  function reset() {
    setPhase("setup"); setSpeakerIdx(0);
    setQuestion(""); setCustomQ(""); setShowReactions(false);
    setScoresRevealed(false); setSpeakerFinalScores({});
    setDisagreements({});
  }

  // Stable key for a flagged Dr Virtual AI input.
  //  - "peer"   : a judge's peer score of the current speaker  → subjectId = speaker, byId = judge
  //  - "final"  : a doctor's final standing in the summary     → subjectId = doctor,  byId = "final"
  function disagreeKey(kind: "peer" | "final", subjectId: string, byId: string) {
    return `${kind}:${subjectId}:${byId}`;
  }
  function toggleDisagree(key: string) {
    setDisagreements(prev => {
      const next = { ...prev };
      if (next[key]) delete next[key]; else next[key] = true;
      return next;
    });
  }
  const disagreeCount = Object.keys(disagreements).length;

  /* ── SETUP PHASE ─────────────────────────────── */
  if (phase === "setup") return (
    <Box>
      {/* Featured Series Banner */}
      <Box sx={{ background: "linear-gradient(135deg, #1B5E20, #2E7D32, #00695C)", borderRadius: 3, p: 3, mb: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
          <Typography fontSize={28}>🦠</Typography>
          <Box>
            <Typography variant="caption" color="rgba(255,255,255,0.7)" fontWeight={700} letterSpacing={2} fontSize={10}>
              MEDIQ — FEATURED SERIES
            </Typography>
            <Typography variant="h5" fontWeight={900} color="white" lineHeight={1.1}>
              Gut Health Series
            </Typography>
          </Box>
        </Stack>
        <Typography color="rgba(255,255,255,0.8)" fontSize={13} mt={1}>
          Explore 10 essential gut health questions answered by each specialist from their unique clinical perspective — cardiology, neurology, and paediatrics.
        </Typography>
      </Box>

      <Typography variant="h6" fontWeight={700} mb={2}>Tonight's Contestants — {panelists.length} AI Doctors</Typography>
      <Grid container spacing={2} mb={4}>
        {panelists.map(doc => (
          <Grid item xs={12} sm={6} md={4} key={doc.id}>
            <Card variant="outlined" sx={{ borderRadius: 2.5, borderLeft: `4px solid ${doc.color}`, bgcolor: doc.bgColor, transition: "all 0.15s", "&:hover": { boxShadow: `0 4px 16px ${doc.color}33` } }}>
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <TalkingFace color={doc.color} logo={doc.logo} speaking={false} size={56} doctorId={doc.id} />
                  <Box flex={1} minWidth={0}>
                    <Typography fontWeight={800} noWrap fontSize={14} color={doc.color}>{doc.name}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">{doc.title}</Typography>
                    <Typography variant="caption" color="text.disabled">{doc.model}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>{panelists.length} AI Doctors competing tonight.</strong> All responses are AI-generated educational simulations and do not constitute professional medical advice.
      </Alert>

      <Button
        variant="contained" size="large" endIcon={<ArrowForward />}
        onClick={() => setPhase("question")}
        sx={{ px: 4, py: 1.5, fontWeight: 700 }}
      >
        Choose Tonight's Question →
      </Button>
    </Box>
  );

  /* ── QUESTION PHASE ───────────────────────────── */
  if (phase === "question") {
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={() => setPhase("setup")} sx={{ mb: 3 }}>
          Back to Panel Setup
        </Button>

        {/* Series header */}
        <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
          <Typography fontSize={22}>🦠</Typography>
          <Box>
            <Typography variant="caption" color="success.dark" fontWeight={700} letterSpacing={1.5} fontSize={10}>FEATURED GUT HEALTH SERIES</Typography>
            <Typography variant="h5" fontWeight={800}>Choose a Question</Typography>
          </Box>
        </Stack>
        <Typography color="text.secondary" mb={3}>
          Each AI Doctor will answer from their unique perspective. {!user && <><strong>Sign in</strong> to ask a custom question.</>}
        </Typography>

        <Box mb={3}>
          <Typography variant="overline" fontWeight={700} color="success.dark" fontSize={10} mb={1.5} display="block">
            🔬 Top 10 Gut Health Questions
          </Typography>
          <Stack spacing={1}>
            {GUT_QUESTIONS.map((q, idx) => (
              <Paper
                key={q} variant="outlined"
                onClick={() => startPanel(q, "Gut Health", idx)}
                sx={{
                  p: 1.5, cursor: "pointer", borderRadius: 2,
                  "&:hover": { borderColor: "success.main", bgcolor: "#F1F8F1" },
                  transition: "all 0.15s",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: "success.main", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Typography fontSize={10} fontWeight={800} color="white">{idx + 1}</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={500} flex={1}>{q}</Typography>
                  <ArrowForward sx={{ fontSize: 16, color: "text.disabled" }} />
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <Lock sx={{ fontSize: 16, color: user ? "success.main" : "text.disabled" }} />
            <Typography variant="body2" fontWeight={600}>
              {user ? "Ask Your Own Question" : "Sign in to ask a custom question"}
            </Typography>
          </Stack>

          {user ? (
            <Stack spacing={1.5}>
              <TextField
                placeholder="Type your medical question for the panel…"
                value={customQ}
                onChange={e => setCustomQ(e.target.value)}
                multiline rows={2} fullWidth size="small"
              />
              <Alert severity="warning" sx={{ fontSize: 12 }}>
                <strong>Disclaimer:</strong> Responses are AI-generated educational simulations based on specialist profiles. They do not constitute professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.
              </Alert>
              <Button
                variant="outlined" endIcon={<ArrowForward />}
                disabled={!customQ.trim()}
                onClick={() => startPanel(customQ.trim(), "Gut Health", 0)}
              >
                Ask the Panel
              </Button>
            </Stack>
          ) : (
            <Alert severity="info" sx={{ fontSize: 12 }}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Lock sx={{ fontSize: 14 }} />
                <Typography variant="caption">Only registered members can ask custom questions. <strong>Sign up to unlock.</strong></Typography>
              </Stack>
            </Alert>
          )}
        </Box>
      </Box>
    );
  }

  /* ── PANEL DISCUSSION PHASE (TALK SHOW) ───────── */
  if (phase === "panel" && currentSpeaker) {
    const grad = currentSpeaker.color;
    const roundScore = computeRoundScore(currentSpeaker, otherPanelists, questionIdx);
    const reaction = audienceReaction(roundScore);

    return (
      <Box>
        {/* ── MEDIQ LIVE Header Strip ── */}
        <Box sx={{ background: "linear-gradient(90deg, #0D0D1A, #1A1A3E, #0F3460)", borderRadius: 2, px: 3, py: 1.5, mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#EF5350", animation: "liveDot 1.2s step-end infinite", "@keyframes liveDot": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.2 } } }} />
                <Typography variant="caption" color="#EF5350" fontWeight={800} fontSize={10} letterSpacing={1}>LIVE</Typography>
              </Box>
              <Typography variant="h6" fontWeight={900} color="white" letterSpacing={3} fontSize={16}>MEDIQ LIVE</Typography>
              <Chip label="🦠 Gut Health Series" size="small" sx={{ bgcolor: "#1B5E20", color: "white", fontWeight: 700, fontSize: 10 }} />
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography color="rgba(255,255,255,0.5)" fontSize={11}>ROUND</Typography>
                <Typography color="white" fontWeight={900} fontSize={20} lineHeight={1}>{speakerIdx + 1}</Typography>
                <Typography color="rgba(255,255,255,0.3)" fontSize={11}>/ {panelists.length}</Typography>
              </Stack>
              <Tooltip title={isMuted ? "Unmute audio" : "Mute audio"}>
                <Button
                  size="small" onClick={() => { setIsMuted(m => !m); if (!isMuted) stopSpeech(); }}
                  sx={{ color: isMuted ? "rgba(255,255,255,0.3)" : "#69F0AE", minWidth: 0, p: 0.75, borderRadius: 2, border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  {isMuted ? <VolumeOff sx={{ fontSize: 18 }} /> : <VolumeUp sx={{ fontSize: 18 }} />}
                </Button>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>

        {/* ── Host Message ── */}
        <Box sx={{ bgcolor: "#FFFDE7", border: "1px solid #F9A825", borderLeft: "5px solid #F9A825", borderRadius: 1.5, px: 2.5, py: 1.5, mb: 3 }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Mic sx={{ color: "#F57F17", fontSize: 20, mt: 0.25, flexShrink: 0 }} />
            <Typography fontSize={13} fontWeight={500} color="#4E342E" fontStyle="italic">
              "{getHostIntro(speakerIdx, panelists.length, currentSpeaker)}"
            </Typography>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {/* Left: question label + progress */}
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" fontWeight={700} color="text.secondary">❓ {question}</Typography>
              <Stack direction="row" spacing={0.75}>
                {panelists.map((s, i) => (
                  <Tooltip key={s.id} title={`${s.name}${speakerFinalScores[s.id] ? ` · ${speakerFinalScores[s.id]}/10` : ""}`}>
                    <Box sx={{ position: "relative" }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: "50%", fontSize: 16,
                        bgcolor: i === speakerIdx ? s.color : i < speakerIdx ? "#4CAF50" : "#E0E0E0",
                        border: i === speakerIdx ? "2px solid #1565C0" : "none",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {i < speakerIdx && speakerFinalScores[s.id] ? <EmojiEvents sx={{ fontSize: 14, color: "white" }} /> : s.logo}
                      </Box>
                      {speakerFinalScores[s.id] && (
                        <Box sx={{ position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap" }}>
                          <Typography fontSize={9} fontWeight={800} color="success.main">{speakerFinalScores[s.id]}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Tooltip>
                ))}
              </Stack>
            </Stack>
            <LinearProgress variant="determinate" value={(speakerIdx / panelists.length) * 100}
              sx={{ height: 5, borderRadius: 3, mb: 3, bgcolor: "#E8F5E9", "& .MuiLinearProgress-bar": { bgcolor: "#2E7D32" } }} />
          </Grid>
        </Grid>

        {/* ── Speaker card (left 8col) + Live Leaderboard (right 4col) ── */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
              {/* Gradient header with virtual avatar */}
              <Box sx={{ background: `linear-gradient(135deg, ${grad}CC, ${grad})`, px: 3, pt: 3, pb: 4 }}>
                <Stack direction="row" spacing={2.5} alignItems="center">
                  <TalkingFace color={currentSpeaker.color} logo={currentSpeaker.logo} speaking={!answerReady} size={90} doctorId={currentSpeaker.id} />
                  <Box flex={1}>
                    <Stack direction="row" spacing={0.75} alignItems="center" mb={0.25}>
                      <Typography variant="h6" fontWeight={800} color="white">{currentSpeaker.name}</Typography>
                    </Stack>
                    <Typography color="rgba(255,255,255,0.8)" fontSize={13} mb={0.75}>{currentSpeaker.title} · {currentSpeaker.model}</Typography>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, bgcolor: "rgba(0,0,0,0.35)", borderRadius: 10, px: 1.25, py: 0.4, border: "1px solid rgba(144,202,249,0.4)" }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: answerReady ? "rgba(255,255,255,0.4)" : "#69F0AE", animation: answerReady ? "none" : "dot 1s step-end infinite", "@keyframes dot": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.2 } } }} />
                      <Typography variant="caption" color="#90CAF9" fontWeight={700} fontSize={10} letterSpacing={0.5}>
                        {answerReady ? (liveAnswer ? `${liveLabel.toUpperCase()} · LIVE ANSWER LOCKED IN` : "VIRTUAL AI · ANSWER LOCKED IN") : livePending ? `${liveLabel.toUpperCase()} · CONNECTING LIVE…` : "VIRTUAL AI · SPEAKING…"}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              {/* Response body */}
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <RecordVoiceOver sx={{ color: "primary.main", fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={700} color="primary.main">{answerReady ? "Answer locked in" : livePending ? `Connecting to Dr. ${liveLabel} (live)…` : "Speaking…"}</Typography>
                  {!answerReady && <CircularProgress size={14} thickness={5} />}
                </Stack>
                {isLiveSpeaker && liveError && (
                  <Alert severity="warning" sx={{ mb: 2, py: 0.25 }}>
                    Live {liveLabel} unavailable ({liveError}) — showing a cached response.
                  </Alert>
                )}
                <Typography variant="body1" lineHeight={1.8} color="text.primary" sx={{ minHeight: 120 }}>
                  {livePending ? (
                    <Box component="span" sx={{ color: "text.secondary", fontStyle: "italic" }}>
                      Connecting to Dr. {liveLabel} via the live {liveApiName}…
                    </Box>
                  ) : (
                    <>
                      {displayed}
                      {!answerReady && <Box component="span" sx={{ display: "inline-block", width: 2, height: "1em", bgcolor: "primary.main", ml: 0.5, animation: "blink 0.8s step-end infinite", "@keyframes blink": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0 } } }} />}
                    </>
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Live Leaderboard */}
          <Grid item xs={12} md={4}>
            <Box sx={{ bgcolor: "#0D0D1A", borderRadius: 3, p: 2.5, height: "100%" }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <EmojiEvents sx={{ color: "#FFD700", fontSize: 20 }} />
                <Typography variant="overline" color="white" fontWeight={800} fontSize={11} letterSpacing={2}>LEADERBOARD</Typography>
              </Stack>
              <Stack spacing={1.5}>
                {panelists.map((s, i) => {
                  const scored = speakerFinalScores[s.id];
                  const isCurr = i === speakerIdx;
                  const isPend = i > speakerIdx;
                  return (
                    <Box key={s.id} sx={{ bgcolor: isCurr ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)", borderRadius: 2, px: 2, py: 1.25, border: isCurr ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.06)" }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: isPend ? "rgba(255,255,255,0.1)" : s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                          {s.logo}
                        </Box>
                        <Box flex={1} minWidth={0}>
                          <Typography color={isPend ? "rgba(255,255,255,0.35)" : "white"} fontWeight={700} fontSize={12} noWrap>{s.name}</Typography>
                          <Typography color="rgba(255,255,255,0.4)" fontSize={10}>{s.title}</Typography>
                        </Box>
                        <Box textAlign="right">
                          {scored ? (
                            <Typography fontWeight={900} fontSize={18} color={scored >= 8.5 ? "#FFD700" : scored >= 7.5 ? "#81C784" : "#EF9A9A"}>{scored}</Typography>
                          ) : isCurr ? (
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                              {[0,1,2].map(j => <Box key={j} sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "#90CAF9", animation: `ld 1s ease-in-out infinite ${j*0.2}s`, "@keyframes ld": { "0%,100%": { opacity: 0.3 }, "50%": { opacity: 1 } } }} />)}
                            </Box>
                          ) : (
                            <Typography color="rgba(255,255,255,0.2)" fontSize={12}>–</Typography>
                          )}
                          {scored && <Typography color="rgba(255,255,255,0.4)" fontSize={9}>/10</Typography>}
                        </Box>
                      </Stack>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          </Grid>
        </Grid>

        {/* ── Judge Panel (after speaking) ── */}
        {answerReady && (
          <Fade in>
            <Box mt={4}>
              <Divider sx={{ mb: 3 }} />

              {/* AI Doctor Peer Judge Scores */}
              <Typography variant="overline" fontWeight={800} fontSize={11} letterSpacing={2} display="block" mb={1.5}>
                ⚖️ JUDGE PANEL — PEER SCORES
              </Typography>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={isSpecialist ? 8 : 12}>
                  <Grid container spacing={1.5}>
                    {otherPanelists.map((judge, i) => {
                      const r = getLLMPeerScore(judge.id, currentSpeaker.id, questionIdx);
                      const dKey = disagreeKey("peer", currentSpeaker.id, judge.id);
                      const flagged = !!disagreements[dKey];
                      return (
                        <Grid item xs={6} sm={4} key={judge.id}>
                          <Fade in={showReactions} style={{ transitionDelay: `${i * 70}ms` }}>
                            <Card variant="outlined" sx={{ position: "relative", borderLeft: `4px solid ${judge.color}`, bgcolor: judge.bgColor, borderRadius: 2, ...(flagged && { borderColor: "#E53935" }) }}>
                              {flagged && <DisagreeOverlay />}
                              <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 }, position: "relative", zIndex: 1 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                                  <Stack direction="row" spacing={0.75} alignItems="center">
                                    <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: judge.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{judge.logo}</Box>
                                    <Box>
                                      <Typography fontWeight={800} fontSize={12}>{judge.name}</Typography>
                                      <Typography variant="caption" color="text.disabled" fontSize={9}>{judge.title}</Typography>
                                    </Box>
                                  </Stack>
                                  <Stack direction="row" spacing={0.75} alignItems="center">
                                    {showReactions
                                      ? <Typography fontWeight={900} fontSize={20} color={flagged ? "#E53935" : judge.color} sx={{ textDecoration: flagged ? "line-through" : "none" }}>{r.score}</Typography>
                                      : <Box sx={{ width: 36, height: 22, bgcolor: "#F0F0F0", borderRadius: 1 }} />}
                                    {isSpecialist && showReactions && (
                                      <DisagreeToggle active={flagged} onClick={() => toggleDisagree(dKey)} size={24} />
                                    )}
                                  </Stack>
                                </Stack>
                                {showReactions
                                  ? <Typography variant="caption" color="text.secondary" fontSize={10} lineHeight={1.5} display="block">{r.comment}</Typography>
                                  : <Box sx={{ width: "100%", height: 24, bgcolor: "#F8F8F8", borderRadius: 1 }} />}
                              </CardContent>
                            </Card>
                          </Fade>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>

                {/* ── Specialist Review side panel (real doctor flags AI inputs) ── */}
                {isSpecialist && (
                  <Grid item xs={12} md={4}>
                    <Fade in={showReactions}>
                      <Paper variant="outlined" sx={{ borderRadius: 3, p: 2, borderColor: "#E53935", borderTop: "4px solid #E53935", height: "100%", position: "sticky", top: 16 }}>
                        <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                          <Gavel sx={{ color: "#E53935", fontSize: 20 }} />
                          <Typography variant="overline" fontWeight={800} fontSize={11} letterSpacing={1.5}>SPECIALIST REVIEW</Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                          Tap the <Close sx={{ fontSize: 12, verticalAlign: "middle", color: "#E53935" }} /> on any AI judge's score for <strong>{currentSpeaker.name}</strong> to flag your disagreement.
                        </Typography>
                        {(() => {
                          const roundFlags = otherPanelists.filter(j => disagreements[disagreeKey("peer", currentSpeaker.id, j.id)]);
                          if (roundFlags.length === 0) {
                            return <Typography variant="caption" color="text.disabled" fontStyle="italic">No disagreements flagged this round.</Typography>;
                          }
                          return (
                            <Stack spacing={1}>
                              {roundFlags.map(j => (
                                <Stack key={j.id} direction="row" spacing={1} alignItems="center" sx={{ bgcolor: "#FFEBEE", borderRadius: 1.5, px: 1, py: 0.5 }}>
                                  <Close sx={{ fontSize: 14, color: "#E53935" }} />
                                  <Typography fontSize={11} fontWeight={700} flex={1} noWrap>{j.name}</Typography>
                                  <Button size="small" onClick={() => toggleDisagree(disagreeKey("peer", currentSpeaker.id, j.id))} sx={{ minWidth: 0, p: 0.25, fontSize: 10, color: "text.secondary" }}>undo</Button>
                                </Stack>
                              ))}
                            </Stack>
                          );
                        })()}
                        {disagreeCount > 0 && (
                          <Typography variant="caption" color="text.disabled" display="block" mt={1.5}>
                            {disagreeCount} total flag{disagreeCount === 1 ? "" : "s"} this session.
                          </Typography>
                        )}
                      </Paper>
                    </Fade>
                  </Grid>
                )}
              </Grid>

              {/* ── Score Reveal ── */}
              {!scoresRevealed ? (
                <Button
                  variant="contained" size="large" fullWidth
                  onClick={() => setScoresRevealed(true)}
                  sx={{ py: 1.75, fontWeight: 800, fontSize: 15, background: "linear-gradient(90deg, #F57F17, #FF8F00)", "&:hover": { background: "linear-gradient(90deg, #E65100, #F57F17)" } }}
                >
                  🎯 Reveal {currentSpeaker.name}'s Final Score
                </Button>
              ) : (
                <Fade in>
                  <Box>
                    {/* Big score card */}
                    <Card sx={{ background: "linear-gradient(135deg, #0D0D1A, #1A1A3E)", borderRadius: 3, p: 3, textAlign: "center", mb: 2 }}>
                      <Typography variant="overline" color="rgba(255,255,255,0.5)" letterSpacing={3} fontSize={11}>FINAL SCORE</Typography>
                      <Typography variant="h1" fontWeight={900} color={roundScore >= 9 ? "#FFD700" : roundScore >= 8 ? "#81C784" : "#EF9A9A"} lineHeight={1} sx={{ fontSize: "5rem" }}>
                        {roundScore}
                      </Typography>
                      <Typography color="rgba(255,255,255,0.5)" fontWeight={700} fontSize={16} mb={1.5}>/ 10</Typography>
                      <Typography fontSize={22} mb={0.5}>{reaction.emoji}</Typography>
                      <Typography fontWeight={700} color="white" fontSize={14}>{reaction.text}</Typography>
                      {/* Bar of all judge scores */}
                      <Stack direction="row" spacing={0.75} justifyContent="center" flexWrap="wrap" mt={2}>
                        {otherPanelists.map(r => {
                          const sc = getLLMPeerScore(r.id, currentSpeaker.id, questionIdx).score;
                          return <Chip key={r.id} label={`${r.name} ${sc}`} size="small" sx={{ bgcolor: r.color + "33", color: "white", fontSize: 10 }} />;
                        })}
                      </Stack>
                    </Card>

                    <Button
                      variant="contained" size="large" fullWidth endIcon={<ArrowForward />}
                      onClick={nextSpeaker}
                      sx={{ py: 1.75, fontWeight: 800, fontSize: 15 }}
                    >
                      {isLastSpeaker ? "🏆 See Final Results" : `Round ${speakerIdx + 2}: Next Contestant →`}
                    </Button>
                  </Box>
                </Fade>
              )}
            </Box>
          </Fade>
        )}
      </Box>
    );
  }

  /* ── SUMMARY / PODIUM PHASE ───────────────────── */
  if (phase === "summary") {
    const sorted = [...panelists].sort((a, b) => (speakerFinalScores[b.id] ?? 0) - (speakerFinalScores[a.id] ?? 0));
    const winner = sorted[0];
    const podiumEmoji = ["🥇","🥈","🥉"];

    return (
      <Box>
        {/* Winner announcement */}
        <Box sx={{ background: "linear-gradient(135deg, #0D0D1A, #1A1A3E, #0F3460)", borderRadius: 3, p: 4, textAlign: "center", mb: 4 }}>
          <Typography variant="overline" color="rgba(255,255,255,0.5)" letterSpacing={3} fontSize={11} display="block">MEDIQ LIVE — FINAL RESULTS</Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.7)" fontWeight={500} mt={1} mb={0.5}>"{question}"</Typography>
          <Typography fontSize={48} mb={0.5}>🏆</Typography>
          <Typography variant="h4" fontWeight={900} color="#FFD700">{winner?.name}</Typography>
          <Typography color="rgba(255,255,255,0.6)" mb={2}>{winner?.title} · Score: <strong style={{ color: "#FFD700" }}>{speakerFinalScores[winner?.id ?? ""] ?? "–"}/10</strong></Typography>
          <Chip label="CHAMPION OF THE NIGHT" sx={{ bgcolor: "#F57F17", color: "white", fontWeight: 800, fontSize: 12, px: 1 }} />
        </Box>

        {/* Podium */}
        <Typography variant="overline" fontWeight={800} fontSize={11} letterSpacing={2} display="block" mb={2}>🏅 FINAL STANDINGS</Typography>
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={isSpecialist ? 8 : 12}>
            <Stack spacing={1.5}>
              {sorted.map((s, rank) => {
                const grad = s.color;
                const score = speakerFinalScores[s.id];
                const isWinner = rank === 0;
                const dKey = disagreeKey("final", s.id, "final");
                const flagged = !!disagreements[dKey];
                return (
                  <Card key={s.id} sx={{ position: "relative", borderRadius: 2, overflow: "hidden", border: flagged ? "2px solid #E53935" : isWinner ? "2px solid #FFD700" : undefined, boxShadow: isWinner && !flagged ? "0 0 20px rgba(255,215,0,0.3)" : undefined }}>
                    {flagged && <DisagreeOverlay />}
                    <Stack direction="row">
                      <Box sx={{ width: 6, bgcolor: grad, flexShrink: 0 }} />
                      <CardContent sx={{ p: 2, flex: 1, position: "relative", zIndex: 1 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography fontSize={28}>{podiumEmoji[rank] ?? `${rank + 1}`}</Typography>
                          <Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{s.logo}</Box>
                          <Box flex={1}>
                            <Typography fontWeight={800} fontSize={15}>{s.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{s.title}</Typography>
                          </Box>
                          <Box textAlign="right">
                            <Typography fontWeight={900} fontSize={28} color={flagged ? "#E53935" : isWinner ? "#F57F17" : "text.primary"} sx={{ textDecoration: flagged ? "line-through" : "none" }}>{score ?? "–"}</Typography>
                            <Typography variant="caption" color="text.disabled">/10</Typography>
                          </Box>
                          {isSpecialist && (
                            <DisagreeToggle active={flagged} onClick={() => toggleDisagree(dKey)} size={30} />
                          )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary" lineHeight={1.65} mt={1.5} fontSize={13}>
                          {(liveAnswers[s.id] ?? s.responses[questionIdx] ?? s.responses[0] ?? "").split(" ").slice(0, 35).join(" ")}…
                        </Typography>
                      </CardContent>
                    </Stack>
                  </Card>
                );
              })}
            </Stack>
          </Grid>

          {/* ── Specialist Review side panel (real doctor flags final standings) ── */}
          {isSpecialist && (
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ borderRadius: 3, p: 2, borderColor: "#E53935", borderTop: "4px solid #E53935", position: "sticky", top: 16 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                  <Gavel sx={{ color: "#E53935", fontSize: 20 }} />
                  <Typography variant="overline" fontWeight={800} fontSize={11} letterSpacing={1.5}>SPECIALIST REVIEW</Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                  Tap the <Close sx={{ fontSize: 12, verticalAlign: "middle", color: "#E53935" }} /> on any AI doctor's final standing to flag your disagreement.
                </Typography>
                {(() => {
                  const finalFlags = sorted.filter(s => disagreements[disagreeKey("final", s.id, "final")]);
                  if (finalFlags.length === 0) {
                    return <Typography variant="caption" color="text.disabled" fontStyle="italic">No final standings flagged.</Typography>;
                  }
                  return (
                    <Stack spacing={1}>
                      {finalFlags.map(s => (
                        <Stack key={s.id} direction="row" spacing={1} alignItems="center" sx={{ bgcolor: "#FFEBEE", borderRadius: 1.5, px: 1, py: 0.5 }}>
                          <Close sx={{ fontSize: 14, color: "#E53935" }} />
                          <Typography fontSize={11} fontWeight={700} flex={1} noWrap>{s.name}</Typography>
                          <Button size="small" onClick={() => toggleDisagree(disagreeKey("final", s.id, "final"))} sx={{ minWidth: 0, p: 0.25, fontSize: 10, color: "text.secondary" }}>undo</Button>
                        </Stack>
                      ))}
                    </Stack>
                  );
                })()}
                {disagreeCount > 0 && (
                  <Typography variant="caption" color="text.disabled" display="block" mt={1.5}>
                    {disagreeCount} total flag{disagreeCount === 1 ? "" : "s"} this session.
                  </Typography>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>

        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>Medical Disclaimer:</strong> All responses are AI-generated educational simulations. Not professional medical advice.
        </Alert>

        <Stack direction="row" spacing={2}>
          <Button variant="outlined" color="success" startIcon={<Refresh />} onClick={() => { setSpeakerIdx(0); setShowReactions(false); setScoresRevealed(false); setSpeakerFinalScores({}); setDisagreements({}); setPhase("question"); }}>
            Play Again
          </Button>
          <Button variant="contained" startIcon={<Groups />} onClick={reset}>
            New Panel
          </Button>
        </Stack>
      </Box>
    );
  }

  return null;
}
