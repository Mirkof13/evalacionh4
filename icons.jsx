// Lightweight stroke icons matching the Claude-dark aesthetic
// All icons share a consistent stroke weight (1.5)

const Icon = ({ d, size = 16, fill, stroke = 'currentColor', sw = 1.5, children, vb = 24, ...rest }) => (
  <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} fill={fill || 'none'} stroke={fill ? 'none' : stroke}
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {d ? <path d={d} /> : children}
  </svg>
);

const Icons = {
  Home: (p) => <Icon {...p}><path d="M3 12l9-8 9 8"/><path d="M5 10v10h14V10"/></Icon>,
  Chart: (p) => <Icon {...p}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></Icon>,
  Users: (p) => <Icon {...p}><circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6"/><circle cx="17" cy="9" r="2.5"/><path d="M22 20c0-2.5-2-4.5-5-4.5"/></Icon>,
  UserPlus: (p) => <Icon {...p}><circle cx="10" cy="8" r="3.5"/><path d="M3 20c0-3.5 3-6 7-6s7 2.5 7 6"/><path d="M19 6v6M16 9h6"/></Icon>,
  Folder: (p) => <Icon {...p}><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4l2 2.5h9A1.5 1.5 0 0 1 21 9v9.5A1.5 1.5 0 0 1 19.5 20h-15A1.5 1.5 0 0 1 3 18.5v-12z"/></Icon>,
  Stethoscope: (p) => <Icon {...p}><path d="M6 3v6a4 4 0 0 0 8 0V3"/><path d="M6 3h1M13 3h1"/><path d="M10 13v3a4 4 0 0 0 8 0v-2"/><circle cx="18" cy="13" r="2"/></Icon>,
  Activity: (p) => <Icon {...p}><path d="M2 12h4l3-8 4 16 3-8h6"/></Icon>,
  Scan: (p) => <Icon {...p}><path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M3 12h18" stroke="currentColor"/></Icon>,
  Flask: (p) => <Icon {...p}><path d="M9 3h6M10 3v6L4.5 19a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9V3"/><path d="M7 14h10"/></Icon>,
  Baby: (p) => <Icon {...p}><circle cx="12" cy="9" r="5"/><path d="M9 8.5h.01M15 8.5h.01"/><path d="M10 11.5c.5.5 1.2.8 2 .8s1.5-.3 2-.8"/><path d="M7 16l-2 5M17 16l2 5M12 14v8"/></Icon>,
  Calculator: (p) => <Icon {...p}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></Icon>,
  Bell: (p) => <Icon {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/></Icon>,
  Brain: (p) => <Icon {...p}><path d="M9 4a3 3 0 0 0-3 3v0a3 3 0 0 0-3 3v0a3 3 0 0 0 1.5 2.6A3 3 0 0 0 5 17a3 3 0 0 0 4 2.8M15 4a3 3 0 0 1 3 3v0a3 3 0 0 1 3 3v0a3 3 0 0 1-1.5 2.6A3 3 0 0 1 19 17a3 3 0 0 1-4 2.8M12 4v17"/></Icon>,
  Shield: (p) => <Icon {...p}><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z"/></Icon>,
  Settings: (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></Icon>,
  Search: (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Icon>,
  Logout: (p) => <Icon {...p}><path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"/><path d="M16 17l5-5-5-5M21 12H10"/></Icon>,
  ChevronRight: (p) => <Icon {...p}><path d="m9 6 6 6-6 6"/></Icon>,
  ChevronDown: (p) => <Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>,
  Plus: (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>,
  Upload: (p) => <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></Icon>,
  Download: (p) => <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></Icon>,
  Filter: (p) => <Icon {...p}><path d="M3 5h18l-7 9v6l-4-2v-4z"/></Icon>,
  Heart: (p) => <Icon {...p}><path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z"/></Icon>,
  Lock: (p) => <Icon {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></Icon>,
  Check: (p) => <Icon {...p}><path d="m5 13 4 4L19 7"/></Icon>,
  X: (p) => <Icon {...p}><path d="M6 6l12 12M18 6 6 18"/></Icon>,
  Edit: (p) => <Icon {...p}><path d="M17 3a2.83 2.83 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></Icon>,
  Eye: (p) => <Icon {...p}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></Icon>,
  ZoomIn: (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="M11 8v6M8 11h6M20 20l-3.5-3.5"/></Icon>,
  Move: (p) => <Icon {...p}><path d="M5 9 2 12l3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/></Icon>,
  Ruler: (p) => <Icon {...p}><path d="M2 15 9 8l8 8-7 7zM8 9l2 2M11 6l2 2M14 3l2 2M3 16l2 2M6 19l2 2"/></Icon>,
  Sun: (p) => <Icon {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></Icon>,
  Sliders: (p) => <Icon {...p}><path d="M4 6h7M15 6h5M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="13" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/></Icon>,
  Sparkle: (p) => <Icon {...p}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></Icon>,
  Pen: (p) => <Icon {...p}><path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18zM2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></Icon>,
  Database: (p) => <Icon {...p}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6"/></Icon>,
  Info: (p) => <Icon {...p}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></Icon>,
  AlertTriangle: (p) => <Icon {...p}><path d="m10.3 3.86-8.6 14a2 2 0 0 0 1.7 3h17.2a2 2 0 0 0 1.7-3l-8.6-14a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></Icon>,
  TrendingUp: (p) => <Icon {...p}><path d="M3 17l6-6 4 4 8-8M14 7h7v7"/></Icon>,
  TrendingDown: (p) => <Icon {...p}><path d="M3 7l6 6 4-4 8 8M14 17h7v-7"/></Icon>,
  Calendar: (p) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></Icon>,
  Clock: (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>,
  MapPin: (p) => <Icon {...p}><path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></Icon>,
  Pill: (p) => <Icon {...p}><rect x="2" y="9" width="20" height="6" rx="3" transform="rotate(-45 12 12)"/><path d="M8 8l8 8" transform="rotate(-45 12 12)"/></Icon>,
  Layers: (p) => <Icon {...p}><path d="M12 2 2 8l10 6 10-6-10-6zM2 16l10 6 10-6M2 12l10 6 10-6"/></Icon>,
  Refresh: (p) => <Icon {...p}><path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/></Icon>,
  Cross: (p) => <Icon {...p}><path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z"/></Icon>,
  Menu: (p) => <Icon {...p}><path d="M3 6h18M3 12h18M3 18h18"/></Icon>,
  ChevronLeft: (p) => <Icon {...p}><path d="m15 6-6 6 6 6"/></Icon>,
  Wave: (p) => <Icon {...p}><path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0M2 18c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/></Icon>,
  CircleDot: (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2" fill="currentColor"/></Icon>,
};

window.Icons = Icons;
