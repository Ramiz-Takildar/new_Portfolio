const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Data storage file
const CONTACTS_FILE = path.join(__dirname, 'data', 'contacts.json');
const PROJECTS_FILE = path.join(__dirname, 'data', 'projects.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper to read JSON file
const readJSON = (file) => {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
};

// Helper to write JSON file
const writeJSON = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
};

// API Routes

// GET all projects
app.get('/api/projects', (req, res) => {
  const projects = readJSON(PROJECTS_FILE);
  res.json(projects);
});

// GET project by ID
app.get('/api/projects/:id', (req, res) => {
  const projects = readJSON(PROJECTS_FILE);
  const project = projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

// POST contact form
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const contact = {
    id: Date.now().toString(),
    name,
    email,
    subject,
    message,
    timestamp: new Date().toISOString(),
    read: false
  };

  const contacts = readJSON(CONTACTS_FILE);
  contacts.push(contact);
  writeJSON(CONTACTS_FILE, contacts);

  res.status(201).json({ success: true, message: 'Message received!', contact });
});

// GET all contacts (admin)
app.get('/api/admin/contacts', (req, res) => {
  const contacts = readJSON(CONTACTS_FILE);
  res.json(contacts);
});

// GET contact stats
app.get('/api/stats', (req, res) => {
  const contacts = readJSON(CONTACTS_FILE);
  const unread = contacts.filter(c => !c.read).length;
  res.json({
    totalMessages: contacts.length,
    unreadMessages: unread,
    lastMessage: contacts.length > 0 ? contacts[contacts.length - 1].timestamp : null
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for all unknown routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Portfolio API running on http://localhost:${PORT}`);
  console.log(`API endpoints: /api/projects, /api/contact, /api/stats`);
});
