import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Skeleton,
  IconButton,
  Tooltip,
  Button,
  Alert,
} from "@mui/material";
import {
  Search,
  YouTube,
  OpenInNew,
  ThumbUp,
  ThumbDown,
  Visibility,
  AutoAwesome,
  HourglassEmpty,
  CheckCircle,
} from "@mui/icons-material";
import api, { ContentItem } from "../api/client";
import { useAuth } from "../contexts/AuthContext";

const statusConfig = {
  approved: { color: "success" as const, icon: <CheckCircle sx={{ fontSize: 14 }} />, label: "Approved" },
  pending: { color: "warning" as const, icon: <HourglassEmpty sx={{ fontSize: 14 }} />, label: "Pending" },
  rejected: { color: "error" as const, icon: <ThumbDown sx={{ fontSize: 14 }} />, label: "Rejected" },
  flagged: { color: "error" as const, icon: <ThumbDown sx={{ fontSize: 14 }} />, label: "Flagged" },
};

const ageLabels: Record<string, string> = {
  "all": "All Ages", "7-10": "Ages 7-10", "11-14": "Ages 11-14", "15-18": "Ages 15-18",
};

const specialties = ["All", "cardiology", "neurology", "oncology", "paediatrics", "surgery", "radiology", "dermatology", "emergency", "psychiatry"];

export default function KnowledgeUniverse() {
  const { user } = useAuth();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("approved");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedAge, setSelectedAge] = useState("all");
  const [voting, setVoting] = useState<string | null>(null);
  const [voteMsg, setVoteMsg] = useState<{ id: string; msg: string; ok: boolean } | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fetchMsg, setFetchMsg] = useState<{ msg: string; ok: boolean } | null>(null);

  const isSpecialist = user?.role === "specialist";

  const handleGutSearch = async () => {
    setFetching(true);
    setFetchMsg(null);
    try {
      const res = await api.post("/knowledge/gut-search");
      setFetchMsg({ msg: `Added ${res.data.added} new gut item(s) (${res.data.skipped} already existed).`, ok: true });
      fetchContent();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error || "Gut search failed";
      setFetchMsg({ msg, ok: false });
    } finally {
      setFetching(false);
    }
  };

  const fetchContent = () => {
    const params: Record<string, string> = { status };
    if (selectedSpecialty !== "All") params.specialty = selectedSpecialty;
    if (selectedAge !== "all") params.age = selectedAge;
    if (search) params.q = search;
    setLoading(true);
    api.get<ContentItem[]>("/content", { params })
      .then((r) => setContent(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchContent(); }, [status, selectedSpecialty, selectedAge, search]);

  const handleVote = async (contentId: string, vote: "approve" | "reject") => {
    setVoting(contentId);
    try {
      const res = await api.post(`/content/${contentId}/vote`, { vote });
      setVoteMsg({ id: contentId, msg: `Vote recorded! Status: ${res.data.status}`, ok: true });
      fetchContent();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error || "Vote failed";
      setVoteMsg({ id: contentId, msg, ok: false });
    } finally {
      setVoting(null);
    }
  };

  return (
    <Box>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "flex-start" }} spacing={1} mb={0.5}>
        <Box>
          <Typography variant="h4" fontWeight={700} mb={0.5}>
            Knowledge Universe
          </Typography>
          <Typography color="text.secondary">
            AI-curated YouTube and video content, reviewed and approved by verified medical specialists
          </Typography>
        </Box>
        {isSpecialist && (
          <Button
            variant="contained"
            startIcon={<AutoAwesome />}
            onClick={handleGutSearch}
            disabled={fetching}
            sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
          >
            {fetching ? "Searching..." : "Fetch Gut Content"}
          </Button>
        )}
      </Stack>

      {fetchMsg && (
        <Alert severity={fetchMsg.ok ? "success" : "error"} sx={{ mb: 2 }} onClose={() => setFetchMsg(null)}>
          {fetchMsg.msg}
        </Alert>
      )}

      <Box mb={4} />

      <Stack spacing={2} mb={4}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
          <TextField
            placeholder="Search content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search color="action" /></InputAdornment> }}
            sx={{ maxWidth: 400 }}
            size="small"
          />
          {isSpecialist && (
            <ToggleButtonGroup value={status} exclusive onChange={(_, v) => v && setStatus(v)} size="small">
              <ToggleButton value="approved">Approved</ToggleButton>
              <ToggleButton value="pending">Pending Curation</ToggleButton>
            </ToggleButtonGroup>
          )}
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {specialties.map((s) => (
            <Chip key={s} label={s === "All" ? "All Specialties" : s.charAt(0).toUpperCase() + s.slice(1)} onClick={() => setSelectedSpecialty(s)}
              color={selectedSpecialty === s ? "primary" : "default"} variant={selectedSpecialty === s ? "filled" : "outlined"} sx={{ cursor: "pointer" }} size="small" />
          ))}
        </Stack>

        <Stack direction="row" spacing={1}>
          {Object.entries(ageLabels).map(([key, label]) => (
            <Chip key={key} label={label} onClick={() => setSelectedAge(key)}
              color={selectedAge === key ? "secondary" : "default"} variant={selectedAge === key ? "filled" : "outlined"} sx={{ cursor: "pointer" }} size="small" />
          ))}
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
              </Grid>
            ))
          : content.length === 0
          ? <Grid item xs={12}><Box textAlign="center" py={8}><Typography color="text.secondary">No content found.</Typography></Box></Grid>
          : content.map((c) => {
              const scfg = statusConfig[c.status] || statusConfig.approved;
              return (
                <Grid item xs={12} sm={6} md={4} key={c.id}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column", transition: "transform 0.2s", "&:hover": { transform: "translateY(-2px)" } }}>
                    {c.thumbnailUrl
                      ? <CardMedia component="img" height="160" image={c.thumbnailUrl} alt={c.title} sx={{ objectFit: "cover" }} />
                      : <Box sx={{ height: 160, bgcolor: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <YouTube sx={{ fontSize: 48, color: "#FF0000" }} />
                        </Box>}

                    <CardContent sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Chip icon={scfg.icon} label={scfg.label} color={scfg.color} size="small" />
                        <Stack direction="row" spacing={0.5}>
                          {c.url && <IconButton size="small" href={c.url} target="_blank"><OpenInNew fontSize="small" /></IconButton>}
                        </Stack>
                      </Stack>

                      <Typography variant="subtitle2" fontWeight={700} mb={0.5} sx={{ lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {c.title}
                      </Typography>

                      <Typography variant="caption" color="text.secondary" mb={1.5} sx={{ flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {c.description}
                      </Typography>

                      <Stack direction="row" flexWrap="wrap" gap={0.5} mb={1.5}>
                        {c.specialtyTags.slice(0, 2).map((tag) => (
                          <Chip key={tag} label={tag} size="small" sx={{ bgcolor: "#EBF2FF", color: "primary.main", fontWeight: 600, fontSize: 10 }} />
                        ))}
                        <Chip label={ageLabels[c.ageSuitability] || c.ageSuitability} size="small" variant="outlined" sx={{ fontSize: 10 }} />
                      </Stack>

                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={isSpecialist && c.status === "pending" ? 1.5 : 0}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <YouTube sx={{ fontSize: 14, color: "#FF0000" }} />
                          <Typography variant="caption" color="text.secondary">{c.channelName || "Unknown"}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AutoAwesome sx={{ fontSize: 12, color: "#F57C00" }} />
                          <Typography variant="caption" color="text.secondary">{Number(c.aiQualityScore).toFixed(1)}</Typography>
                          <Visibility sx={{ fontSize: 12, color: "text.disabled" }} />
                          <Typography variant="caption" color="text.disabled">{Number(c.viewCount).toLocaleString()}</Typography>
                        </Stack>
                      </Stack>

                      {isSpecialist && c.status === "pending" && (
                        <>
                          {voteMsg?.id === c.id && (
                            <Alert severity={voteMsg.ok ? "success" : "error"} sx={{ mb: 1, py: 0 }} onClose={() => setVoteMsg(null)}>
                              <Typography variant="caption">{voteMsg.msg}</Typography>
                            </Alert>
                          )}
                          <Stack direction="row" spacing={1}>
                            <Button variant="contained" color="success" size="small" fullWidth startIcon={<ThumbUp />}
                              disabled={voting === c.id} onClick={() => handleVote(c.id, "approve")}>
                              Approve ({c.approveCount}/3)
                            </Button>
                            <Button variant="outlined" color="error" size="small" fullWidth startIcon={<ThumbDown />}
                              disabled={voting === c.id} onClick={() => handleVote(c.id, "reject")}>
                              Reject ({c.rejectCount}/3)
                            </Button>
                          </Stack>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
      </Grid>
    </Box>
  );
}
