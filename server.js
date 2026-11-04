const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32 || /placeholder|change.?me|your.?secret|replace.?with|example/i.test(jwtSecret)) {
  throw new Error('JWT_SECRET must be set to a unique random value of at least 32 characters.');
}

const { testConnection } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const testRoutes = require('./routes/testRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const faqRoutes = require('./routes/faqRoutes');
const mentorshipRoutes = require('./routes/mentorshipRoutes');
const forumRoutes = require('./routes/forumRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const advisorRoutes = require('./routes/advisorRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------------------------------------------------
// Middlewares globaux
// ------------------------------------------------------------
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ------------------------------------------------------------
// Fichiers statiques (frontend)
// ------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------------------------------
// Routes API
// ------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/test', testRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/advisor', advisorRoutes);

// Route de sante de l'API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MA-ORIENTATION API operationnelle',
    timestamp: new Date().toISOString()
  });
});

// ------------------------------------------------------------
// Gestion des routes API inconnues (404 JSON)
// ------------------------------------------------------------
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'Route API introuvable.' });
});

// ------------------------------------------------------------
// Toute autre route sert index.html (SPA-like fallback)
// ------------------------------------------------------------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ------------------------------------------------------------
// Gestionnaire d'erreurs global
// ------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error('Erreur non geree :', err.stack);
  res.status(500).json({ success: false, message: 'Une erreur interne du serveur est survenue.' });
});

// ------------------------------------------------------------
// Demarrage du serveur
// ------------------------------------------------------------
app.listen(PORT, async () => {
  console.log('============================================');
  console.log('  MA-ORIENTATION');
  console.log(`  Serveur demarre sur http://localhost:${PORT}`);
  console.log('============================================');
  await testConnection();
});

module.exports = app;
