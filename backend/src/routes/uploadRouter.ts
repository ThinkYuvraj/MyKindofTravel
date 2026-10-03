import express from 'express';
import fs from 'fs';
import path from 'path';
import { cmsData, DATA_FILE } from './cmsRouter';

export const uploadRouter = express.Router();

uploadRouter.post('/upload-video', (req, res) => {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const videoPath = path.join(publicDir, 'hero-video.mp4');

    if (Buffer.isBuffer(req.body) && req.body.length > 0) {
      fs.writeFileSync(videoPath, req.body);
    } else if (req.body && typeof req.body.dataUrl === 'string') {
      const base64Data = req.body.dataUrl.replace(/^data:video\/\w+;base64,/, '');
      fs.writeFileSync(videoPath, Buffer.from(base64Data, 'base64'));
    } else {
      return res.status(400).json({ error: 'No video payload received.' });
    }

    const videoUrl = `/hero-video.mp4?t=${Date.now()}`;
    cmsData.heroBgImage = videoUrl;
    if (cmsData.sectionHeaders?.hero) {
      cmsData.sectionHeaders.hero.image = videoUrl;
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(cmsData, null, 2));

    res.json({ success: true, videoUrl });
  } catch (err: any) {
    console.error('Failed to save uploaded video:', err);
    res.status(500).json({ error: 'Failed to save video file.' });
  }
});
