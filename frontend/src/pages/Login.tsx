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
} from "@mui/material";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password.");
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
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your MEDIQ account
            </Typography>
          </Stack>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
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
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Stack>
          </form>

          <Box mt={2} sx={{ borderRadius: 2, overflow: "hidden", border: "1.5px solid", borderColor: "primary.light" }}>
            <Box sx={{ bgcolor: "primary.main", px: 2, py: 1 }}>
              <Typography variant="caption" fontWeight={700} color="white">⚡ Quick Demo Access</Typography>
            </Box>
            <Box px={2} py={1.5} bgcolor="#F5F7FF">
              <Stack spacing={1}>
                <Button
                  fullWidth variant="outlined" size="small"
                  onClick={async () => { setLoading(true); try { await login("sarah@mediq.com","password123"); navigate("/gut-series"); } catch { setError("Demo login failed"); } finally { setLoading(false); } }}
                  disabled={loading}
                  sx={{ justifyContent: "flex-start", gap: 1, borderColor: "#E53935", color: "#E53935", "&:hover": { borderColor: "#E53935", bgcolor: "#FFF5F5" } }}
                >
                  🔬 <strong>Gut Series Demo</strong> — Dr. Sarah Lim, Cardiologist
                </Button>
                <Button
                  fullWidth variant="outlined" size="small"
                  onClick={async () => { setLoading(true); try { await login("student@mediq.com","password123"); navigate("/dashboard"); } catch { setError("Demo login failed"); } finally { setLoading(false); } }}
                  disabled={loading}
                  sx={{ justifyContent: "flex-start", gap: 1 }}
                >
                  🎓 <strong>Student Demo</strong> — Explore as a student
                </Button>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
