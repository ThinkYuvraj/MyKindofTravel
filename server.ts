import 'dotenv/config';
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import {
  DESTINATIONS,
  POPULAR_PACKAGES,
  MARQUEE_ITEMS,
  TESTIMONIALS,
  EXPERIENCE_PILLARS,
  COMPANY_INFO,
  GALLERY_ITEMS,
  HOW_IT_WORKS_STEPS,
  WHY_US_PILLARS,
} from "./src/data/travelData";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

const DATA_FILE = path.join(process.cwd(), 'cms-data.json');
const CREDENTIALS_FILE = path.join(process.cwd(), 'cms-credentials.json');
const INQUIRIES_FILE = path.join(process.cwd(), 'inquiries.json');

// --- CREDENTIALS BACKEND STORAGE ---
interface AdminCredentials {
  email: string;
  passwordHash: string; // stored credentials string
  updatedAt: string;
}

function getStoredCredentials(): AdminCredentials {
  const defaultEmail = process.env.VITE_ADMIN_EMAIL || 'marketing2glue@gmail.com';
  const defaultPassword = process.env.VITE_ADMIN_PASSWORD || 'Admin@8369';

  if (fs.existsSync(CREDENTIALS_FILE)) {
    try {
      const raw = fs.readFileSync(CREDENTIALS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.email && parsed.passwordHash) {
        return parsed;
      }
    } catch (e) {
      console.error("Error reading credentials file, falling back to default", e);
    }
  }

  // Seed default file
  const defaultCreds: AdminCredentials = {
    email: defaultEmail,
    passwordHash: defaultPassword,
    updatedAt: new Date().toISOString()
  };
  try {
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(defaultCreds, null, 2));
  } catch (err) {
    console.error("Error writing default credentials file", err);
  }
  return defaultCreds;
}

function saveCredentials(creds: AdminCredentials) {
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(creds, null, 2));
}

// --- CMS DATA BACKEND STORAGE ---
const DEFAULT_SECTION_ORDER = [
  'hero',
  'destinations',
  'marquee',
  'about',
  'radar',
  'experiences',
  'howItWorks',
  'packages',
  'gallery',
  'testimonials',
  'whyUs',
  'contact'
];

const DEFAULT_SECTION_VISIBILITY: Record<string, boolean> = {
  hero: true,
  destinations: true,
  marquee: true,
  about: true,
  radar: true,
  experiences: true,
  howItWorks: true,
  packages: true,
  gallery: true,
  testimonials: true,
  whyUs: true,
  contact: true
};

const DEFAULT_CUSTOM_SECTIONS = [
  {
    id: 'vip-perks',
    title: 'Signature VIP Privileges',
    subtitle: 'Exclusive perks reserved for our private clients',
    badgeText: 'Curated Privileges',
    layout: 'grid-cards' as const,
    theme: 'light' as const,
    enabled: true,
    items: [
      {
        id: 'perk-1',
        title: 'Priority Airport Fast-Track',
        description: 'Skip long queues worldwide with chauffeured airside tarmac transfers and priority customs clearance.',
        badge: 'Airside VIP',
        icon: 'Plane'
      },
      {
        id: 'perk-2',
        title: 'Guaranteed Suite Upgrades',
        description: 'Preferred partner status across Four Seasons, Aman, Belmond, and Ritz-Carlton reserves with complimentary upgrades.',
        badge: 'Bespoke Stays',
        icon: 'Sparkles'
      },
      {
        id: 'perk-3',
        title: 'Private Yacht & Heli Charters',
        description: 'Immediate on-demand access to private catamarans in Santorini, Riva speedboats in Amalfi, and scenic alpine helicopters in Zermatt.',
        badge: 'Private Fleet',
        icon: 'Compass'
      },
      {
        id: 'perk-4',
        title: '24/7 Dedicated Indian Concierge',
        description: 'Direct WhatsApp line to your private travel specialist for real-time adjustments, dining reservations, and urgent assistance.',
        badge: 'White Glove',
        icon: 'HeartHandshake'
      }
    ]
  }
];

let cmsData: any = {
  heroTitle: 'EXPLORE. DREAM. DISCOVER.',
  heroSubtitle: "Handcrafted luxury holidays, private European chalets, honeymoon cliffside villas, and bespoke journeys tailored for India's discerning travellers.",
  heroBadge: 'My Kind of Travel • Bespoke Journeys',
  heroBgImage: '',
  primaryButton: 'START EXPLORING',
  secondaryButton: 'PLAN TRIP',
  sectionOrder: DEFAULT_SECTION_ORDER,
  sectionVisibility: DEFAULT_SECTION_VISIBILITY,
  destinations: DESTINATIONS,
  packages: POPULAR_PACKAGES,
  marquee: MARQUEE_ITEMS,
  testimonials: TESTIMONIALS,
  experiencePillars: EXPERIENCE_PILLARS,
  gallery: GALLERY_ITEMS,
  customSections: DEFAULT_CUSTOM_SECTIONS,
  companyInfo: COMPANY_INFO,
  howItWorksSteps: HOW_IT_WORKS_STEPS,
  whyUsPillars: WHY_US_PILLARS,
  sectionHeaders: {}
};

// Load saved CMS data if exists
if (fs.existsSync(DATA_FILE)) {
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(rawData);
    cmsData = {
      ...cmsData,
      ...parsed,
      // Ensure arrays and objects exist if missing in older saves
      sectionOrder: parsed.sectionOrder || DEFAULT_SECTION_ORDER,
      sectionVisibility: { ...DEFAULT_SECTION_VISIBILITY, ...(parsed.sectionVisibility || {}) },
      destinations: parsed.destinations || DESTINATIONS,
      packages: parsed.packages || POPULAR_PACKAGES,
      marquee: parsed.marquee || MARQUEE_ITEMS,
      testimonials: parsed.testimonials || TESTIMONIALS,
      experiencePillars: parsed.experiencePillars || EXPERIENCE_PILLARS,
      gallery: parsed.gallery || GALLERY_ITEMS,
      customSections: parsed.customSections || DEFAULT_CUSTOM_SECTIONS,
      companyInfo: { ...COMPANY_INFO, ...(parsed.companyInfo || {}) },
      howItWorksSteps: parsed.howItWorksSteps || HOW_IT_WORKS_STEPS,
      whyUsPillars: parsed.whyUsPillars || WHY_US_PILLARS,
      sectionHeaders: parsed.sectionHeaders || {}
    };
  } catch (e) {
    console.error("Error parsing cms-data.json", e);
  }
}

// Inquiries storage
function getStoredInquiries(): any[] {
  if (fs.existsSync(INQUIRIES_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf-8'));
    } catch (e) {
      return [];
    }
  }
  return [];
}

function saveInquiries(inquiries: any[]) {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));
}

// ==========================================
// AUTHENTICATION & CREDENTIALS API ROUTES
// ==========================================

// Login route (Supports both /api/login and /api/auth/login)
const handleLogin = (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;
  const currentCreds = getStoredCredentials();

  if (
    email &&
    password &&
    email.trim().toLowerCase() === currentCreds.email.trim().toLowerCase() &&
    password === currentCreds.passwordHash
  ) {
    res.json({
      token: 'secure-admin-token-' + Date.now(),
      user: {
        email: currentCreds.email,
        role: 'Super Admin',
        lastLogin: new Date().toISOString()
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid email or password.' });
  }
};

app.post("/api/login", handleLogin);
app.post("/api/auth/login", handleLogin);

// Get current credentials status
app.get("/api/auth/profile", (req, res) => {
  const currentCreds = getStoredCredentials();
  res.json({
    email: currentCreds.email,
    role: 'Super Admin',
    lastUpdated: currentCreds.updatedAt
  });
});

// Update credentials route (Securely updates email & password stored on backend)
app.post("/api/auth/update-credentials", (req, res) => {
  const { currentPassword, newEmail, newPassword } = req.body;
  const currentCreds = getStoredCredentials();

  if (!currentPassword) {
    return res.status(400).json({ error: 'Current password is required to authorise changes.' });
  }

  if (currentPassword !== currentCreds.passwordHash) {
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }

  if (newEmail && !newEmail.includes('@')) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  if (newPassword && newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  const updatedCreds: AdminCredentials = {
    email: newEmail ? newEmail.trim() : currentCreds.email,
    passwordHash: newPassword ? newPassword : currentCreds.passwordHash,
    updatedAt: new Date().toISOString()
  };

  try {
    saveCredentials(updatedCreds);
    res.json({
      success: true,
      message: 'Admin credentials updated successfully on the server!',
      user: {
        email: updatedCreds.email,
        role: 'Super Admin',
        lastUpdated: updatedCreds.updatedAt
      }
    });
  } catch (err: any) {
    console.error("Error saving credentials:", err);
    res.status(500).json({ error: 'Failed to write credentials to server.' });
  }
});

// ==========================================
// CMS DATA API ROUTES
// ==========================================

// Get all CMS data
app.get("/api/cms", (req, res) => {
  res.json(cmsData);
});

// Update CMS data
app.post("/api/cms", (req, res) => {
  try {
    cmsData = {
      ...cmsData,
      ...req.body,
      // Keep sectionOrder and sectionVisibility properly structured
      sectionOrder: req.body.sectionOrder || cmsData.sectionOrder || DEFAULT_SECTION_ORDER,
      sectionVisibility: req.body.sectionVisibility || cmsData.sectionVisibility || DEFAULT_SECTION_VISIBILITY,
      customSections: req.body.customSections || cmsData.customSections || [],
      destinations: req.body.destinations || cmsData.destinations || [],
      packages: req.body.packages || cmsData.packages || [],
      testimonials: req.body.testimonials || cmsData.testimonials || [],
      experiencePillars: req.body.experiencePillars || cmsData.experiencePillars || [],
      gallery: req.body.gallery || cmsData.gallery || GALLERY_ITEMS,
      companyInfo: req.body.companyInfo || cmsData.companyInfo || COMPANY_INFO,
      howItWorksSteps: req.body.howItWorksSteps || cmsData.howItWorksSteps || HOW_IT_WORKS_STEPS,
      whyUsPillars: req.body.whyUsPillars || cmsData.whyUsPillars || WHY_US_PILLARS,
      sectionHeaders: req.body.sectionHeaders || cmsData.sectionHeaders || {},
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(cmsData, null, 2));
    res.json({ success: true, message: 'CMS updated successfully!', data: cmsData });
  } catch (err: any) {
    console.error("Error saving CMS data:", err);
    res.status(500).json({ error: 'Failed to save CMS data to server storage.' });
  }
});

// Reset CMS to defaults if requested
app.post("/api/cms/reset", (req, res) => {
  const { confirmation } = req.body;
  if (confirmation !== 'RESET_CONFIRM') {
    return res.status(400).json({ error: 'Confirmation required.' });
  }

  cmsData = {
    heroTitle: 'EXPLORE. DREAM. DISCOVER.',
    heroSubtitle: "Handcrafted luxury holidays, private European chalets, honeymoon cliffside villas, and bespoke journeys tailored for India's discerning travellers.",
    heroBadge: 'My Kind of Travel • Bespoke Journeys',
    heroBgImage: '',
    primaryButton: 'START EXPLORING',
    secondaryButton: 'PLAN TRIP',
    sectionOrder: DEFAULT_SECTION_ORDER,
    sectionVisibility: DEFAULT_SECTION_VISIBILITY,
    destinations: DESTINATIONS,
    packages: POPULAR_PACKAGES,
    marquee: MARQUEE_ITEMS,
    testimonials: TESTIMONIALS,
    experiencePillars: EXPERIENCE_PILLARS,
    gallery: GALLERY_ITEMS,
    customSections: DEFAULT_CUSTOM_SECTIONS,
    companyInfo: COMPANY_INFO
  };

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(cmsData, null, 2));
    res.json({ success: true, message: 'CMS reset to defaults.', data: cmsData });
  } catch (e) {
    res.status(500).json({ error: 'Failed to reset CMS data.' });
  }
});

// ==========================================
// INQUIRIES & LEADS API ROUTES
// ==========================================

app.get("/api/inquiries", (req, res) => {
  const inquiries = getStoredInquiries();
  res.json(inquiries);
});

app.post("/api/inquiries", (req, res) => {
  try {
    const inquiries = getStoredInquiries();
    const newInquiry = {
      id: Date.now().toString(),
      refId: 'MKT-' + Math.floor(100000 + Math.random() * 900000),
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    inquiries.unshift(newInquiry);
    saveInquiries(inquiries);
    res.json({ success: true, inquiry: newInquiry });
  } catch (e) {
    res.status(500).json({ error: 'Failed to save inquiry.' });
  }
});

// Update inquiry status
app.patch("/api/inquiries/:id/status", (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['new', 'contacted', 'quoted', 'booked'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }
    let inquiries = getStoredInquiries();
    const index = inquiries.findIndex((item: any) => item.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }
    inquiries[index] = { ...inquiries[index], status };
    saveInquiries(inquiries);
    res.json({ success: true, inquiry: inquiries[index] });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update inquiry status.' });
  }
});

// Delete inquiry
app.delete("/api/inquiries/:id", (req, res) => {
  try {
    const { id } = req.params;
    let inquiries = getStoredInquiries();
    const before = inquiries.length;
    inquiries = inquiries.filter((item: any) => item.id !== id);
    if (inquiries.length === before) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }
    saveInquiries(inquiries);
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete inquiry.' });
  }
});

// ==========================================
// SERVER START & VITE SPA FALLBACK
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

