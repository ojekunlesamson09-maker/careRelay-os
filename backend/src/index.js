require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const fhirRoutes = require('./routes/fhir.routes');
const handoffRoutes = require('./routes/handoff.routes');
const mcpRoutes = require('./routes/mcp.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ── Routes ─────────────────────────────────────────
app.use('/api/fhir', fhirRoutes);
app.use('/api/handoff', handoffRoutes);
app.use('/api/mcp', mcpRoutes);

// ── Health Check ───────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    system: 'CareRelay OS — API Gateway',
    version: '1.0.0',
    status: 'online',
    services: {
      fhir: '/api/fhir',
      handoff: '/api/handoff',
      mcp: '/api/mcp'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'backend-gateway' });
});

// ── Error Handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 CareRelay OS Backend running on http://localhost:${PORT}`);
});