import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Avatar,
  Chip,
  Button,
  Skeleton,
  Divider,
  Rating,
} from "@mui/material";
import {
  VerifiedUser,
  Business,
  ArrowBack,
  WorkspacePremium,
  LinkedIn,
  LocationOn,
  People,
  CalendarMonth,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import api, { SpecialistProfile as ISpecialistProfile } from "../api/client";
import RankingScoreCard from "../components/RankingScoreCard";

const activityTypeLabels: Record<string, string> = {
  clinic: "Clinic", school_visit: "School Visit", mentorship: "Mentorship",
  webinar: "Webinar", workshop: "Workshop", other: "Other",
};

const badgeColors: Record<string, string> = {
  distinguished: "#E53935", elevated: "#1565C0", standard: "#616161",
};

export default function SpecialistProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ISpecialistProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get<ISpecialistProfile>(`/specialists/${id}`)
      .then((r) => setProfile(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Box><Skeleton height={200} sx={{ borderRadius: 2 }} /><Skeleton height={400} sx={{ borderRadius: 2, mt: 2 }} /></Box>;

  if (!profile) return (
    <Box textAlign="center" py={8}>
      <Typography>Specialist not found.</Typography>
      <Button onClick={() => navigate("/specialists")} sx={{ mt: 2 }}>Back to Specialists</Button>
    </Box>
  );

  const badge = profile.rankingScore?.badge ?? "standard";
  const badgeColor = badgeColors[badge];

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate("/specialists")} sx={{ mb: 3 }}>
        Back to Specialists
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <Box sx={{ height: 6, bgcolor: badgeColor }} />
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Avatar sx={{ bgcolor: badgeColor, width: 80, height: 80, fontSize: 32, fontWeight: 700, mx: "auto", mb: 2 }}>
                {profile.fullName?.charAt(0)}
              </Avatar>

              <Stack direction="row" justifyContent="center" spacing={1} alignItems="center" mb={0.5}>
                <Typography variant="h6" fontWeight={700}>{profile.fullName}</Typography>
                {profile.verified && <VerifiedUser sx={{ color: "success.main", fontSize: 20 }} />}
              </Stack>

              <Typography color="text.secondary" variant="body2" mb={0.5}>{profile.specialty}</Typography>
              {profile.subSpecialty && <Typography color="text.disabled" variant="caption" display="block" mb={1}>{profile.subSpecialty}</Typography>}

              {profile.credentials && (
                <Chip label={profile.credentials} size="small" sx={{ mb: 2, bgcolor: "#EBF2FF", color: "primary.main", fontWeight: 600 }} />
              )}

              <Stack spacing={0.5} alignItems="flex-start" mb={2}>
                {profile.institution && (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Business sx={{ fontSize: 14, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary">{profile.institution}</Typography>
                  </Stack>
                )}
                {profile.location && (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <LocationOn sx={{ fontSize: 14, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary">{profile.location}</Typography>
                  </Stack>
                )}
                {profile.linkedinConnections > 0 && (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <LinkedIn sx={{ fontSize: 14, color: "#0077B5" }} />
                    <Typography variant="caption" color="text.secondary">{profile.linkedinConnections} connections</Typography>
                  </Stack>
                )}
              </Stack>

              {profile.googleRating > 0 && (
                <Box sx={{ p: 1.5, bgcolor: "#FFFDE7", borderRadius: 2, mb: 2 }}>
                  <Stack alignItems="center" spacing={0.5}>
                    <Rating value={Number(profile.googleRating)} precision={0.1} size="small" readOnly />
                    <Typography variant="caption" fontWeight={700}>{Number(profile.googleRating).toFixed(1)} / 5.0</Typography>
                    <Typography variant="caption" color="text.secondary">{profile.googleReviewCount} Google reviews</Typography>
                  </Stack>
                </Box>
              )}

              {profile.rankingScore && (
                <Box sx={{ p: 1.5, bgcolor: badgeColor + "10", borderRadius: 2, border: `1px solid ${badgeColor}30`, mb: 2 }}>
                  <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
                    <WorkspacePremium sx={{ fontSize: 16, color: badgeColor }} />
                    <Typography variant="caption" fontWeight={700} color={badgeColor}>
                      {badge.charAt(0).toUpperCase() + badge.slice(1)} · Rank #{profile.rankingScore.rank ?? "–"}
                    </Typography>
                  </Stack>
                </Box>
              )}

              {profile.bio && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="text.secondary" textAlign="left">{profile.bio}</Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          {profile.rankingScore && (
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={3}>Ranking Score</Typography>
                <RankingScoreCard ranking={profile.rankingScore} />
              </CardContent>
            </Card>
          )}

          {profile.activities && profile.activities.length > 0 && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>Real-World Activities</Typography>
                <Stack spacing={2}>
                  {profile.activities.map((a) => (
                    <Box key={a.id} sx={{ p: 2, borderRadius: 2, bgcolor: "#F5F7FA", border: "1px solid", borderColor: "divider" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box flex={1}>
                          <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                            <Chip label={activityTypeLabels[a.type] || a.type} size="small" sx={{ bgcolor: "#EBF2FF", color: "primary.main", fontWeight: 600, fontSize: 10 }} />
                            {a.verified && <Chip label="Verified" size="small" color="success" />}
                          </Stack>
                          <Typography variant="body2" fontWeight={600}>{a.title}</Typography>
                          {a.description && <Typography variant="caption" color="text.secondary" display="block">{a.description}</Typography>}
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={2} mt={1}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <CalendarMonth sx={{ fontSize: 13, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">{new Date(a.activityDate).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <People sx={{ fontSize: 13, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">{a.participantsCount} participants</Typography>
                        </Stack>
                        {a.location && <Typography variant="caption" color="text.secondary">{a.location}</Typography>}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
