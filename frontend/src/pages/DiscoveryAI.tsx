import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Stack,
  Chip,
  TextField,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Psychology,
  Send,
  CheckCircle,
  School,
  TrendingUp,
  Lightbulb,
} from "@mui/icons-material";

const specialties = [
  "Cardiology", "Neurology", "Oncology", "Pediatrics",
  "Surgery", "Radiology", "Dermatology", "Emergency Medicine",
  "Psychiatry", "Orthopedics",
];

const careerPaths: Record<string, { steps: string[]; skills: string[]; resources: string[] }> = {
  Cardiology: {
    steps: ["MBBS (5 years)", "Housemanship (2 years)", "Internal Medicine (3 years)", "Cardiology Fellowship (3 years)", "MRCP & FAMS"],
    skills: ["ECG interpretation", "Echocardiography", "Cardiac catheterization", "Heart failure management"],
    resources: ["Introduction to Cardiology (Video)", "ECG Mastery Course", "AHA Guidelines"],
  },
  Neurology: {
    steps: ["MBBS (5 years)", "Housemanship (2 years)", "Internal Medicine (3 years)", "Neurology Fellowship (3 years)", "Sub-specialty training"],
    skills: ["Neurological examination", "EEG interpretation", "MRI brain reading", "Stroke management"],
    resources: ["Neurology Fundamentals", "Stroke Protocols", "Brain Atlas"],
  },
  default: {
    steps: ["MBBS (5 years)", "Housemanship (2 years)", "Basic specialist training (3 years)", "Advanced fellowship (2-3 years)", "Board certification"],
    skills: ["Clinical examination", "Diagnostics", "Patient management", "Research methodology"],
    resources: ["Medical fundamentals", "Clinical skills training", "Specialty guidelines"],
  },
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function DiscoveryAI() {
  const [selected, setSelected] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your MEDIQ Discovery AI. I can help you explore healthcare careers, understand specialist pathways, and guide your learning journey. Which medical specialty interests you?",
    },
  ]);
  const [thinking, setThinking] = useState(false);

  const handleSpecialtySelect = (s: string) => {
    setSelected(s);
    const path = careerPaths[s] || careerPaths.default;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: `Tell me about a career in ${s}` },
      {
        role: "assistant",
        content: `Great choice! ${s} is a fascinating field. Here's a personalised pathway for you:\n\n📋 **Career Steps:**\n${path.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n🎯 **Key Skills:**\n${path.skills.map((sk) => `• ${sk}`).join("\n")}\n\n📚 **Recommended Resources:**\n${path.resources.map((r) => `• ${r}`).join("\n")}\n\nWould you like to explore specific aspects of ${s}, or shall I recommend some specialists to connect with?`,
      },
    ]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setThinking(true);
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let reply = "";
      if (lower.includes("salary") || lower.includes("pay")) {
        reply = "Specialist salaries in Singapore vary by specialty and seniority. Consultants in surgical specialties typically earn SGD $200k–$400k+ annually, while medical specialists range from SGD $150k–$300k. The real reward is the impact you create! 💙";
      } else if (lower.includes("duration") || lower.includes("how long") || lower.includes("years")) {
        reply = "The full journey to become a specialist typically takes 12–15 years: 5 years of medical school, 2 years housemanship, then 5–7 years of specialist training. It's a commitment, but every step is incredibly rewarding!";
      } else if (lower.includes("skills") || lower.includes("what do i need")) {
        reply = "Key skills for any medical specialist include: clinical reasoning, empathy, attention to detail, communication, teamwork, and lifelong learning mindset. Technical skills vary by specialty — I can detail those for your chosen field!";
      } else if (lower.includes("recommend") || lower.includes("specialist") || lower.includes("mentor")) {
        reply = "I'd highly recommend connecting with our verified specialists on MEDIQ! Head to the Specialists section to find mentors in your area of interest, book consultations, or attend their workshops.";
      } else {
        reply = `That's a great question about ${selected || "healthcare"}! The key is to start exploring early — shadow specialists, attend workshops, and build connections through the MEDIQ ecosystem. Is there a specific aspect of your journey you'd like to explore deeper?`;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setThinking(false);
    }, 1200);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={0.5}>
        Discovery AI
      </Typography>
      <Typography color="text.secondary" mb={4}>
        AI-powered career exploration and personalised learning journeys
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <Psychology color="primary" />
                <Typography variant="h6" fontWeight={700}>Explore Specialties</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Select a specialty to get a personalised career pathway.
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {specialties.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    onClick={() => handleSpecialtySelect(s)}
                    color={selected === s ? "primary" : "default"}
                    variant={selected === s ? "filled" : "outlined"}
                    sx={{ cursor: "pointer" }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>

          {selected && (
            <Card sx={{ mt: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} mb={2} color="primary">
                  {selected} Pathway Highlights
                </Typography>
                <List dense disablePadding>
                  {(careerPaths[selected] || careerPaths.default).steps.slice(0, 3).map((step, i) => (
                    <ListItem key={i} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckCircle sx={{ fontSize: 16, color: "success.main" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={step}
                        primaryTypographyProps={{ variant: "caption" }}
                      />
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 1.5 }} />
                <Stack spacing={0.5}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <School sx={{ fontSize: 14, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary">
                      Avg. 13 years to become consultant
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <TrendingUp sx={{ fontSize: 14, color: "success.main" }} />
                    <Typography variant="caption" color="text.secondary">
                      High demand specialty
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Lightbulb sx={{ fontSize: 14, color: "warning.main" }} />
                    <Typography variant="caption" color="text.secondary">
                      3 specialists available to connect
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ display: "flex", flexDirection: "column", height: 560 }}>
            <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1565C0, #00ACC1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Psychology sx={{ fontSize: 18, color: "white" }} />
                </Box>
                <Box>
                  <Typography fontWeight={700} fontSize={14}>MEDIQ Discovery AI</Typography>
                  <Typography variant="caption" color="success.main">● Online</Typography>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
              {messages.map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "80%",
                      px: 2,
                      py: 1.5,
                      borderRadius: 2,
                      bgcolor: msg.role === "user" ? "primary.main" : "#F5F7FA",
                      color: msg.role === "user" ? "white" : "text.primary",
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                      {msg.content}
                    </Typography>
                  </Box>
                </Box>
              ))}
              {thinking && (
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", p: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="caption" color="text.secondary">Thinking...</Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
              <Stack direction="row" spacing={1}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ask anything about healthcare careers..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button variant="contained" onClick={handleSend} disabled={!input.trim()}>
                  <Send fontSize="small" />
                </Button>
              </Stack>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
