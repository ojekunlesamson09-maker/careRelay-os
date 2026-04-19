// SHARP Context Propagation
// Bridges EHR session credentials into SHARP context
// for Prompt Opinion platform integration

const buildSharpContext = (patientId, sessionData = {}) => {
  return {
    sharp: {
      version: '1.0',
      patient: {
        id: patientId,
        fhirServer: process.env.FHIR_BASE_URL
      },
      session: {
        userId: sessionData.userId || 'anonymous',
        role: sessionData.role || 'clinician',
        timestamp: new Date().toISOString()
      },
      intent: 'clinical-handoff',
      platform: 'careRelay-os'
    }
  };
};

const validateSharpContext = (context) => {
  return !!(context?.sharp?.patient?.id && context?.sharp?.session);
};

module.exports = { buildSharpContext, validateSharpContext };