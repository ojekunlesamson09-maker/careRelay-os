import time
from core.fhir_parser import get_full_patient_data
from agents.context_builder import run as run_context_builder
from agents.risk_intelligence import run as run_risk_intelligence
from agents.clinical_reasoning import run as run_clinical_reasoning
from agents.handoff_validation import run as run_handoff_validation


async def run_pipeline(patient_id: str) -> dict:
    """
    Master pipeline — orchestrates all 4 agents in sequence.
    This is the core of CareRelay OS.
    """
    pipeline_start = time.time()
    steps = []

    # ── STEP 1: Fetch FHIR Data ──────────────────────────────
    print(f"[Pipeline] Fetching FHIR data for patient {patient_id}...")
    step_start = time.time()
    patient_data = await get_full_patient_data(patient_id)
    steps.append({
        "step": "fhir_fetch",
        "status": "complete",
        "duration_ms": round((time.time() - step_start) * 1000)
    })
    print(f"[Pipeline] ✅ FHIR data fetched for {patient_data['name']}")

    # ── STEP 2: Agent 1 — Context Builder ────────────────────
    print("[Pipeline] Running Agent 1: Context Builder (Groq)...")
    step_start = time.time()
    context = run_context_builder(patient_data)
    steps.append({
        "step": "context_builder",
        "agent": "Agent 1",
        "provider": "groq",
        "status": "complete",
        "duration_ms": round((time.time() - step_start) * 1000)
    })
    print("[Pipeline] ✅ Agent 1 complete")

    # ── STEP 3: Agent 2 — Risk Intelligence ──────────────────
    print("[Pipeline] Running Agent 2: Risk Intelligence (Groq)...")
    step_start = time.time()
    risk = run_risk_intelligence(patient_data, context)
    steps.append({
        "step": "risk_intelligence",
        "agent": "Agent 2",
        "provider": "groq",
        "status": "complete",
        "duration_ms": round((time.time() - step_start) * 1000)
    })
    print(f"[Pipeline] ✅ Agent 2 complete — Urgency: {risk.get('urgency_level', 'UNKNOWN')}")

    # ── STEP 4: Agent 3 — Clinical Reasoning ─────────────────
    print("[Pipeline] Running Agent 3: Clinical Reasoning (GPT-4o)...")
    step_start = time.time()
    handoff = run_clinical_reasoning(patient_data, context, risk)
    steps.append({
        "step": "clinical_reasoning",
        "agent": "Agent 3",
        "provider": "openai",
        "status": "complete",
        "duration_ms": round((time.time() - step_start) * 1000)
    })
    print("[Pipeline] ✅ Agent 3 complete")

    # ── STEP 5: Agent 4 — Handoff Validation 🔑 ──────────────
    print("[Pipeline] Running Agent 4: Handoff Validation (GPT-4o)...")
    step_start = time.time()
    validation = run_handoff_validation(patient_data, context, risk, handoff)
    steps.append({
        "step": "handoff_validation",
        "agent": "Agent 4",
        "provider": "openai",
        "status": "complete",
        "duration_ms": round((time.time() - step_start) * 1000)
    })
    print(f"[Pipeline] ✅ Agent 4 complete — Safe to handoff: {validation.get('safe_to_handoff')}")

    total_duration = round((time.time() - pipeline_start) * 1000)
    print(f"[Pipeline] 🏁 Complete in {total_duration}ms")

    return {
        "patient_id": patient_id,
        "patient_name": patient_data["name"],
        "pipeline_steps": steps,
        "total_duration_ms": total_duration,
        "context": context,
        "risk": risk,
        "handoff": handoff,
        "validation": validation,
        "final_output": validation.get("validated_handoff", {}),
        "safe_to_handoff": validation.get("safe_to_handoff", False),
        "safety_score": validation.get("safety_score", 0),
        "urgency_level": risk.get("urgency_level", "UNKNOWN")
    }