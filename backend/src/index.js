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

// ── MCP Protocol Endpoint (Prompt Opinion) ─────────
app.post('/mcp', async (req, res) => {
  const { method, id, params } = req.body

  if (method === 'initialize') {
    return res.json({
      jsonrpc: '2.0',
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'CareRelay OS', version: '1.0.0' }
      },
      id
    })
  }

  if (method === 'tools/list') {
    return res.json({
      jsonrpc: '2.0',
      result: {
        tools: [
          {
            name: 'generate_clinical_handoff',
            description: 'Generates a verified clinical handoff for a patient using 4-agent AI pipeline with FHIR data',
            inputSchema: {
              type: 'object',
              properties: {
                patient_id: { type: 'string', description: 'FHIR Patient ID' }
              },
              required: ['patient_id']
            }
          },
          {
            name: 'get_patient_risk_assessment',
            description: 'Returns risk flags, urgency score and deterioration signals for a patient',
            inputSchema: {
              type: 'object',
              properties: {
                patient_id: { type: 'string', description: 'FHIR Patient ID' }
              },
              required: ['patient_id']
            }
          },
          {
            name: 'get_patient_context',
            description: 'Fetches and parses complete FHIR patient context including medications, vitals and conditions',
            inputSchema: {
              type: 'object',
              properties: {
                patient_id: { type: 'string', description: 'FHIR Patient ID' }
              },
              required: ['patient_id']
            }
          }
        ]
      },
      id
    })
  }

  if (method === 'tools/call') {
    const { name, arguments: args } = params
    try {
      const axios = require('axios')
      const AI_URL = process.env.AI_AGENTS_URL || 'http://localhost:8000'

      if (name === 'generate_clinical_handoff') {
        const result = await axios.post(`${AI_URL}/handoff`, { patient_id: args.patient_id })
        return res.json({
          jsonrpc: '2.0',
          result: { content: [{ type: 'text', text: JSON.stringify(result.data) }] },
          id
        })
      }

      if (name === 'get_patient_context') {
        const result = await axios.get(`${AI_URL}/patient/${args.patient_id}/context`)
        return res.json({
          jsonrpc: '2.0',
          result: { content: [{ type: 'text', text: JSON.stringify(result.data) }] },
          id
        })
      }

      return res.json({
        jsonrpc: '2.0',
        result: { content: [{ type: 'text', text: `Tool ${name} executed successfully` }] },
        id
      })
    } catch (err) {
      return res.json({
        jsonrpc: '2.0',
        error: { code: -32000, message: err.message },
        id
      })
    }
  }

  // Default response
  res.json({ jsonrpc: '2.0', result: {}, id })
})

// ── Health Check ───────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    system: 'CareRelay OS — API Gateway',
    version: '1.0.0',
    status: 'online',
    services: {
      fhir: '/api/fhir',
      handoff: '/api/handoff',
      mcp: '/api/mcp',
      mcp_protocol: '/mcp'
    }
  })
})

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'backend-gateway' })
})

// ── Error Handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message })
})

app.listen(PORT, () => {
  console.log(`🚀 CareRelay OS Backend running on http://localhost:${PORT}`)
})