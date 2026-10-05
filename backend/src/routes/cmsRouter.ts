import express from 'express';
import fs from 'fs';
import path from 'path';
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
} from '../../../src/data/travelData';

export const cmsRouter = express.Router();
export const DATA_FILE = path.join(process.cwd(), 'cms-data.json');

const DEFAULT_SECTION_ORDER = [
  'hero',
  'marquee',
  'howItWorks',
  'destinations',
  'experiences',
  'vipPrivileges',
  'packages',
  'gallery',
  'testimonials',
  'whyUs',
  'contact',
];

const DEFAULT_SECTION_VISIBILITY: Record<string, boolean> = {
  hero: true,
  destinations: true,
  marquee: true,
  experiences: true,
  vipPrivileges: true,
  howItWorks: true,
  packages: true,
  gallery: true,
  testimonials: true,
  whyUs: true,
  contact: true,
};

const DEFAULT_CUSTOM_SECTIONS: any[] = [];


export let cmsData: any = {
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
  sectionHeaders: {},
};

// Load saved CMS data if exists on server launch
if (fs.existsSync(DATA_FILE)) {
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(rawData);
    cmsData = {
      ...cmsData,
      ...parsed,
      sectionOrder: (parsed.sectionOrder || DEFAULT_SECTION_ORDER).filter((k: string) => k !== 'about' && k !== 'vip-perks' && k !== 'dreamToDeparture'),
      sectionVisibility: { ...DEFAULT_SECTION_VISIBILITY, ...(parsed.sectionVisibility || {}) },
      destinations: parsed.destinations || DESTINATIONS,
      packages: parsed.packages || POPULAR_PACKAGES,
      marquee: parsed.marquee || MARQUEE_ITEMS,
      testimonials: parsed.testimonials || TESTIMONIALS,
      experiencePillars: parsed.experiencePillars || EXPERIENCE_PILLARS,
      gallery: parsed.gallery || GALLERY_ITEMS,
      customSections: (parsed.customSections || DEFAULT_CUSTOM_SECTIONS).filter((s: any) => s.id !== 'vip-perks'),
      companyInfo: { ...COMPANY_INFO, ...(parsed.companyInfo || {}) },
      howItWorksSteps: parsed.howItWorksSteps || HOW_IT_WORKS_STEPS,
      whyUsPillars: parsed.whyUsPillars || WHY_US_PILLARS,
      sectionHeaders: parsed.sectionHeaders || {},
    };
  } catch (e) {
    console.error('Error parsing cms-data.json', e);
  }
}

cmsRouter.get('/', (req, res) => {
  res.json(cmsData);
});

cmsRouter.post('/', (req, res) => {
  try {
    cmsData = {
      ...cmsData,
      ...req.body,
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
    console.error('Error saving CMS data:', err);
    res.status(500).json({ error: 'Failed to save CMS data to server storage.' });
  }
});

cmsRouter.post('/reset', (req, res) => {
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
    companyInfo: COMPANY_INFO,
  };

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(cmsData, null, 2));
    res.json({ success: true, message: 'CMS reset to defaults.', data: cmsData });
  } catch (e) {
    res.status(500).json({ error: 'Failed to reset CMS data.' });
  }
});
