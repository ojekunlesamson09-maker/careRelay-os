import json
import re
from core.llm_client import call_llm

PROVIDER = "groq"

SYSTEM_PROMPT = """You are a clinical handoff validation agent — the final safety gate
in a hospital AI system. Your ONLY job is patient safety through verification.

You must check every single claim in the handoff against the source FHIR data.
You must be conservative — if you cannot confirm something from the data, flag it.
You must remove or flag anything that cannot be verified.

You must output ONLY valid JSON with this exact structure:
{
  "validation_status": "VERIFIED|PARTIALLY_VERIFIED|FAILED",
  "safety_score": 85,
  "verified_claims": ["list of claims confirmed against FHIR data"],
  "unverified_claims": ["list of claims that could NOT be confirmed"],
  "hallucination_flags": [
    {
      "claim": "string - the hallucinated or unsupported claim",
      "reason": "string - why this cannot be verified",
      "action": "REMOVED|FLAGGED|REQUIRES_HUMAN_REVIEW"
    }
  ],
  "missing_critical_info": ["list of clinically important info absent from handoff"],
  "completeness_score": 80,
  "safe_to_handoff": true,
  "final_warnings": ["list of warnings for the receiving clinician"],
  "validated_handoff": {
    "situation": "string - verified situation",
    "background": "string - verified background",
    "assessment": "string - verified assessment",
    "recommendation": "string - verified recommendation"
  }
}
Output only JSON. No explanation. No markdown. Patient safety is paramount."""


def run(patient_data: dict, context: dict, risk: dict, handoff: dict) -> dict:
    """Agent 4: Validate handoff against FHIR source — remove hallucinations"""
    user_prompt = f"""
VALIDATION TASK: Check every claim in this handoff against the source FHIR data.

SOURCE FHIR DATA (ground truth):
Observations: {json.dumps(patient_data['observations'], indent=2)}
Conditions: {json.dumps(patient_data['conditions'], indent=2)}
Medications: {json.dumps(patient_data['medications'], indent=2)}

GENERATED HANDOFF TO VALIDATE:
{json.dumps(handoff, indent=2)}

RISK CONTEXT:
{json.dumps(risk, indent=2)}

Instructions:
1. Check EVERY claim in the SBAR against the source FHIR data above
2. Flag anything that cannot be confirmed from the data
3. Remove hallucinated information
4. Ensure no critical safety information is missing
5. Set safe_to_handoff to false if safety_score is below 70
"""
    result = call_llm(PROVIDER, SYSTEM_PROMPT, user_prompt, temperature=0.1)

    try:
        return json.loads(result)
    except json.JSONDecodeError:
        match = re.search(r'\{.*\}', result, re.DOTALL)
        if match:
            return json.loads(match.group())
        raise Exception("Handoff Validation failed to return valid JSON")