export const CATEGORIES = [
  "Information Gathering",
  "Vulnerability Analysis",
  "Web Apps",
  "Password Attacks",
  "Wireless",
  "Exploitation",
  "Sniffing & Spoofing",
  "Post Exploitation",
  "Forensics",
  "Reporting",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type ToolCommand = {
  label: string;
  cmd: string;
  note: string;
};

export type Tool = {
  slug: string;
  name: string;
  category: Category;
  short: string;
  long: string;
  apt: string;
  tags: string[];
  commands: ToolCommand[];
};
