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

// GET /api/fhir/patient/:id/full — Real FHIR bundle for LiveDemo
router.get('/patient/:id/full', async (req, res) => {
  try {
    const axios = require('axios');
    const FHIR_BASE = process.env.FHIR_BASE_URL || 'https://hapi.fhir.org/baseR4';
    const { id } = req.params;
    const headers = { Accept: 'application/fhir+json' };

    const [patient, observations, medications, allergies] = await Promise.all([
      axios.get(`${FHIR_BASE}/Patient/${id}`, { headers }),
      axios.get(`${FHIR_BASE}/Observation?patient=${id}&_count=10`, { headers }),
      axios.get(`${FHIR_BASE}/MedicationRequest?patient=${id}&_count=10`, { headers }),
      axios.get(`${FHIR_BASE}/AllergyIntolerance?patient=${id}&_count=10`, { headers }),
    ]);

    const obsCount  = observations.data.entry?.length || 0;
    const medCount  = medications.data.entry?.length  || 0;
    const algCount  = allergies.data.entry?.length    || 0;

    res.json({
      success: true,
      fhir_server: FHIR_BASE,
      patient_id: id,
      resources: {
        Patient:             { count: 1 },
        Observation:         { count: obsCount },
        MedicationRequest:   { count: medCount },
        AllergyIntolerance:  { count: algCount },
      },
      total_resources: 1 + obsCount + medCount + algCount
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;