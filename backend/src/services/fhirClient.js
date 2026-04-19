const axios = require('axios');
require('dotenv').config();

const FHIR_BASE_URL = process.env.FHIR_BASE_URL || 'https://hapi.fhir.org/baseR4';

const fhirAxios = axios.create({
  baseURL: FHIR_BASE_URL,
  headers: { Accept: 'application/fhir+json' },
  timeout: 30000
});

const getPatient = async (patientId) => {
  const res = await fhirAxios.get(`/Patient/${patientId}`);
  return res.data;
};

const getObservations = async (patientId) => {
  const res = await fhirAxios.get('/Observation', {
    params: { patient: patientId, _sort: '-date', _count: 20 }
  });
  return res.data.entry || [];
};

const getConditions = async (patientId) => {
  const res = await fhirAxios.get('/Condition', {
    params: { patient: patientId, _count: 20 }
  });
  return res.data.entry || [];
};

const getMedications = async (patientId) => {
  const res = await fhirAxios.get('/MedicationRequest', {
    params: { patient: patientId, status: 'active', _count: 20 }
  });
  return res.data.entry || [];
};

module.exports = { getPatient, getObservations, getConditions, getMedications };