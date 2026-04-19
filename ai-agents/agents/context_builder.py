import json
from core.llm_client import call_llm

PROVIDER = "groq"

SYSTEM_PROMPT = """You are a clinical context builder agent in a hospital AI system.
Your job is to take raw patient FHIR data and reconstruct a complete, 
unified patient timeline that a clinician can understand at a glance.

You must output ONLY valid JSON with this exact structure:
{
  "patient_summary": "string - one paragraph overview",
  "timeline": [
    {"date": "string", "event": "string", "type": "vital|medication|condition|encounter"}
  ],
  "current_medications": ["list of active medications with dosages"],
  "active_conditions": ["list of active diagnoses"],
  "recent_vitals": {
    "blood_pressure": "string or null",
    "heart_rate": "string or null", 
    "temperature": "string or null",
    "oxygen_saturation": "string or null",
    "respiratory_rate": "string or null"
  },
  "data_completeness": "complete|partial|minimal"
}
Output only JSON. No explanation. No markdown."""


def run(patient_data: dict) -> dict:
    """Agent 1: Build unified patient context from FHIR data"""
    user_prompt = f"""
Build a complete clinical context from this patient data:

Patient: {patient_data['name']}
Gender: {patient_data['gender']}
Date of Birth: {patient_data['birthDate']}

Observations/Vitals:
{json.dumps(patient_data['observations'], indent=2)}

Active Conditions:
{json.dumps(patient_data['conditions'], indent=2)}

Current Medications:
{json.dumps(patient_data['medications'], indent=2)}

Recent Encounters:
{json.dumps(patient_data['encounters'], indent=2)}

Build the unified patient timeline now.
"""
    result = call_llm(PROVIDER, SYSTEM_PROMPT, user_prompt, temperature=0.2)

    try:
        return json.loads(result)
    except json.JSONDecodeError:
        import re
        match = re.search(r'\{.*\}', result, re.DOTALL)
        if match:
            return json.loads(match.group())
        raise Exception("Context Builder failed to return valid JSON")