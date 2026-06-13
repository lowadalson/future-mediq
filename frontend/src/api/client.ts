import axios from "axios";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mediq_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

export type UserRole = "student" | "specialist" | "admin";
export type BadgeLevel = "standard" | "elevated" | "distinguished";
export type ContentStatus = "pending" | "approved" | "rejected" | "flagged";
export type ContentSource = "youtube" | "tiktok" | "vimeo" | "other";
export type ActivityType = "clinic" | "school_visit" | "mentorship" | "webinar" | "workshop" | "other";
export type AgeSuitability = "7-10" | "11-14" | "15-18" | "all";

export interface RankingScore {
  id: string;
  curationPoints: number;
  activityPoints: number;
  externalScore: number;
  totalScore: number;
  rank: number | null;
  badge: BadgeLevel;
  updatedAt: string;
}

export interface StudentProfile {
  id: string;
  age: number | null;
  interests: string[];
  learningLevel: "beginner" | "intermediate" | "advanced";
  progressData: Record<string, unknown>;
}

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  avatarUrl: string | null;
  specialistProfile?: SpecialistProfile | null;
  studentProfile?: StudentProfile | null;
  createdAt: string;
}

export interface SpecialistProfile {
  id: string;
  fullName: string;
  specialty: string;
  subSpecialty: string | null;
  credentials: string | null;
  bio: string | null;
  institution: string | null;
  location: string | null;
  linkedinUrl: string | null;
  linkedinConnections: number;
  googleRating: number;
  googleReviewCount: number;
  profileImageUrl: string | null;
  verified: boolean;
  verifiedAt: string | null;
  rankingScore?: RankingScore | null;
  activities?: Activity[];
  user?: User;
  createdAt: string;
}

export interface ContentItem {
  id: string;
  source: ContentSource;
  externalId: string | null;
  title: string;
  description: string | null;
  url: string;
  thumbnailUrl: string | null;
  channelName: string | null;
  durationSeconds: number | null;
  viewCount: number;
  likeCount: number;
  specialtyTags: string[];
  ageSuitability: AgeSuitability;
  aiQualityScore: number;
  status: ContentStatus;
  approveCount: number;
  rejectCount: number;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string | null;
  location: string | null;
  activityDate: string;
  participantsCount: number;
  verified: boolean;
  evidenceUrl: string | null;
  specialist?: SpecialistProfile;
  createdAt: string;
}

export interface SpecialtyField {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sortOrder: number;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  read: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
}
