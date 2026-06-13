import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { CircularProgress, Box } from "@mui/material";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DiscoveryAI from "./pages/DiscoveryAI";
import KnowledgeUniverse from "./pages/KnowledgeUniverse";
import Specialists from "./pages/Specialists";
import SpecialistProfilePage from "./pages/SpecialistProfile";
import Workshops from "./pages/Workshops";
import GutSeries from "./pages/GutSeries";
import VirtualPanel from "./pages/VirtualPanel";
import PitchDeck from "./pages/PitchDeck";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const { loading } = useAuth();
  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/discovery" element={<DiscoveryAI />} />
        <Route path="/knowledge" element={<KnowledgeUniverse />} />
        <Route path="/specialists" element={<Specialists />} />
        <Route path="/specialists/:id" element={<SpecialistProfilePage />} />
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/gut-series" element={<GutSeries />} />
        <Route path="/virtual-panel" element={<VirtualPanel />} />
        <Route path="/pitch" element={<PitchDeck />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
