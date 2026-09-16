import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { DESTINATIONS, POPULAR_PACKAGES, MARQUEE_ITEMS } from "./src/data/travelData";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

const DATA_FILE = path.join(process.cwd(), 'cms-data.json');

// Default CMS state
let cmsData: any = {
  heroTitle: 'EXPLORE. DREAM. DISCOVER.',
  heroSubtitle: "Handcrafted luxury holidays, private European chalets, honeymoon cliffside villas, and bespoke journeys tailored for India's discerning travellers.",
  primaryButton: 'START EXPLORING',
  secondaryButton: 'PLAN TRIP',
  destinations: DESTINATIONS,
  packages: POPULAR_PACKAGES,
  marquee: MARQUEE_ITEMS
};

// Load data if exists
if (fs.existsSync(DATA_FILE)) {
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    cmsData = { ...cmsData, ...JSON.parse(rawData) };
  } catch (e) {
    console.error("Error parsing cms-data.json", e);
  }
}

// Login Route
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const validEmail = process.env.VITE_ADMIN_EMAIL || 'marketing2glue@gmail.com';
  const validPassword = process.env.VITE_ADMIN_PASSWORD || 'Admin@8369';
  
  if (email === validEmail && password === validPassword) {
    res.json({ token: 'secure-admin-token' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// CMS Routes
app.get("/api/cms", (req, res) => {
  res.json(cmsData);
});

app.post("/api/cms", (req, res) => {
  // Merge new data
  cmsData = { ...cmsData, ...req.body };
  // Save to file
  fs.writeFileSync(DATA_FILE, JSON.stringify(cmsData, null, 2));
  res.json({ success: true, data: cmsData });
});

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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
