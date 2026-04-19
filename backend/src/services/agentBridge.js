const axios = require('axios');
require('dotenv').config();

const AI_AGENTS_URL = process.env.AI_AGENTS_URL || 'http://localhost:8000';

const agentAxios = axios.create({
  baseURL: AI_AGENTS_URL,
  timeout: 120000 // 2 min timeout for full pipeline
});

const generateHandoff = async (patientId) => {
  const res = await agentAxios.post('/handoff', { patient_id: patientId });
  return res.data;
};

const getPatientContext = async (patientId) => {
  const res = await agentAxios.get(`/patient/${patientId}/context`);
  return res.data;
};

const checkHealth = async () => {
  const res = await agentAxios.get('/health');
  return res.data;
};

module.exports = { generateHandoff, getPatientContext, checkHealth };