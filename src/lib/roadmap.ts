/**
 * The zero-to-hero path: ten ordered phases. Each names the tools from the
 * database that fit that stage, so the roadmap links straight into them.
 */
export type Phase = {
  n: number;
  title: string;
  tagline: string;
  focus: string;
  skills: string[];
  /** Tool slugs that exist in data/tools.seed.json. */
  tools: string[];
};

export const ROADMAP: Phase[] = [
  {
    n: 1,
    title: "Foundations & Your Lab",
    tagline: "Build a safe place to practice.",
    focus:
      "Before touching any tool, set up an isolated lab you fully own. Everything in this path is meant for machines you control or are explicitly authorized to test.",
    skills: [
      "Install a virtualization tool and spin up Kali plus a vulnerable practice VM",
      "Snapshot your VMs so you can reset after every experiment",
      "Understand why scope and written permission come before any scan",
    ],
    tools: [],
  },
  {
    n: 2,
    title: "Linux & Networking Basics",
    tagline: "Speak the language of the terminal and the network.",
    focus:
      "Comfort at the command line and a working mental model of TCP/IP are the ground everything else stands on. Spend real time here.",
    skills: [
      "Navigate the filesystem, permissions, and processes from the shell",
      "Read an IP address, port, and subnet without thinking twice",
      "Move data across a connection and grab a service banner by hand",
    ],
    tools: ["netcat", "nmap"],
  },
  {
    n: 3,
    title: "Reconnaissance & OSINT",
    tagline: "Map the target before you touch it.",
    focus:
      "Quiet, mostly passive gathering: what hosts, names, and people are tied to a target. The wider your map, the fewer surprises later.",
    skills: [
      "Enumerate subdomains and DNS records for an in-scope domain",
      "Collect public data with OSINT frameworks and read what it implies",
      "Keep findings organized so nothing gets lost",
    ],
    tools: ["theharvester", "amass", "dnsrecon", "recon-ng", "spiderfoot"],
  },
  {
    n: 4,
    title: "Scanning & Enumeration",
    tagline: "Find the open doors and what's behind them.",
    focus:
      "Turn a list of hosts into a list of services and versions, then dig into what each service exposes. This is where a target's shape becomes clear.",
    skills: [
      "Run targeted and full port scans and read the results",
      "Fingerprint services and match versions to known issues",
      "Enumerate Windows and SMB details from a host",
    ],
    tools: ["nmap", "masscan", "enum4linux", "smbclient"],
  },
  {
    n: 5,
    title: "Vulnerability Analysis",
    tagline: "Separate real weaknesses from noise.",
    focus:
      "Use scanners to surface candidate issues, then confirm them by hand. Learning to filter false positives is as important as finding the leads.",
    skills: [
      "Scan web servers and applications for known problems",
      "Run template- and feed-based scanners and triage the output",
      "Verify a finding manually before you trust it",
    ],
    tools: ["nikto", "nuclei", "wpscan", "openvas"],
  },
  {
    n: 6,
    title: "Web Application Testing",
    tagline: "The most common attack surface, up close.",
    focus:
      "Most real targets are web apps. Learn to intercept traffic, discover hidden content, and test inputs for the classic flaw classes.",
    skills: [
      "Proxy and modify requests to understand how an app behaves",
      "Discover unlinked paths and parameters",
      "Test inputs for injection and confirm impact within scope",
    ],
    tools: ["burpsuite", "zaproxy", "gobuster", "ffuf", "sqlmap"],
  },
  {
    n: 7,
    title: "Password Attacks",
    tagline: "Weak credentials, tested responsibly.",
    focus:
      "Understand how hashes work, when online testing is appropriate, and how to recover credentials offline from material you lawfully hold.",
    skills: [
      "Identify a hash and pick the right cracking approach",
      "Build and use targeted wordlists",
      "Run offline recovery against captured hashes",
    ],
    tools: ["hydra", "john", "hashcat", "crunch"],
  },
  {
    n: 8,
    title: "Exploitation",
    tagline: "Prove impact in a controlled way.",
    focus:
      "Take a confirmed weakness and demonstrate what it allows, using a framework so the test stays repeatable and documented.",
    skills: [
      "Search for and vet public exploit code before running it",
      "Use a framework to launch and manage a test safely",
      "Generate and handle payloads for your own lab",
    ],
    tools: ["metasploit", "searchsploit", "msfvenom", "netcat"],
  },
  {
    n: 9,
    title: "Post-Exploitation & Privilege Escalation",
    tagline: "What access really means.",
    focus:
      "Once you have a foothold on a host you're authorized to test, learn what an attacker could reach next — and how defenders spot it.",
    skills: [
      "Survey a host for local privilege-escalation openings",
      "Map an Active Directory environment and its trust paths",
      "Understand credential-handling weaknesses and their impact",
    ],
    tools: ["linpeas", "crackmapexec", "bloodhound", "mimikatz"],
  },
  {
    n: 10,
    title: "Reporting & Continuous Learning",
    tagline: "The part that actually helps people.",
    focus:
      "A finding no one can act on is wasted. Learn to capture evidence, write clearly, and keep sharpening your skills on legal practice targets.",
    skills: [
      "Keep tidy notes and evidence throughout an engagement",
      "Turn findings into a clear, prioritized report",
      "Practice continuously on CTFs and intentionally vulnerable labs",
    ],
    tools: ["cherrytree", "eyewitness", "faraday", "dradis"],
  },
];
