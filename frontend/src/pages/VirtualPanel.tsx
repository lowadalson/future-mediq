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
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import api, { SpecialistProfile } from "../api/client";
import {
  GUT_QUESTIONS, getResponse, getReaction, getAllQuestions, getLLMCommentaries,
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

export default function VirtualPanel() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>("setup");
  const [allSpecialists, setAllSpecialists] = useState<SpecialistProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelIds, setPanelIds] = useState<string[]>([]);
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

  // Derived state — must be before useEffects that reference them
  const panelists = allSpecialists.filter(s => panelIds.includes(s.id));
  const currentSpeaker = panelists[speakerIdx] ?? null;
  const otherPanelists = panelists.filter((_, i) => i !== speakerIdx);
  const isLastSpeaker = speakerIdx === panelists.length - 1;
  const responseText = currentSpeaker ? getResponse(currentSpeaker.specialty ?? "", questionIdx) : "";

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

  useEffect(() => {
    api.get<SpecialistProfile[]>("/specialists")
      .then(r => { setAllSpecialists(r.data); setPanelIds(r.data.map(s => s.id)); })
      .finally(() => setLoading(false));
  }, []);

  const { displayed, done } = useTypewriter(
    phase === "panel" ? responseText : "", 14
  );

  useEffect(() => {
    if (done) setShowReactions(true);
  }, [done]);

  function computeRoundScore(speaker: SpecialistProfile, others: SpecialistProfile[], qIdx: number): number {
    const llms = getLLMCommentaries(qIdx);
    const peerScores = others.map(r => getReaction(r.specialty ?? "", speaker.specialty ?? "", qIdx).score * 2);
    const llmScores = llms.map(l => l.score);
    const all = [...peerScores, ...llmScores];
    if (all.length === 0) return 8.0;
    return +(all.reduce((a, b) => a + b, 0) / all.length).toFixed(1);
  }

  function audienceReaction(score: number): { text: string; color: string; bg: string; emoji: string } {
    if (score >= 9.0) return { emoji: "🔥🔥🔥", text: "STANDING OVATION! The crowd is absolutely wild!", color: "#B71C1C", bg: "#FFF5F5" };
    if (score >= 8.5) return { emoji: "🔥👏", text: "Incredible answer! The judges leap to their feet!", color: "#C62828", bg: "#FFF8F5" };
    if (score >= 8.0) return { emoji: "👏👏", text: "Strong showing — the panel is clearly impressed!", color: "#1B5E20", bg: "#F1F8F1" };
    if (score >= 7.0) return { emoji: "👍", text: "Solid response. The judges nod in approval.", color: "#1565C0", bg: "#F0F4FF" };
    return { emoji: "🤔", text: "Interesting take. The judges have mixed reactions.", color: "#E65100", bg: "#FFF8F0" };
  }

  function getHostIntro(idx: number, total: number, speaker: SpecialistProfile): string {
    const name = speaker.fullName?.split(" ").pop() ?? speaker.fullName ?? "our specialist";
    const spec = speaker.specialty ?? "medicine";
    if (idx === 0) return `Welcome to MediQ Live — Gut Health Edition! 🎙️ Our first contestant is Dr. ${name} from ${spec}. The gut health gauntlet BEGINS!`;
    if (idx === total - 1) return `We've reached the FINAL round! 🏁 The leaderboard is tight. Can Dr. ${name} from ${spec} steal the crown? Let's find out!`;
    return `Round ${idx + 1} is underway! 🎙️ The crowd gives a warm welcome to Dr. ${name} from ${spec}. Can they top the leaderboard?`;
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
  }

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress size={48} />
    </Box>
  );

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

      <Typography variant="h6" fontWeight={700} mb={2}>Assemble Your Panel</Typography>
      <Grid container spacing={2} mb={4}>
        {allSpecialists.map(s => {
          const selected = panelIds.includes(s.id);
          const badgeColor = BADGE_COLOR[s.rankingScore?.badge ?? "standard"];
          return (
            <Grid item xs={12} sm={6} md={4} key={s.id}>
              <Card
                onClick={() => setPanelIds(ids =>
                  ids.includes(s.id) ? ids.filter(x => x !== s.id) : [...ids, s.id]
                )}
                sx={{
                  cursor: "pointer", border: "2px solid",
                  borderColor: selected ? "primary.main" : "divider",
                  bgcolor: selected ? "#EEF4FF" : "background.paper",
                  transition: "all 0.15s",
                  "&:hover": { borderColor: "primary.main" },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ position: "relative" }}>
                      <Avatar sx={{ bgcolor: badgeColor, width: 48, height: 48, fontWeight: 700 }}>
                        {s.fullName?.charAt(0)}
                      </Avatar>
                      {selected && (
                        <CheckCircle sx={{ position: "absolute", bottom: -4, right: -4, fontSize: 18, color: "primary.main", bgcolor: "white", borderRadius: "50%" }} />
                      )}
                    </Box>
                    <Box flex={1} minWidth={0}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography fontWeight={700} noWrap fontSize={14}>{s.fullName}</Typography>
                        {s.verified && <VerifiedUser sx={{ fontSize: 14, color: "success.main" }} />}
                      </Stack>
                      <Typography variant="caption" color="text.secondary">{s.specialty}</Typography>
                      <Stack direction="row" spacing={0.5} mt={0.5}>
                        <SmartToy sx={{ fontSize: 12, color: "primary.main" }} />
                        <Typography variant="caption" color="primary.main" fontWeight={600}>Virtual AI Active</Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>{panelIds.length} specialist{panelIds.length !== 1 ? "s" : ""} selected.</strong> Virtual AI responses are educational simulations based on specialist profiles. Not a substitute for professional medical advice.
      </Alert>

      <Button
        variant="contained" size="large" endIcon={<ArrowForward />}
        disabled={panelIds.length === 0}
        onClick={() => setPhase("question")}
        sx={{ px: 4, py: 1.5, fontWeight: 700 }}
      >
        Choose a Question →
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
          Each specialist will answer from their unique clinical lens. {!user && <><strong>Sign in</strong> to ask a custom question.</>}
        </Typography>

        <Box mb={3}>
          <Typography variant="overline" fontWeight={700} color="success.dark" fontSize={10} mb={1.5} display="block">
            🔬 Top 10 Gut Health Questions
          </Typography>
          <Stack spacing={1}>
            {GUT_QUESTIONS.map((q, idx) => (
              <Paper
                key={q} variant="outlined"
                onClick={() => startPanel(q, panelists[0]?.specialty ?? "Gut Health", idx)}
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
                onClick={() => startPanel(customQ.trim(), panelists[0]?.specialty ?? "General", 0)}
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
    const grad = gradientFor(currentSpeaker.specialty ?? "");
    const llmJudges = getLLMCommentaries(questionIdx);
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
                  <Tooltip key={s.id} title={`${s.fullName}${speakerFinalScores[s.id] ? ` · ${speakerFinalScores[s.id]}/10` : ""}`}>
                    <Box sx={{ position: "relative" }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: 12, fontWeight: 700,
                        bgcolor: i === speakerIdx ? BADGE_COLOR[s.rankingScore?.badge ?? "standard"] : i < speakerIdx ? "#4CAF50" : "#E0E0E0",
                        border: i === speakerIdx ? "2px solid #1565C0" : "none",
                      }}>
                        {i < speakerIdx && speakerFinalScores[s.id] ? <EmojiEvents sx={{ fontSize: 14 }} /> : s.fullName?.charAt(0)}
                      </Avatar>
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
              <Box sx={{ background: grad, px: 3, pt: 3, pb: 4 }}>
                <Stack direction="row" spacing={2.5} alignItems="center">
                  <Box sx={{ position: "relative", flexShrink: 0 }}>
                    {!done && <Box sx={{ position: "absolute", inset: -8, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.5)", animation: "ap1 1.6s ease-in-out infinite", "@keyframes ap1": { "0%,100%": { transform: "scale(1)", opacity: 0.7 }, "50%": { transform: "scale(1.12)", opacity: 0.1 } } }} />}
                    {!done && <Box sx={{ position: "absolute", inset: -4, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", animation: "ap2 1.6s ease-in-out infinite 0.4s", "@keyframes ap2": { "0%,100%": { transform: "scale(1)", opacity: 0.5 }, "50%": { transform: "scale(1.07)", opacity: 0.08 } } }} />}
                    <Avatar sx={{ width: 80, height: 80, bgcolor: "rgba(255,255,255,0.18)", border: "3px solid rgba(255,255,255,0.55)", fontSize: 28, fontWeight: 900, boxShadow: done ? "none" : "0 0 24px rgba(255,255,255,0.3)", transition: "box-shadow 0.4s" }}>
                      {currentSpeaker.fullName?.charAt(0)}
                    </Avatar>
                    <Box sx={{ position: "absolute", bottom: -2, right: -2, width: 26, height: 26, borderRadius: "50%", bgcolor: "rgba(0,0,0,0.75)", border: "2px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <SmartToy sx={{ fontSize: 14, color: "#90CAF9" }} />
                    </Box>
                  </Box>
                  <Box flex={1}>
                    <Stack direction="row" spacing={0.75} alignItems="center" mb={0.25}>
                      <Typography variant="h6" fontWeight={800} color="white">{currentSpeaker.fullName}</Typography>
                      {currentSpeaker.verified && <VerifiedUser sx={{ color: "rgba(255,255,255,0.85)", fontSize: 18 }} />}
                    </Stack>
                    <Typography color="rgba(255,255,255,0.8)" fontSize={13} mb={0.75}>{currentSpeaker.specialty} · {currentSpeaker.institution ?? "Independent"}</Typography>
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, bgcolor: "rgba(0,0,0,0.35)", borderRadius: 10, px: 1.25, py: 0.4, border: "1px solid rgba(144,202,249,0.4)" }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: done ? "rgba(255,255,255,0.4)" : "#69F0AE", animation: done ? "none" : "dot 1s step-end infinite", "@keyframes dot": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.2 } } }} />
                      <Typography variant="caption" color="#90CAF9" fontWeight={700} fontSize={10} letterSpacing={0.5}>
                        {done ? "VIRTUAL AI · ANSWER LOCKED IN" : "VIRTUAL AI · SPEAKING…"}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              {/* Response body */}
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <RecordVoiceOver sx={{ color: "primary.main", fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={700} color="primary.main">{done ? "Answer locked in" : "Speaking…"}</Typography>
                  {!done && <CircularProgress size={14} thickness={5} />}
                </Stack>
                <Typography variant="body1" lineHeight={1.8} color="text.primary" sx={{ minHeight: 120 }}>
                  {displayed}
                  {!done && <Box component="span" sx={{ display: "inline-block", width: 2, height: "1em", bgcolor: "primary.main", ml: 0.5, animation: "blink 0.8s step-end infinite", "@keyframes blink": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0 } } }} />}
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
                  const sGrad = gradientFor(s.specialty ?? "");
                  const rankEmoji = ["🥇","🥈","🥉"][i] ?? `${i+1}.`;
                  return (
                    <Box key={s.id} sx={{ bgcolor: isCurr ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)", borderRadius: 2, px: 2, py: 1.25, border: isCurr ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.06)" }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, fontSize: 12, fontWeight: 700, background: isPend ? "rgba(255,255,255,0.1)" : sGrad }}>
                          {s.fullName?.charAt(0)}
                        </Avatar>
                        <Box flex={1} minWidth={0}>
                          <Typography color={isPend ? "rgba(255,255,255,0.35)" : "white"} fontWeight={700} fontSize={12} noWrap>{s.fullName?.split(" ").pop()}</Typography>
                          <Typography color="rgba(255,255,255,0.4)" fontSize={10}>{s.specialty}</Typography>
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
        {done && (
          <Fade in>
            <Box mt={4}>
              <Divider sx={{ mb: 3 }} />

              {/* Specialist judge reactions */}
              {otherPanelists.length > 0 && (
                <Box mb={3}>
                  <Typography variant="overline" fontWeight={800} fontSize={11} letterSpacing={2} display="block" mb={1.5}>
                    ⚖️ SPECIALIST JUDGES
                  </Typography>
                  <Grid container spacing={1.5}>
                    {otherPanelists.map(reactor => {
                      const r = getReaction(reactor.specialty ?? "", currentSpeaker.specialty ?? "", questionIdx);
                      const rColor = BADGE_COLOR[reactor.rankingScore?.badge ?? "standard"];
                      return (
                        <Grid item xs={12} sm={6} key={reactor.id}>
                          <Fade in={showReactions}>
                            <Card variant="outlined" sx={{ borderRadius: 2 }}>
                              <CardContent sx={{ p: 1.75, "&:last-child": { pb: 1.75 } }}>
                                <Stack direction="row" spacing={1} alignItems="center" mb={0.75}>
                                  <Box sx={{ position: "relative", flexShrink: 0 }}>
                                    <Avatar sx={{ bgcolor: rColor, width: 34, height: 34, fontSize: 13, fontWeight: 700 }}>{reactor.fullName?.charAt(0)}</Avatar>
                                    <Box sx={{ position: "absolute", bottom: -2, right: -2, width: 14, height: 14, borderRadius: "50%", bgcolor: "#1A237E", border: "1.5px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                      <SmartToy sx={{ fontSize: 9, color: "#90CAF9" }} />
                                    </Box>
                                  </Box>
                                  <Box flex={1} minWidth={0}>
                                    <Typography variant="caption" fontWeight={700} noWrap>{reactor.fullName?.split(" ").pop()} <Typography component="span" variant="caption" color="text.disabled">· {reactor.specialty}</Typography></Typography>
                                  </Box>
                                  <Stack alignItems="flex-end">
                                    {showReactions ? (
                                      <>
                                        <Rating value={r.score} precision={0.5} size="small" readOnly sx={{ fontSize: 14 }} />
                                        <Typography variant="caption" fontWeight={800} color="primary.main">{(r.score * 2).toFixed(1)}/10</Typography>
                                      </>
                                    ) : <Box sx={{ width: 60, height: 20, bgcolor: "#F0F0F0", borderRadius: 1 }} />}
                                  </Stack>
                                </Stack>
                                {showReactions
                                  ? <Typography variant="caption" color="text.secondary" lineHeight={1.5}>{r.comment}</Typography>
                                  : <Box sx={{ width: "100%", height: 24, bgcolor: "#F8F8F8", borderRadius: 1 }} />}
                              </CardContent>
                            </Card>
                          </Fade>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              )}

              {/* AI Model Judges with scores */}
              <Typography variant="overline" fontWeight={800} fontSize={11} letterSpacing={2} display="block" mb={1.5}>
                🤖 AI MODEL JUDGES
              </Typography>
              <Grid container spacing={1.5} mb={3}>
                {llmJudges.map((llm, i) => (
                  <Grid item xs={6} sm={4} key={llm.id}>
                    <Fade in={showReactions} style={{ transitionDelay: `${i * 70}ms` }}>
                      <Card variant="outlined" sx={{ borderLeft: `4px solid ${llm.color}`, bgcolor: llm.bgColor, borderRadius: 2 }}>
                        <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                            <Stack direction="row" spacing={0.75} alignItems="center">
                              <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: llm.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white", fontWeight: 800, flexShrink: 0 }}>{llm.logo}</Box>
                              <Typography fontWeight={800} fontSize={12}>{llm.name}</Typography>
                            </Stack>
                            <Typography fontWeight={900} fontSize={18} color={llm.color}>{llm.score}</Typography>
                          </Stack>
                          <Typography variant="caption" color="text.secondary" fontSize={10} lineHeight={1.5} display="block">
                            {llm.comment.split(" ").slice(0, 16).join(" ")}…
                          </Typography>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>

              {/* ── Score Reveal ── */}
              {!scoresRevealed ? (
                <Button
                  variant="contained" size="large" fullWidth
                  onClick={() => setScoresRevealed(true)}
                  sx={{ py: 1.75, fontWeight: 800, fontSize: 15, background: "linear-gradient(90deg, #F57F17, #FF8F00)", "&:hover": { background: "linear-gradient(90deg, #E65100, #F57F17)" } }}
                >
                  🎯 Reveal {currentSpeaker.fullName?.split(" ").pop()}'s Final Score
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
                          const sc = getReaction(r.specialty ?? "", currentSpeaker.specialty ?? "", questionIdx).score * 2;
                          return <Chip key={r.id} label={`${r.fullName?.split(" ").pop()} ${sc.toFixed(1)}`} size="small" sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "white", fontSize: 10 }} />;
                        })}
                        {llmJudges.map(llm => (
                          <Chip key={llm.id} label={`${llm.name} ${llm.score}`} size="small" sx={{ bgcolor: llm.color + "33", color: "white", fontSize: 10 }} />
                        ))}
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
          <Typography variant="h4" fontWeight={900} color="#FFD700">{winner?.fullName}</Typography>
          <Typography color="rgba(255,255,255,0.6)" mb={2}>{winner?.specialty} · Score: <strong style={{ color: "#FFD700" }}>{speakerFinalScores[winner?.id ?? ""] ?? "–"}/10</strong></Typography>
          <Chip label="CHAMPION OF THE NIGHT" sx={{ bgcolor: "#F57F17", color: "white", fontWeight: 800, fontSize: 12, px: 1 }} />
        </Box>

        {/* Podium */}
        <Typography variant="overline" fontWeight={800} fontSize={11} letterSpacing={2} display="block" mb={2}>🏅 FINAL STANDINGS</Typography>
        <Stack spacing={1.5} mb={4}>
          {sorted.map((s, rank) => {
            const grad = gradientFor(s.specialty ?? "");
            const score = speakerFinalScores[s.id];
            const isWinner = rank === 0;
            return (
              <Card key={s.id} sx={{ borderRadius: 2, overflow: "hidden", border: isWinner ? "2px solid #FFD700" : undefined, boxShadow: isWinner ? "0 0 20px rgba(255,215,0,0.3)" : undefined }}>
                <Stack direction="row">
                  <Box sx={{ width: 6, background: grad, flexShrink: 0 }} />
                  <CardContent sx={{ p: 2, flex: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography fontSize={28}>{podiumEmoji[rank] ?? `${rank + 1}`}</Typography>
                      <Avatar sx={{ background: grad, width: 48, height: 48, fontWeight: 700, fontSize: 18 }}>{s.fullName?.charAt(0)}</Avatar>
                      <Box flex={1}>
                        <Typography fontWeight={800} fontSize={15}>{s.fullName}</Typography>
                        <Typography variant="caption" color="text.secondary">{s.specialty}</Typography>
                      </Box>
                      <Box textAlign="right">
                        <Typography fontWeight={900} fontSize={28} color={isWinner ? "#F57F17" : "text.primary"}>{score ?? "–"}</Typography>
                        <Typography variant="caption" color="text.disabled">/10</Typography>
                      </Box>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.65} mt={1.5} fontSize={13}>
                      {getResponse(s.specialty ?? "", questionIdx).split(" ").slice(0, 35).join(" ")}…
                    </Typography>
                  </CardContent>
                </Stack>
              </Card>
            );
          })}
        </Stack>

        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>Medical Disclaimer:</strong> All responses are AI-generated educational simulations. Not professional medical advice.
        </Alert>

        <Stack direction="row" spacing={2}>
          <Button variant="outlined" color="success" startIcon={<Refresh />} onClick={() => { setSpeakerIdx(0); setShowReactions(false); setScoresRevealed(false); setSpeakerFinalScores({}); setPhase("question"); }}>
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
