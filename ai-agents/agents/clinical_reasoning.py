import json
from core.llm_client import call_llm

PROVIDER = "groq"

SYSTEM_PROMPT = """You are a senior clinical reasoning agent in a hospital AI system.
Your job is to convert patient data and risk analysis into a structured SBAR handoff.
SBAR = Situation, Background, Assessment, Recommendation.

Every statement you make MUST be grounded in the actual patient data provided.
Do NOT invent or assume information not present in the data.

You must output ONLY valid JSON with this exact structure:
{
  "sbar": {
    "situation": "string - what is happening RIGHT NOW with this patient",
    "background": "string - relevant medical history and context",
    "assessment": "string - your clinical assessment of the patient's condition",
    "recommendation": "string - specific actions for the receiving clinician"
  },
  "handoff_summary": "string - 2-3 sentence executive summary",
  "priority_items": ["top 3-5 things receiving clinician must know immediately"],
  "pending_tasks": ["list of outstanding orders, results, or follow-ups"],
  "data_sources_used": ["list of FHIR data points used in this handoff"],
  "confidence_level": "HIGH|MEDIUM|LOW",
  "confidence_reason": "string - why this confidence level"
}
Output only JSON. No explanation. No markdown."""


def run(patient_data: dict, context: dict, risk: dict) -> dict:
    """Agent 3: Generate structured SBAR clinical handoff"""
    user_prompt = f"""
Generate a complete SBAR clinical handoff for this patient:

Patient: {patient_data['name']} | {patient_data['gender']} | DOB: {patient_data['birthDate']}

Unified Patient Context:
{json.dumps(context, indent=2)}

Risk Intelligence Report:
{json.dumps(risk, indent=2)}

Generate a clinically accurate, data-grounded SBAR handoff now.
Every claim must be traceable to the data above.
"""
    result = call_llm(PROVIDER, SYSTEM_PROMPT, user_prompt, temperature=0.2)

    try:
        return json.loads(result)
    except json.JSONDecodeError:
        import re
        match = re.search(r'\{.*\}', result, re.DOTALL)
        if match:
            return json.loads(match.group())
        raise Exception("Clinical Reasoning failed to return valid JSON")