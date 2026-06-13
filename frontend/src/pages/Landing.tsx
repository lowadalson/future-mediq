import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";
import {
  Psychology,
  AutoStories,
  VerifiedUser,
  EmojiEvents,
  Groups,
  Construction,
  ArrowForward,
  School,
  MedicalServices,
  Business,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <Psychology sx={{ fontSize: 36 }} />,
    title: "Discovery AI",
    desc: "AI-powered career exploration and personalized learning journeys.",
    color: "#1565C0",
  },
  {
    icon: <AutoStories sx={{ fontSize: 36 }} />,
    title: "Knowledge Universe",
    desc: "Curated videos, podcasts, articles and research by specialty.",
    color: "#00ACC1",
  },
  {
    icon: <VerifiedUser sx={{ fontSize: 36 }} />,
    title: "Specialist Curator Network",
    desc: "Verified specialists ensure quality, relevance and trustworthiness.",
    color: "#2E7D32",
  },
  {
    icon: <EmojiEvents sx={{ fontSize: 36 }} />,
    title: "Specialist Impact Engine",
    desc: "SIS™ score measures EQ, CQ, TQ, RQ & IQ transparently.",
    color: "#F57C00",
  },
  {
    icon: <Groups sx={{ fontSize: 36 }} />,
    title: "Specialist Universe",
    desc: "Connect with specialists, institutions, communities and opportunities.",
    color: "#7B1FA2",
  },
  {
    icon: <Construction sx={{ fontSize: 36 }} />,
    title: "Medical Discovery Workshops",
    desc: "Real-world exposure experiences designed to inspire curiosity.",
    color: "#C62828",
  },
];

const stakeholders = [
  {
    icon: <School sx={{ fontSize: 40, color: "#1565C0" }} />,
    label: "For Students",
    points: [
      "Explore healthcare careers",
      "Discover specialist pathways",
      "Learn from experts",
      "Gain real-world exposure",
    ],
  },
  {
    icon: <MedicalServices sx={{ fontSize: 40, color: "#00ACC1" }} />,
    label: "For Specialists",
    points: [
      "Build reputation",
      "Share expertise",
      "Increase impact",
      "Gain recognition",
    ],
  },
  {
    icon: <Business sx={{ fontSize: 40, color: "#2E7D32" }} />,
    label: "For Institutions",
    points: [
      "Inspire future professionals",
      "Support community outreach",
      "Enhance brand visibility",
      "Build talent pipelines",
    ],
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Box>
      <Box
        sx={{
          background: "linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #00838F 100%)",
          color: "white",
          py: { xs: 8, md: 12 },
          px: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <Container maxWidth="lg">
          <Stack alignItems="center" spacing={3} textAlign="center">
            <Chip
              label="Medical Expertise Discovery & Intelligence Quotient"
              sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", fontWeight: 500 }}
            />
            <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: 36, md: 56 } }}>
              MEDIQ™
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 400, maxWidth: 600 }}>
              Discover. Learn. Contribute. Inspire.
            </Typography>
            <Typography
              variant="body1"
              sx={{ opacity: 0.8, maxWidth: 700, fontSize: 16 }}
            >
              A Specialist Discovery, Knowledge and Community Ecosystem connecting aspiring
              healthcare talent, specialist expertise, institutions and opportunities.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} pt={2}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate("/register")}
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  fontWeight: 700,
                  px: 4,
                  "&:hover": { bgcolor: "grey.100" },
                }}
              >
                Get Started Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/login")}
                sx={{ borderColor: "white", color: "white", px: 4, "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" } }}
              >
                Sign In
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>
          The MEDIQ Specialist Ecosystem
        </Typography>
        <Typography color="text.secondary" textAlign="center" mb={6} maxWidth={600} mx="auto">
          Six interconnected pillars working together to build the future pipeline of healthcare talent.
        </Typography>
        <Grid container spacing={3}>
          {features.map((f) => (
            <Grid item xs={12} sm={6} md={4} key={f.title}>
              <Card sx={{ height: "100%", transition: "transform 0.2s", "&:hover": { transform: "translateY(-4px)" } }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ color: f.color, mb: 2 }}>{f.icon}</Box>
                  <Typography variant="h6" fontWeight={700} mb={1}>
                    {f.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {f.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: "#F0F4FF", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>
            Value for Every Stakeholder
          </Typography>
          <Typography color="text.secondary" textAlign="center" mb={6} maxWidth={500} mx="auto">
            MEDIQ creates meaningful outcomes for students, specialists and institutions.
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {stakeholders.map((s) => (
              <Grid item xs={12} md={4} key={s.label}>
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                      {s.icon}
                      <Typography variant="h6" fontWeight={700}>{s.label}</Typography>
                    </Stack>
                    <Stack spacing={1}>
                      {s.points.map((p) => (
                        <Typography key={p} variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "primary.main", flexShrink: 0, display: "inline-block" }} />
                          {p}
                        </Typography>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          background: "linear-gradient(135deg, #1565C0, #00838F)",
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={700} mb={2}>
            Join the MEDIQ Ecosystem
          </Typography>
          <Typography sx={{ opacity: 0.85, mb: 4 }}>
            Connect with specialists, explore careers, and build the future of healthcare.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/register")}
            sx={{ bgcolor: "white", color: "primary.main", fontWeight: 700, px: 5, "&:hover": { bgcolor: "grey.100" } }}
          >
            Start Your Journey
          </Button>
        </Container>
      </Box>

      <Box sx={{ textAlign: "center", py: 3, bgcolor: "#0D47A1", color: "rgba(255,255,255,0.6)" }}>
        <Typography variant="body2">
          © 2024 MEDIQ™ – Building the Future Pipeline of Healthcare Talent
        </Typography>
      </Box>
    </Box>
  );
}
