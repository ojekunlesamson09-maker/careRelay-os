const express = require('express');
const router = express.Router();
const { generateHandoff, getPatientContext } = require('../services/agentBridge');
const { buildSharpContext } = require('../services/sharpContext');

// POST /api/handoff/:patientId — Full 4-agent pipeline
router.post('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log(`[Handoff] Starting pipeline for patient ${patientId}`);

    // Build SHARP context
    const sharpContext = buildSharpContext(patientId, {
      userId: req.headers['x-user-id'] || 'anonymous',
      role: req.headers['x-user-role'] || 'clinician'
    });

    // Run full 4-agent pipeline
    const result = await generateHandoff(patientId);

    res.json({
      success: true,
      sharp_context: sharpContext,
      ...result
    });
  } catch (err) {
    console.error('[Handoff] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/handoff/:patientId/context — Just patient context
router.get('/:patientId/context', async (req, res) => {
  try {
    const { patientId } = req.params;
    const context = await getPatientContext(patientId);
    res.json({ success: true, ...context });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;