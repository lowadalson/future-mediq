import { Box, Typography, Stack, LinearProgress, Chip, Tooltip } from "@mui/material";
import { WorkspacePremium, Star } from "@mui/icons-material";
import { RankingScore, BadgeLevel } from "../api/client";

const badgeConfig: Record<BadgeLevel, { color: string; label: string; bg: string }> = {
  distinguished: { color: "#E53935", label: "Distinguished", bg: "#FFEBEE" },
  elevated: { color: "#1565C0", label: "Elevated", bg: "#E3F2FD" },
  standard: { color: "#616161", label: "Standard", bg: "#F5F5F5" },
};

interface Props {
  ranking: RankingScore;
}

export default function RankingScoreCard({ ranking }: Props) {
  const cfg = badgeConfig[ranking.badge];
  const total = Number(ranking.totalScore);

  const metrics = [
    { label: "Curation Points", value: ranking.curationPoints, max: 100, color: "#1565C0", tip: "1 point per content vote cast" },
    { label: "Activity Points", value: ranking.activityPoints, max: 500, color: "#2E7D32", tip: "participants × 10 per verified activity" },
    { label: "External Score", value: Number(ranking.externalScore).toFixed(1), max: 30, color: "#F57C00", tip: "Google rating + LinkedIn connections" },
  ];

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} letterSpacing={1}>
            SPECIALIST RANKING SCORE
          </Typography>
          <Typography variant="h3" fontWeight={800} color="primary.main" lineHeight={1}>
            {total.toFixed(0)}
          </Typography>
          {ranking.rank && (
            <Typography variant="caption" color="text.secondary">
              Ranked #{ranking.rank} overall
            </Typography>
          )}
        </Box>
        <Chip
          icon={<WorkspacePremium />}
          label={cfg.label}
          sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 700, border: `1px solid ${cfg.color}30` }}
        />
      </Stack>

      <Stack spacing={1.5}>
        {metrics.map((m) => (
          <Tooltip key={m.label} title={m.tip} arrow placement="right">
            <Box>
              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  {m.label}
                </Typography>
                <Typography variant="caption" fontWeight={700} color={m.color}>
                  {m.value}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={Math.min((Number(m.value) / m.max) * 100, 100)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: m.color + "20",
                  "& .MuiLinearProgress-bar": { bgcolor: m.color, borderRadius: 3 },
                }}
              />
            </Box>
          </Tooltip>
        ))}
      </Stack>

      <Box sx={{ mt: 2, p: 1.5, bgcolor: "#F8F9FA", borderRadius: 2 }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Star sx={{ fontSize: 14, color: "#F57C00" }} />
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            Score = Curation + Activity + External (Google × 20 + LinkedIn × 10)
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
