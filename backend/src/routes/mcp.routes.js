const express = require('express');
const router = express.Router();
const { generateHandoff, checkHealth } = require('../services/agentBridge');

// GET /api/mcp/health
router.get('/health', async (req, res) => {
  try {
    res.json({
      success: true,
      mcp_server: 'careRelay-os',
      status: 'online',
      tools: [
        {
          name: 'generate_clinical_handoff',
          description: 'Generates a verified clinical handoff for a patient using 4-agent AI pipeline',
          parameters: { patient_id: 'string' }
        },
        {
          name: 'get_patient_risk_assessment',
          description: 'Fetches FHIR patient data and runs risk intelligence analysis',
          parameters: { patient_id: 'string' }
        },
        {
          name: 'get_patient_context',
          description: 'Fetches and parses full FHIR patient context',
          parameters: { patient_id: 'string' }
        }
      ]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/mcp/tools/generate_clinical_handoff
router.post('/tools/generate_clinical_handoff', async (req, res) => {
  try {
    const { patient_id } = req.body;
    if (!patient_id) {
      return res.status(400).json({ error: 'patient_id is required' });
    }
    const result = await generateHandoff(patient_id);
    res.json({ success: true, tool: 'generate_clinical_handoff', result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/mcp/tools/get_patient_context
router.post('/tools/get_patient_context', async (req, res) => {
  try {
    const { patient_id } = req.body;
    if (!patient_id) {
      return res.status(400).json({ error: 'patient_id is required' });
    }
    const axios = require('axios');
    const AI_URL = process.env.AI_AGENTS_URL || 'http://localhost:8000';
    const result = await axios.get(`${AI_URL}/patient/${patient_id}/context`);
    res.json({ success: true, tool: 'get_patient_context', result: result.data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/mcp/tools/get_patient_risk_assessment
router.post('/tools/get_patient_risk_assessment', async (req, res) => {
  try {
    const { patient_id } = req.body;
    if (!patient_id) {
      return res.status(400).json({ error: 'patient_id is required' });
    }
    const axios = require('axios');
    const AI_URL = process.env.AI_AGENTS_URL || 'http://localhost:8000';
    const result = await axios.post(`${AI_URL}/handoff`, { patient_id });
    res.json({
      success: true,
      tool: 'get_patient_risk_assessment',
      result: {
        patient_id,
        urgency_level: result.data.urgency_level,
        risk: result.data.risk
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;