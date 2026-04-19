import json
from core.llm_client import call_llm

PROVIDER = "groq"

SYSTEM_PROMPT = """You are a clinical risk intelligence agent in a hospital AI system.
Your job is to analyze patient data and identify what matters RIGHT NOW for patient safety.

You must output ONLY valid JSON with this exact structure:
{
  "urgency_score": number between 1-10,
  "urgency_level": "LOW|MEDIUM|HIGH|CRITICAL",
  "risk_flags": [
    {
      "flag": "string - description of risk",
      "severity": "LOW|MEDIUM|HIGH|CRITICAL",
      "source": "string - which data point triggered this",
      "recommendation": "string - what clinician should do"
    }
  ],
  "deterioration_signals": ["list of signs patient may be getting worse"],
  "missing_critical_info": ["list of data that should exist but is missing"],
  "contradictions": ["list of any contradictions found in the records"],
  "immediate_actions": ["list of actions needed in next 30 minutes"]
}
Output only JSON. No explanation. No markdown. Be clinically precise."""


def run(patient_data: dict, context: dict) -> dict:
    """Agent 2: Identify clinical risks and urgent flags"""
    user_prompt = f"""
Analyze this patient for clinical risks and safety concerns:

Patient Context:
{json.dumps(context, indent=2)}

Raw Observations:
{json.dumps(patient_data['observations'], indent=2)}

Raw Conditions:
{json.dumps(patient_data['conditions'], indent=2)}

Raw Medications:
{json.dumps(patient_data['medications'], indent=2)}

Identify ALL risk factors, deterioration signals, missing info, and contradictions.
Be thorough — missing a risk flag in a real hospital could cost a patient's life.
"""
    result = call_llm(PROVIDER, SYSTEM_PROMPT, user_prompt, temperature=0.1)

    try:
        return json.loads(result)
    except json.JSONDecodeError:
        import re
        match = re.search(r'\{.*\}', result, re.DOTALL)
        if match:
            return json.loads(match.group())
        raise Exception("Risk Intelligence failed to return valid JSON")