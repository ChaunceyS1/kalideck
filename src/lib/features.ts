import {
  Brain,
  Crown,
  Map,
  Shield,
  SquareTerminal,
  Terminal,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type FeatureTint = "green" | "teal" | "maroon" | "amber";

export type Feature = {
  href: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tint: FeatureTint;
};

export const TINT_HEX: Record<FeatureTint, string> = {
  green: "#1f6b4a",
  teal: "#1f5a66",
  maroon: "#5a1f3a",
  amber: "#5a4a1f",
};

export const FEATURES: Feature[] = [
  {
    href: "/tools",
    title: "Kali Tools",
    subtitle: "Complete tool database with commands",
    icon: Terminal,
    tint: "green",
  },
  {
    href: "/assistant",
    title: "AI Assistant",
    subtitle: "Gemini-powered tutor",
    icon: Brain,
    tint: "teal",
  },
  {
    href: "/sandbox",
    title: "Terminal Sandbox",
    subtitle: "Practice commands safely",
    icon: SquareTerminal,
    tint: "maroon",
  },
  {
    href: "/roadmap",
    title: "Road Map",
    subtitle: "Zero-to-hero path in 10 phases",
    icon: Map,
    tint: "maroon",
  },
  {
    href: "/learn",
    title: "Learn",
    subtitle: "Video tutorials and guides",
    icon: Shield,
    tint: "green",
  },
  {
    href: "/wordlist",
    title: "Wordlist Generator",
    subtitle: "Build targeted wordlists",
    icon: Zap,
    tint: "amber",
  },
  {
    href: "/utils",
    title: "Utility Tools",
    subtitle: "IP, hash, network helpers",
    icon: Wrench,
    tint: "green",
  },
  {
    href: "/support",
    title: "Priority Support",
    subtitle: "Pro members",
    icon: Crown,
    tint: "maroon",
  },
];

export const STATS = [
  { value: "100+", label: "Tools" },
  { value: "180+", label: "Videos" },
  { value: "10", label: "Phases" },
  { value: "AI", label: "Powered" },
];
