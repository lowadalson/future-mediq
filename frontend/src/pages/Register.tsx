import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
  Alert,
  Link,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { School, MedicalServices, Business } from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const roles = [
  { value: "student", label: "Student", icon: <School /> },
  { value: "specialist", label: "Specialist", icon: <MedicalServices /> },
  { value: "institution", label: "Institution", icon: <Business /> },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(displayName, email, password, role, role === "student" && age ? Number(age) : undefined);
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #EBF2FF 0%, #E0F7FA 100%)",
      }}
    >
      <Container maxWidth="xs">
        <Paper sx={{ p: 4, borderRadius: 3 }} elevation={0}>
          <Stack alignItems="center" spacing={1} mb={3}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: "linear-gradient(135deg, #1565C0, #00ACC1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 800,
                fontSize: 22,
              }}
            >
              M
            </Box>
            <Typography variant="h5" fontWeight={700}>
              Join MEDIQ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your account
            </Typography>
          </Stack>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                I AM A...
              </Typography>
              <ToggleButtonGroup
                value={role}
                exclusive
                onChange={(_, v) => v && setRole(v)}
                fullWidth
                size="small"
              >
                {roles.map((r) => (
                  <ToggleButton
                    key={r.value}
                    value={r.value}
                    sx={{
                      flexDirection: "column",
                      gap: 0.5,
                      py: 1,
                      fontSize: 12,
                      "&.Mui-selected": {
                        bgcolor: "primary.main",
                        color: "white",
                        "&:hover": { bgcolor: "primary.dark" },
                      },
                    }}
                  >
                    {r.icon}
                    {r.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>

              <TextField
                label="Full Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                fullWidth
                required
                size="small"
              />
              {role === "student" && (
                <TextField
                  label="Age (7–18)"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  fullWidth
                  size="small"
                  inputProps={{ min: 7, max: 18 }}
                />
              )}
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                size="small"
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                size="small"
                inputProps={{ minLength: 6 }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </Stack>
          </form>

          <Typography variant="body2" textAlign="center" mt={2} color="text.secondary">
            Already have an account?{" "}
            <Link component={RouterLink} to="/login" fontWeight={600}>
              Sign in
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
