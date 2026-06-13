import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Skeleton,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  LocationOn,
  CalendarToday,
  Group,
  VerifiedUser,
  LocalHospital,
  School,
  People,
  Laptop,
  Construction,
  Category,
} from "@mui/icons-material";
import api, { Activity } from "../api/client";

const typeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  clinic:       { icon: <LocalHospital />, color: "#E53935", label: "Clinic" },
  school_visit: { icon: <School />,        color: "#1565C0", label: "School Visit" },
  mentorship:   { icon: <People />,        color: "#2E7D32", label: "Mentorship" },
  webinar:      { icon: <Laptop />,        color: "#7B1FA2", label: "Webinar" },
  workshop:     { icon: <Construction />,  color: "#F57C00", label: "Workshop" },
  other:        { icon: <Category />,      color: "#616161", label: "Other" },
};

const TYPES = Object.keys(typeConfig);

export default function Workshops() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    api.get<Activity[]>("/activities", { params: { verified: "true" } })
      .then((r) => setActivities(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter ? activities.filter((a) => a.type === filter) : activities;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={0.5}>Real-World Activities</Typography>
      <Typography color="text.secondary" mb={4}>
        Verified specialist activities — workshops, school visits, clinics, mentorships and more
      </Typography>

      <ToggleButtonGroup value={filter} exclusive onChange={(_, v) => setFilter(v)} size="small" sx={{ mb: 4, flexWrap: "wrap", gap: 0.5 }}>
        {TYPES.map((t) => {
          const cfg = typeConfig[t];
          return (
            <ToggleButton key={t} value={t} sx={{ gap: 0.5, "&.Mui-selected": { bgcolor: cfg.color + "15", color: cfg.color, borderColor: cfg.color + "40" } }}>
              {cfg.icon}
              {cfg.label}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>

      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Grid item xs={12} md={6} key={i}><Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} /></Grid>
            ))
          : filtered.length === 0
          ? <Grid item xs={12}><Box textAlign="center" py={8}><Typography color="text.secondary">No activities found.</Typography></Box></Grid>
          : filtered.map((a) => {
              const cfg = typeConfig[a.type] || typeConfig.other;
              return (
                <Grid item xs={12} md={6} key={a.id}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column", transition: "transform 0.2s", "&:hover": { transform: "translateY(-2px)" } }}>
                    <Box sx={{ height: 5, bgcolor: cfg.color }} />
                    <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Chip icon={cfg.icon as React.ReactElement} label={cfg.label} size="small" sx={{ bgcolor: cfg.color + "15", color: cfg.color, fontWeight: 700 }} />
                        {a.verified && <Chip icon={<VerifiedUser sx={{ fontSize: 12 }} />} label="Verified" size="small" color="success" />}
                      </Stack>

                      <Typography variant="h6" fontWeight={700} mb={1} lineHeight={1.3}>{a.title}</Typography>
                      <Typography variant="body2" color="text.secondary" mb={2} sx={{ flex: 1 }}>{a.description}</Typography>

                      <Stack spacing={0.75}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarToday sx={{ fontSize: 14, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(a.activityDate).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                          </Typography>
                        </Stack>
                        {a.location && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <LocationOn sx={{ fontSize: 14, color: "text.secondary" }} />
                            <Typography variant="caption" color="text.secondary">{a.location}</Typography>
                          </Stack>
                        )}
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Group sx={{ fontSize: 14, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">{a.participantsCount} participants</Typography>
                        </Stack>
                        {a.specialist && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ width: 20, height: 20, fontSize: 10, bgcolor: cfg.color }}>
                              {a.specialist.fullName?.charAt(0)}
                            </Avatar>
                            <Typography variant="caption" color="text.secondary">{a.specialist.fullName} · {a.specialist.specialty}</Typography>
                          </Stack>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
      </Grid>
    </Box>
  );
}
