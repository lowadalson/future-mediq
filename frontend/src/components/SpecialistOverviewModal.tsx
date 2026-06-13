import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, Box, Typography, Stack, Avatar, Chip,
  Button, Divider, LinearProgress, Rating, Tooltip, IconButton,
  CircularProgress, Grid,
} from "@mui/material";
import {
  Close, VerifiedUser, Business, LocationOn, LinkedIn,
  WorkspacePremium, CalendarMonth, People, ArrowForward, Star, SmartToy,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api, { SpecialistProfile } from "../api/client";

const badgeConfig = {
  distinguished: { color: "#E53935", label: "Distinguished", bg: "linear-gradient(135deg, #E53935 0%, #B71C1C 100%)" },
  elevated: { color: "#1565C0", label: "Elevated", bg: "linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)" },
  standard: { color: "#616161", label: "Standard", bg: "linear-gradient(135deg, #616161 0%, #424242 100%)" },
};

const activityColors: Record<string, string> = {
  clinic: "#1565C0", school_visit: "#2E7D32", mentorship: "#6A1B9A",
  webinar: "#E65100", workshop: "#00695C", other: "#616161",
};

const activityLabels: Record<string, string> = {
  clinic: "Clinic", school_visit: "School Visit", mentorship: "Mentorship",
  webinar: "Webinar", workshop: "Workshop", other: "Other",
};

interface Props {
  specialistId: string | null;
  onClose: () => void;
}

export default function SpecialistOverviewModal({ specialistId, onClose }: Props) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<SpecialistProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!specialistId) { setProfile(null); return; }
    setLoading(true);
    api.get<SpecialistProfile>(`/specialists/${specialistId}`)
      .then((r) => setProfile(r.data))
      .finally(() => setLoading(false));
  }, [specialistId]);

  const open = Boolean(specialistId);
  const badge = profile?.rankingScore?.badge ?? "standard";
  const cfg = badgeConfig[badge];
  const total = profile?.rankingScore ? Number(profile.rankingScore.totalScore) : 0;

  const metrics = profile?.rankingScore ? [
    { label: "Curation Points", value: profile.rankingScore.curationPoints, max: 100, color: "#1565C0" },
    { label: "Activity Points", value: profile.rankingScore.activityPoints, max: 500, color: "#2E7D32" },
    { label: "External Score", value: Number(profile.rankingScore.externalScore), max: 30, color: "#F57C00" },
  ] : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}>
      {/* Bright gradient header */}
      <Box sx={{ background: cfg.bg, px: 3, pt: 3, pb: 4, position: "relative" }}>
        <IconButton onClick={onClose} size="small"
          sx={{ position: "absolute", top: 12, right: 12, color: "rgba(255,255,255,0.8)", "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.15)" } }}
        >
          <Close />
        </IconButton>

        {loading ? (
          <Stack alignItems="center" py={3}><CircularProgress sx={{ color: "white" }} /></Stack>
        ) : profile ? (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems={{ sm: "center" }}>
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.25)", width: 80, height: 80, fontSize: 32, fontWeight: 800, border: "3px solid rgba(255,255,255,0.5)" }}>
              {profile.fullName?.charAt(0)}
            </Avatar>
            <Box flex={1}>
              <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                <Typography variant="h5" fontWeight={800} color="white">{profile.fullName}</Typography>
                {profile.verified && (
                  <Tooltip title="Verified Specialist">
                    <VerifiedUser sx={{ color: "rgba(255,255,255,0.9)", fontSize: 20 }} />
                  </Tooltip>
                )}
              </Stack>
              <Typography color="rgba(255,255,255,0.85)" fontWeight={500} mb={1}>{profile.specialty}{profile.subSpecialty ? ` · ${profile.subSpecialty}` : ""}</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {profile.credentials && (
                  <Chip label={profile.credentials} size="small"
                    sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 700, fontSize: 11, border: "1px solid rgba(255,255,255,0.3)" }} />
                )}
                {profile.rankingScore && (
                  <Chip icon={<WorkspacePremium sx={{ fontSize: 14, color: "white !important" }} />}
                    label={`${cfg.label} · ${total.toFixed(0)} pts${profile.rankingScore.rank ? ` · Rank #${profile.rankingScore.rank}` : ""}`}
                    size="small"
                    sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 700, fontSize: 11, border: "1px solid rgba(255,255,255,0.3)" }} />
                )}
              </Stack>
            </Box>
          </Stack>
        ) : null}
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {!loading && profile && (
          <Box>
            <Grid container>
              {/* Left column */}
              <Grid item xs={12} sm={5} sx={{ p: 3, borderRight: { sm: "1px solid" }, borderColor: { sm: "divider" } }}>
                <Typography variant="overline" color="text.secondary" fontWeight={700} fontSize={10}>Contact & Presence</Typography>

                <Stack spacing={1.2} mt={1.5} mb={3}>
                  {profile.institution && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Business sx={{ fontSize: 16, color: "primary.main" }} />
                      <Typography variant="body2" fontWeight={500}>{profile.institution}</Typography>
                    </Stack>
                  )}
                  {profile.location && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationOn sx={{ fontSize: 16, color: "#E53935" }} />
                      <Typography variant="body2">{profile.location}</Typography>
                    </Stack>
                  )}
                  {profile.linkedinConnections > 0 && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LinkedIn sx={{ fontSize: 16, color: "#0077B5" }} />
                      <Typography variant="body2">
                        <strong>{profile.linkedinConnections.toLocaleString()}</strong> LinkedIn connections
                      </Typography>
                    </Stack>
                  )}
                </Stack>

                {profile.googleRating > 0 && (
                  <>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="overline" color="text.secondary" fontWeight={700} fontSize={10}>Google Reviews</Typography>
                    <Box sx={{ mt: 1.5, p: 2, bgcolor: "#FFFDE7", borderRadius: 2, border: "1px solid #FFF176" }}>
                      <Stack alignItems="center" spacing={0.5}>
                        <Typography variant="h4" fontWeight={800} color="#F57C00">{Number(profile.googleRating).toFixed(1)}</Typography>
                        <Rating value={Number(profile.googleRating)} precision={0.1} size="small" readOnly />
                        <Typography variant="caption" color="text.secondary">{profile.googleReviewCount} reviews</Typography>
                      </Stack>
                    </Box>
                  </>
                )}

                {profile.bio && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="overline" color="text.secondary" fontWeight={700} fontSize={10}>Bio</Typography>
                    <Typography variant="body2" color="text.secondary" mt={1} lineHeight={1.6}>{profile.bio}</Typography>
                  </>
                )}

                {profile.activities && profile.activities.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="overline" color="text.secondary" fontWeight={700} fontSize={10}>
                      Activities ({profile.activities.length})
                    </Typography>
                    <Stack spacing={1} mt={1.5}>
                      {profile.activities.slice(0, 3).map((a) => {
                        const aColor = activityColors[a.type] ?? "#616161";
                        return (
                          <Box key={a.id} sx={{ p: 1.5, borderRadius: 1.5, border: "1px solid", borderColor: aColor + "30", bgcolor: aColor + "08" }}>
                            <Stack direction="row" spacing={0.75} alignItems="center" mb={0.5}>
                              <Chip label={activityLabels[a.type] ?? a.type} size="small"
                                sx={{ fontSize: 9, height: 18, bgcolor: aColor + "15", color: aColor, fontWeight: 700 }} />
                              {a.verified && <Chip label="✓" size="small" color="success" sx={{ fontSize: 9, height: 18 }} />}
                            </Stack>
                            <Typography variant="caption" fontWeight={600} display="block">{a.title}</Typography>
                            <Stack direction="row" spacing={1.5} mt={0.5}>
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <CalendarMonth sx={{ fontSize: 11, color: "text.secondary" }} />
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(a.activityDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                                </Typography>
                              </Stack>
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <People sx={{ fontSize: 11, color: "text.secondary" }} />
                                <Typography variant="caption" color="text.secondary">{a.participantsCount}</Typography>
                              </Stack>
                            </Stack>
                          </Box>
                        );
                      })}
                    </Stack>
                  </>
                )}
              </Grid>

              {/* Right column — Ranking */}
              <Grid item xs={12} sm={7} sx={{ p: 3 }}>
                {profile.rankingScore ? (
                  <>
                    <Typography variant="overline" color="text.secondary" fontWeight={700} fontSize={10}>Ranking Score Breakdown</Typography>

                    <Box sx={{ mt: 2, p: 2.5, borderRadius: 2, background: cfg.bg, mb: 3 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="caption" color="rgba(255,255,255,0.7)" fontWeight={600} letterSpacing={1}>TOTAL SCORE</Typography>
                          <Typography variant="h2" fontWeight={900} color="white" lineHeight={1}>{total.toFixed(0)}</Typography>
                          {profile.rankingScore.rank && (
                            <Typography variant="caption" color="rgba(255,255,255,0.8)">Ranked #{profile.rankingScore.rank} overall</Typography>
                          )}
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <WorkspacePremium sx={{ fontSize: 48, color: "rgba(255,255,255,0.4)" }} />
                        </Box>
                      </Stack>
                    </Box>

                    <Stack spacing={2}>
                      {metrics.map((m) => (
                        <Box key={m.label}>
                          <Stack direction="row" justifyContent="space-between" mb={0.75}>
                            <Typography variant="body2" fontWeight={600}>{m.label}</Typography>
                            <Typography variant="body2" fontWeight={800} color={m.color}>{Number(m.value).toFixed(0)}</Typography>
                          </Stack>
                          <LinearProgress variant="determinate" value={Math.min((Number(m.value) / m.max) * 100, 100)}
                            sx={{ height: 10, borderRadius: 5, bgcolor: m.color + "15",
                              "& .MuiLinearProgress-bar": { bgcolor: m.color, borderRadius: 5 } }} />
                          <Typography variant="caption" color="text.disabled">{Number(m.value).toFixed(0)} / {m.max}</Typography>
                        </Box>
                      ))}
                    </Stack>

                    <Box sx={{ mt: 3, p: 2, bgcolor: "#F8F9FA", borderRadius: 2 }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Star sx={{ fontSize: 14, color: "#F57C00" }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          Curation + Activity + (Google × 20 + LinkedIn × 10)
                        </Typography>
                      </Stack>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ py: 4, textAlign: "center" }}>
                    <Typography color="text.secondary">No ranking data available yet.</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>

            <Divider />
            <Box sx={{ px: 3, py: 2, bgcolor: "#F8F9FA" }}>
              <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                <Button onClick={onClose} variant="outlined" size="small">Close</Button>
                <Button
                  variant="outlined" size="small" color="secondary" startIcon={<SmartToy />}
                  onClick={() => { onClose(); navigate("/virtual-panel"); }}
                >
                  Ask the Panel
                </Button>
                <Button
                  variant="contained" size="small" endIcon={<ArrowForward />}
                  onClick={() => { onClose(); navigate(`/specialists/${profile.id}`); }}
                >
                  View Full Profile
                </Button>
              </Stack>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
