import express from 'express';
import fs from 'fs';
import path from 'path';

export const inquiriesRouter = express.Router();
const INQUIRIES_FILE = path.join(process.cwd(), 'inquiries.json');

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

inquiriesRouter.get('/', (req, res) => {
  const inquiries = getStoredInquiries();
  res.json(inquiries);
});

inquiriesRouter.post('/', (req, res) => {
  try {
    const inquiries = getStoredInquiries();
    const newInquiry = {
      id: Date.now().toString(),
      refId: 'MKT-' + Math.floor(100000 + Math.random() * 900000),
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    inquiries.unshift(newInquiry);
    saveInquiries(inquiries);
    res.json({ success: true, inquiry: newInquiry });
  } catch (e) {
    res.status(500).json({ error: 'Failed to save inquiry.' });
  }
});

inquiriesRouter.patch('/:id/status', (req, res) => {
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

inquiriesRouter.delete('/:id', (req, res) => {
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
