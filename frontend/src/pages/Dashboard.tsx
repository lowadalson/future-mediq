import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Avatar,
  Chip,
  Skeleton,
  LinearProgress,
} from "@mui/material";
import {
  AutoStories,
  People,
  EmojiEvents,
  ArrowForward,
  VerifiedUser,
  HowToVote,
  WorkspacePremium,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api, { ContentItem, SpecialistProfile, RankingScore, thumbnailFallbackProps } from "../api/client";
import RankingScoreCard from "../components/RankingScoreCard";
import SpecialistOverviewModal from "../components/SpecialistOverviewModal";

const badgeColors = { distinguished: "#E53935", elevated: "#1565C0", standard: "#616161" };

const NAME_TITLES = new Set(["dr", "dr.", "prof", "prof.", "mr", "mr.", "mrs", "mrs.", "ms", "ms.", "miss"]);

function firstName(displayName?: string | null): string {
  const parts = (displayName ?? "").trim().split(/\s+/).filter(Boolean);
  const meaningful = parts.filter((p) => !NAME_TITLES.has(p.toLowerCase()));
  return meaningful[0] || parts[0] || "there";
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [specialists, setSpecialists] = useState<SpecialistProfile[]>([]);
  const [leaderboard, setLeaderboard] = useState<RankingScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<ContentItem[]>("/content?status=approved"),
      api.get<SpecialistProfile[]>("/specialists"),
      api.get<RankingScore[]>("/rankings/leaderboard"),
    ])
      .then(([c, s, l]) => {
        setContent(c.data.slice(0, 4));
        setSpecialists(s.data.slice(0, 3));
        setLeaderboard(l.data.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  const specialistProfile = user?.specialistProfile;
  const studentProfile = user?.studentProfile;

  const stats = [
    { label: "Curated Content", value: "3+", icon: <AutoStories color="primary" />, path: "/knowledge" },
    { label: "Verified Specialists", value: "3", icon: <VerifiedUser sx={{ color: "#2E7D32" }} />, path: "/specialists" },
    { label: "Activities", value: "3+", icon: <EmojiEvents sx={{ color: "#F57C00" }} />, path: "/workshops" },
    { label: "Community", value: "100+", icon: <People sx={{ color: "#7B1FA2" }} />, path: "/specialists" },
  ];

  return (
    <Box>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Welcome back, {firstName(user?.displayName)} 👋
          </Typography>
          <Typography color="text.secondary" mt={0.5}>
            {user?.role === "student"
              ? `Discover your healthcare journey${studentProfile?.age ? ` (Age ${studentProfile.age})` : ""}`
              : user?.role === "specialist"
              ? "Track your impact and curate knowledge"
              : "Manage your presence in the MEDIQ ecosystem"}
          </Typography>
        </Box>
        <Chip label={user?.role?.toUpperCase()} color="primary" sx={{ fontWeight: 700, mt: { xs: 1, sm: 0 } }} />
      </Stack>

      <Grid container spacing={3} mb={4}>
        {stats.map((s) => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card sx={{ cursor: "pointer", "&:hover": { transform: "translateY(-2px)" }, transition: "transform 0.2s" }} onClick={() => navigate(s.path)}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight={800}>{s.value}</Typography>
                    <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                  </Box>
                  {s.icon}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {specialistProfile?.rankingScore && (
          <Grid item xs={12} md={5}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={700}>My Ranking Score</Typography>
                  <Button size="small" endIcon={<HowToVote />} onClick={() => navigate("/knowledge?status=pending")}>
                    Curate
                  </Button>
                </Stack>
                <RankingScoreCard ranking={specialistProfile.rankingScore} />
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12} md={specialistProfile?.rankingScore ? 7 : 12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={specialistProfile?.rankingScore ? 12 : 8}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight={700}>Latest Content</Typography>
                    <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate("/knowledge")}>View all</Button>
                  </Stack>
                  {loading
                    ? [1, 2, 3].map((i) => <Skeleton key={i} height={60} sx={{ mb: 1 }} />)
                    : content.map((c) => (
                        <Box key={c.id} sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
                          {c.thumbnailUrl
                            ? <Box component="img" src={c.thumbnailUrl} sx={{ width: 56, height: 36, borderRadius: 1, objectFit: "cover", flexShrink: 0 }} {...thumbnailFallbackProps()} />
                            : <Avatar sx={{ bgcolor: "#1565C0", width: 40, height: 36, borderRadius: 1, fontSize: 11 }}>YT</Avatar>}
                          <Box flex={1} minWidth={0}>
                            <Typography variant="body2" fontWeight={600} noWrap>{c.title}</Typography>
                            <Typography variant="caption" color="text.secondary">{c.specialtyTags[0]} · {Number(c.viewCount).toLocaleString()} views · {c.ageSuitability}</Typography>
                          </Box>
                          <Chip label="Approved" size="small" color="success" variant="outlined" />
                        </Box>
                      ))}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={specialistProfile?.rankingScore ? 12 : 4}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight={700}>Leaderboard</Typography>
                    <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate("/specialists")}>View all</Button>
                  </Stack>
                  {loading
                    ? [1, 2, 3].map((i) => <Skeleton key={i} height={50} sx={{ mb: 1 }} />)
                    : leaderboard.map((rs, i) => {
                        const sp = rs as RankingScore & { specialist?: SpecialistProfile };
                        const total = Number(rs.totalScore);
                        const color = badgeColors[rs.badge];
                        return (
                          <Box key={rs.id} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1, borderBottom: "1px solid", borderColor: "divider" }}>
                            <Typography fontWeight={800} color={i < 3 ? color : "text.disabled"} sx={{ width: 20, textAlign: "center" }}>
                              {i + 1}
                            </Typography>
                            <Avatar sx={{ bgcolor: color, width: 32, height: 32, fontSize: 12 }}>
                              {(sp.specialist as SpecialistProfile | undefined)?.fullName?.charAt(0) ?? "?"}
                            </Avatar>
                            <Box flex={1} minWidth={0}>
                              <Typography variant="body2" fontWeight={600} noWrap>
                                {(sp.specialist as SpecialistProfile | undefined)?.fullName ?? "–"}
                              </Typography>
                              <LinearProgress variant="determinate" value={Math.min((total / 500) * 100, 100)} sx={{ height: 3, borderRadius: 2, bgcolor: color + "20", "& .MuiLinearProgress-bar": { bgcolor: color } }} />
                            </Box>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <WorkspacePremium sx={{ fontSize: 14, color }} />
                              <Typography variant="caption" fontWeight={700} color={color}>{total.toFixed(0)}</Typography>
                            </Stack>
                          </Box>
                        );
                      })}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={700}>Featured Specialists</Typography>
                <Button size="small" endIcon={<ArrowForward />} onClick={() => navigate("/specialists")}>View all</Button>
              </Stack>
              <Grid container spacing={2}>
                {loading
                  ? [1, 2, 3].map((i) => <Grid item xs={12} sm={4} key={i}><Skeleton height={100} /></Grid>)
                  : specialists.map((s) => (
                      <Grid item xs={12} sm={4} key={s.id}>
                        <Box sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider", cursor: "pointer", "&:hover": { bgcolor: "#F5F7FA" } }} onClick={() => setSelectedSpecialistId(s.id)}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>{s.fullName?.charAt(0)}</Avatar>
                            <Box minWidth={0}>
                              <Typography variant="body2" fontWeight={600} noWrap>{s.fullName}</Typography>
                              <Typography variant="caption" color="text.secondary" noWrap>{s.specialty}</Typography>
                            </Box>
                          </Stack>
                          {s.rankingScore && (
                            <Stack direction="row" spacing={0.5} alignItems="center" mt={1}>
                              <WorkspacePremium sx={{ fontSize: 14, color: badgeColors[s.rankingScore.badge] }} />
                              <Typography variant="caption" fontWeight={700} color={badgeColors[s.rankingScore.badge]}>
                                {Number(s.rankingScore.totalScore).toFixed(0)} pts · {s.rankingScore.badge}
                              </Typography>
                            </Stack>
                          )}
                        </Box>
                      </Grid>
                    ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <SpecialistOverviewModal specialistId={selectedSpecialistId} onClose={() => setSelectedSpecialistId(null)} />
    </Box>
  );
}
