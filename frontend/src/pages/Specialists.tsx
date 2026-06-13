import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Skeleton,
  LinearProgress,
  Tooltip,
  Rating,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Search, VerifiedUser, ArrowForward, WorkspacePremium, LinkedIn, Star, TravelExplore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api, { SpecialistProfile } from "../api/client";
import { SmartToy } from "@mui/icons-material";
import SpecialistOverviewModal from "../components/SpecialistOverviewModal";
import { useAuth } from "../contexts/AuthContext";

const badgeConfig = {
  distinguished: { color: "#E53935", label: "Distinguished" },
  elevated: { color: "#1565C0", label: "Elevated" },
  standard: { color: "#616161", label: "Standard" },
};

export default function Specialists() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [specialists, setSpecialists] = useState<SpecialistProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [enriching, setEnriching] = useState(false);
  const [enrichMsg, setEnrichMsg] = useState<{ msg: string; ok: boolean } | null>(null);

  const canEnrich = user?.role === "specialist" || user?.role === "admin";

  const loadSpecialists = () =>
    api.get<SpecialistProfile[]>("/specialists").then((r) => setSpecialists(r.data)).finally(() => setLoading(false));

  useEffect(() => { loadSpecialists(); }, []);

  const handleEnrich = async () => {
    setEnriching(true);
    setEnrichMsg(null);
    try {
      const res = await api.post("/specialists/enrich");
      setEnrichMsg({
        msg: `Enriched ${res.data.updated} specialist(s) with live web data (${res.data.skipped} unchanged).`,
        ok: true,
      });
      await loadSpecialists();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error || "Enrichment failed";
      setEnrichMsg({ msg, ok: false });
    } finally {
      setEnriching(false);
    }
  };

  const filtered = specialists.filter((s) => {
    const q = search.toLowerCase();
    return !q || s.fullName?.toLowerCase().includes(q) || s.specialty?.toLowerCase().includes(q) || s.institution?.toLowerCase().includes(q);
  });

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={0.5}>Specialist Directory</Typography>
      <Typography color="text.secondary" mb={4}>Connect with verified medical specialists ranked by real-world impact</Typography>

      <TextField
        placeholder="Search by name, specialty or institution..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><Search color="action" /></InputAdornment> }}
        sx={{ mb: 4, maxWidth: 500 }}
        size="small"
        fullWidth
      />

      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}><Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} /></Grid>
            ))
          : filtered.map((s) => {
              const rs = s.rankingScore;
              const total = rs ? Number(rs.totalScore) : 0;
              const badge = rs?.badge ?? "standard";
              const cfg = badgeConfig[badge];

              return (
                <Grid item xs={12} sm={6} md={4} key={s.id}>
                  <Card onClick={() => setSelectedId(s.id)} sx={{ height: "100%", display: "flex", flexDirection: "column", transition: "transform 0.2s", cursor: "pointer", "&:hover": { transform: "translateY(-3px)" } }}>
                    <Box sx={{ height: 4, bgcolor: cfg.color }} />
                    <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                      <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
                        <Avatar sx={{ bgcolor: cfg.color, width: 52, height: 52, fontSize: 20, fontWeight: 700 }}>
                          {s.fullName?.charAt(0)}
                        </Avatar>
                        <Box flex={1} minWidth={0}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Typography fontWeight={700} noWrap>{s.fullName}</Typography>
                            {s.verified && <Tooltip title="Verified Specialist"><VerifiedUser sx={{ fontSize: 16, color: "success.main" }} /></Tooltip>}
                          </Stack>
                          <Typography variant="caption" color="text.secondary" display="block">{s.specialty}</Typography>
                          {s.institution && <Typography variant="caption" color="text.disabled" display="block" noWrap>{s.institution}</Typography>}
                        </Box>
                      </Stack>

                      {s.credentials && (
                        <Chip label={s.credentials} size="small" sx={{ mb: 1.5, fontSize: 10, bgcolor: "#EBF2FF", color: "primary.main", fontWeight: 600 }} />
                      )}

                      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        {s.googleRating > 0 && (
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Rating value={Number(s.googleRating)} precision={0.1} size="small" readOnly />
                            <Typography variant="caption" fontWeight={700}>{Number(s.googleRating).toFixed(1)}</Typography>
                            <Typography variant="caption" color="text.secondary">({s.googleReviewCount})</Typography>
                          </Stack>
                        )}
                        {s.linkedinConnections > 0 && (
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <LinkedIn sx={{ fontSize: 14, color: "#0077B5" }} />
                            <Typography variant="caption" color="text.secondary">{s.linkedinConnections}</Typography>
                          </Stack>
                        )}
                      </Stack>

                      <Box mb={2}>
                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <WorkspacePremium sx={{ fontSize: 14, color: cfg.color }} />
                            <Typography variant="caption" fontWeight={700} color={cfg.color}>{cfg.label}</Typography>
                          </Stack>
                          <Typography variant="caption" fontWeight={800} color={cfg.color}>{total.toFixed(0)} pts</Typography>
                        </Stack>
                        <LinearProgress variant="determinate" value={Math.min((total / 500) * 100, 100)}
                          sx={{ height: 6, borderRadius: 3, bgcolor: cfg.color + "20", "& .MuiLinearProgress-bar": { bgcolor: cfg.color, borderRadius: 3 } }} />
                      </Box>

                      {rs && (
                        <Stack direction="row" spacing={1} mb={2}>
                          <Chip icon={<Star sx={{ fontSize: 12 }} />} label={`${rs.curationPoints} curation`} size="small" sx={{ fontSize: 10, bgcolor: "#EBF2FF", color: "primary.main" }} />
                          <Chip label={`${rs.activityPoints} activity`} size="small" sx={{ fontSize: 10, bgcolor: "#E8F5E9", color: "success.main" }} />
                        </Stack>
                      )}

                      <Button variant="outlined" size="small" color="secondary" startIcon={<SmartToy />} fullWidth
                        onClick={(e) => { e.stopPropagation(); navigate("/virtual-panel"); }}
                        sx={{ mb: 1 }}
                      >
                        Ask the Virtual Panel
                      </Button>
                      <Button variant="outlined" size="small" endIcon={<ArrowForward />} fullWidth onClick={(e) => { e.stopPropagation(); setSelectedId(s.id); }}>
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}

        {!loading && filtered.length === 0 && (
          <Grid item xs={12}><Box textAlign="center" py={8}><Typography color="text.secondary">No specialists found.</Typography></Box></Grid>
        )}
      </Grid>

      <SpecialistOverviewModal specialistId={selectedId} onClose={() => setSelectedId(null)} />
    </Box>
  );
}
