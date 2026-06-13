import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Stack,
  Typography,
  Chip,
  Button,
  Fade,
  LinearProgress,
  Alert,
} from "@mui/material";
import {
  AutoAwesome,
  TouchApp,
  Layers,
  Biotech,
  ArrowBack,
  RestartAlt,
  NavigateNext,
} from "@mui/icons-material";
import api from "../api/client";

type Frame = {
  id: number;
  imageUrl: string;
  label: string;
  caption: string;
};

const BASE_FRAME: Frame = {
  id: 0,
  imageUrl: "/gi-system.png",
  label: "Gastrointestinal System",
  caption:
    "The human digestive system is a long, winding tube of hollow organs running from the mouth to the rectum. " +
    "It breaks food down into nutrients the body can absorb for energy, growth, and repair. " +
    "Click any organ to dive in and explore it in detail.",
};

const LOADING_STAGES = [
  "Pinpointing the structure you tapped",
  "Consulting anatomical references",
  "Rendering a detailed illustration",
  "Labelling sub-structures",
  "Bringing your view into focus",
];

// Load an image URL (relative path or data URL) into an HTMLImageElement.
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

// Draw a bright red crosshair marker at the normalized (x, y) point on the
// image and return the composited result as a data URL. Vision models read a
// visible marker far more reliably than percentage coordinates.
async function markImage(url: string, x: number, y: number): Promise<string> {
  const img = await loadImage(url);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return url;

  ctx.drawImage(img, 0, 0);

  const cx = x * canvas.width;
  const cy = y * canvas.height;
  const r = Math.max(canvas.width, canvas.height) * 0.03;

  ctx.strokeStyle = "#ff0000";
  ctx.lineWidth = Math.max(3, r * 0.18);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - r * 1.6, cy);
  ctx.lineTo(cx + r * 1.6, cy);
  ctx.moveTo(cx, cy - r * 1.6);
  ctx.lineTo(cx, cy + r * 1.6);
  ctx.stroke();

  ctx.fillStyle = "#ff0000";
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.22, 0, Math.PI * 2);
  ctx.fill();

  return canvas.toDataURL("image/png");
}

export default function GutSeries() {
  // Navigation stack of frames. stack[stack.length - 1] is the current view.
  // Seeded with a pre-generated base illustration so it shows instantly.
  const [stack, setStack] = useState<Frame[]>([BASE_FRAME]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const [stageIdx, setStageIdx] = useState(0);

  const current = stack[stack.length - 1];
  const depth = stack.length - 1;

  // Cycle the loading stage copy while a generation is in flight.
  useEffect(() => {
    if (!loading) {
      setStageIdx(0);
      return;
    }
    const t = setInterval(() => {
      setStageIdx((i) => Math.min(i + 1, LOADING_STAGES.length - 1));
    }, 3200);
    return () => clearInterval(t);
  }, [loading]);

  async function handleImageClick(e: React.MouseEvent<HTMLImageElement>) {
    if (loading || !current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setOrigin({ x, y });
    setLoading(true);
    setError(null);

    try {
      const imageData = await markImage(current.imageUrl, x, y);
      const { data } = await api.post("/gut-explorer", {
        mode: "drill",
        image: imageData,
        x,
        y,
        parentLabel: current.label,
      });
      if (data.error || !data.imageUrl) {
        setError(data.error || "No image returned by the model.");
        setOrigin(null);
      } else {
        setStack((prev) => [
          ...prev,
          {
            id: Date.now(),
            imageUrl: data.imageUrl,
            label: data.label || "Detail",
            caption: data.caption,
          },
        ]);
        setOrigin(null);
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        (err instanceof Error ? err.message : "Failed to generate image");
      setError(message);
      setOrigin(null);
    } finally {
      setLoading(false);
    }
  }

  function goTo(index: number) {
    setOrigin(null);
    setError(null);
    setStack((prev) => prev.slice(0, index + 1));
  }

  return (
    <Box>
      {/* ── Hero Banner ── */}
      <Box
        sx={{
          borderRadius: 3,
          mb: 3,
          p: { xs: 2.5, md: 3.5 },
          background: "linear-gradient(135deg, #0A1628 0%, #0D3D5F 50%, #00695C 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", bgcolor: "rgba(0,200,180,0.08)" }} />
        <Box sx={{ position: "absolute", bottom: -30, left: "30%", width: 150, height: 150, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.04)" }} />
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Chip
              icon={<AutoAwesome sx={{ fontSize: 16, color: "white !important" }} />}
              label="Generative Anatomy · Live AI"
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "white", mb: 1.5, fontWeight: 700 }}
            />
            <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1.15 }}>
              Interactive Anatomy Explorer
            </Typography>
            <Typography sx={{ opacity: 0.75, mt: 0.5, fontSize: 14, maxWidth: 560 }}>
              Every view is generated on the fly. Tap any organ to dive deeper and the AI renders the
              next layer of detail right in place.
            </Typography>
          </Box>
          {depth > 0 && (
            <Chip
              icon={<Layers sx={{ fontSize: 16, color: "white !important" }} />}
              label={`Layer ${depth}`}
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "white", fontWeight: 700 }}
            />
          )}
        </Stack>

        {/* Breadcrumb trail */}
        <Stack direction="row" spacing={0.5} alignItems="center" mt={2} flexWrap="wrap" useFlexGap>
          {stack.map((f, i) => {
            const isCurrent = i === stack.length - 1;
            return (
              <Stack key={f.id} direction="row" spacing={0.5} alignItems="center">
                {i > 0 && <NavigateNext sx={{ fontSize: 14, opacity: 0.4 }} />}
                <Chip
                  label={f.label}
                  size="small"
                  onClick={!isCurrent && !loading ? () => goTo(i) : undefined}
                  sx={{
                    cursor: isCurrent || loading ? "default" : "pointer",
                    bgcolor: isCurrent ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.12)",
                    color: isCurrent ? "#0A1628" : "rgba(255,255,255,0.8)",
                    fontWeight: isCurrent ? 800 : 500,
                    fontSize: 11,
                    height: 24,
                    transition: "all 0.2s",
                  }}
                />
              </Stack>
            );
          })}
        </Stack>
      </Box>

      {/* ── Main Content ── */}
      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: { xs: "1fr", lg: "1fr 340px" },
          alignItems: "start",
        }}
      >
        {/* Cinematic viewer */}
        <Card sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <Box
            sx={{
              position: "relative",
              aspectRatio: "4 / 3",
              background: "linear-gradient(180deg,#F3F8FF 0%,#EDF7F5 100%)",
            }}
          >
            <Fade key={current.id} in timeout={500}>
              <Box
                component="img"
                src={current.imageUrl}
                alt={current.label}
                onClick={handleImageClick}
                draggable={false}
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  userSelect: "none",
                  cursor: loading ? "wait" : "crosshair",
                }}
              />
            </Fade>

            {/* Ripple at the click point */}
            {loading && origin && (
              <Box
                sx={{
                  position: "absolute",
                  left: `${origin.x * 100}%`,
                  top: `${origin.y * 100}%`,
                  pointerEvents: "none",
                  zIndex: 20,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    transform: "translate(-50%, -50%)",
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    bgcolor: "#00897B",
                    boxShadow: "0 0 0 4px rgba(255,255,255,0.6)",
                  }}
                />
                {[0, 1, 2].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      position: "absolute",
                      transform: "translate(-50%, -50%)",
                      borderRadius: "50%",
                      border: "2px solid #00897B",
                      animation: "gutRipple 1.8s ease-out infinite",
                      animationDelay: `${i * 0.6}s`,
                      "@keyframes gutRipple": {
                        "0%": { width: 16, height: 16, opacity: 0.8 },
                        "100%": { width: 120, height: 120, opacity: 0 },
                      },
                    }}
                  />
                ))}
              </Box>
            )}

            {/* Loading veil + staged status */}
            {loading && (
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 30,
                  px: 2.5,
                  pb: 2.5,
                  pt: 6,
                  background: "linear-gradient(to top, rgba(10,22,40,0.88), transparent)",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: "white" }}>
                  <Biotech sx={{ fontSize: 22, color: "#4DD0C4" }} />
                  <Fade key={stageIdx} in timeout={300}>
                    <Typography variant="body2" fontWeight={600}>
                      {LOADING_STAGES[stageIdx]}…
                    </Typography>
                  </Fade>
                </Stack>
                <LinearProgress
                  sx={{
                    mt: 1.5,
                    height: 4,
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.2)",
                    "& .MuiLinearProgress-bar": { bgcolor: "#4DD0C4" },
                  }}
                />
              </Box>
            )}

            {/* Hint pill */}
            {!loading && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                  pointerEvents: "none",
                }}
              >
                <Chip
                  icon={<TouchApp sx={{ fontSize: 16, color: "#4DD0C4 !important" }} />}
                  label={depth === 0 ? "Click an organ to dive in" : "Keep clicking to go deeper"}
                  size="small"
                  sx={{
                    bgcolor: "rgba(10,22,40,0.8)",
                    color: "white",
                    fontWeight: 600,
                    backdropFilter: "blur(4px)",
                  }}
                />
              </Box>
            )}
          </Box>
        </Card>

        {/* Side panel */}
        <Stack spacing={2}>
          {depth > 0 && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ArrowBack />}
                disabled={loading}
                onClick={() => goTo(depth - 1)}
              >
                Back
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RestartAlt />}
                disabled={loading}
                onClick={() => goTo(0)}
              >
                Reset
              </Button>
            </Stack>
          )}

          <Fade key={current.id} in timeout={500}>
            <Card sx={{ borderRadius: 3, p: 3, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
              <Typography
                variant="caption"
                fontWeight={700}
                sx={{ textTransform: "uppercase", letterSpacing: 2, color: "#F4511E" }}
              >
                {depth === 0 ? "Overview" : `Layer ${depth} · detail`}
              </Typography>
              <Typography variant="h5" fontWeight={800} color="primary.dark" sx={{ mt: 1, lineHeight: 1.2 }}>
                {current.label}
              </Typography>
              <Typography variant="body2" color="text.primary" sx={{ mt: 1.5, lineHeight: 1.75 }}>
                {current.caption || "Click any structure in the image to explore it in more detail."}
              </Typography>
            </Card>
          </Fade>

          <Card variant="outlined" sx={{ borderRadius: 3, borderStyle: "dashed", bgcolor: "#F7FAFA", p: 2 }}>
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <AutoAwesome sx={{ fontSize: 16, color: "#00897B", mt: 0.25 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Each illustration is generated in real time by a multimodal model. No two journeys
                are ever identical.
              </Typography>
            </Stack>
          </Card>
        </Stack>
      </Box>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          sx={{ mt: 2.5, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => setError(null)}>
              Dismiss
            </Button>
          }
        >
          {error}
        </Alert>
      )}
    </Box>
  );
}
