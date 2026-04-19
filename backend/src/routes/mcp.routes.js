const express = require('express');
const router = express.Router();
const { generateHandoff, checkHealth } = require('../services/agentBridge');

// GET /api/mcp/health
router.get('/health', async (req, res) => {
  try {
    const agentHealth = await checkHealth();
    res.json({
      success: true,
      mcp_server: 'careRelay-os',
      agent_layer: agentHealth,
      tools: [
        {
          name: 'generate_clinical_handoff',
          description: 'Generates a verified clinical handoff for a patient using 4-agent AI pipeline',
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

module.exports = router;