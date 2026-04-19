const express = require('express');
const router = express.Router();
const {
  getPatient,
  getObservations,
  getConditions,
  getMedications
} = require('../services/fhirClient');

// GET /api/fhir/patient/:id
router.get('/patient/:id', async (req, res) => {
  try {
    const data = await getPatient(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/fhir/patient/:id/observations
router.get('/patient/:id/observations', async (req, res) => {
  try {
    const data = await getObservations(req.params.id);
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/fhir/patient/:id/conditions
router.get('/patient/:id/conditions', async (req, res) => {
  try {
    const data = await getConditions(req.params.id);
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/fhir/patient/:id/medications
router.get('/patient/:id/medications', async (req, res) => {
  try {
    const data = await getMedications(req.params.id);
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;