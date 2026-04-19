import os
import httpx
from dotenv import load_dotenv

load_dotenv()

FHIR_BASE_URL = os.getenv("FHIR_BASE_URL", "https://hapi.fhir.org/baseR4")


async def fetch_patient(patient_id: str) -> dict:
    """Fetch core patient demographics from FHIR"""
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(f"{FHIR_BASE_URL}/Patient/{patient_id}")
        r.raise_for_status()
        return r.json()


async def fetch_observations(patient_id: str) -> list:
    """Fetch vitals and lab results"""
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(
            f"{FHIR_BASE_URL}/Observation",
            params={"patient": patient_id, "_sort": "-date", "_count": "20"}
        )
        r.raise_for_status()
        data = r.json()
        return data.get("entry", [])


async def fetch_conditions(patient_id: str) -> list:
    """Fetch active diagnoses"""
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(
            f"{FHIR_BASE_URL}/Condition",
            params={"patient": patient_id, "_count": "20"}
        )
        r.raise_for_status()
        data = r.json()
        return data.get("entry", [])


async def fetch_medications(patient_id: str) -> list:
    """Fetch current medications"""
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(
            f"{FHIR_BASE_URL}/MedicationRequest",
            params={"patient": patient_id, "status": "active", "_count": "20"}
        )
        r.raise_for_status()
        data = r.json()
        return data.get("entry", [])


async def fetch_encounters(patient_id: str) -> list:
    """Fetch recent encounters"""
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(
            f"{FHIR_BASE_URL}/Encounter",
            params={"patient": patient_id, "_sort": "-date", "_count": "5"}
        )
        r.raise_for_status()
        data = r.json()
        return data.get("entry", [])


def parse_patient_name(patient: dict) -> str:
    try:
        name = patient["name"][0]
        given = " ".join(name.get("given", []))
        family = name.get("family", "")
        full_name = f"{given} {family}".strip()
        # Fix UTF-8 encoding issues (e.g. Nuñez showing as NuÃ±ez)
        try:
            return full_name.encode('latin-1').decode('utf-8')
        except Exception:
            return full_name
    except Exception:
        return "Unknown Patient"


def parse_observations(entries: list) -> list:
    results = []
    for entry in entries:
        resource = entry.get("resource", {})
        code = resource.get("code", {}).get("text") or \
               (resource.get("code", {}).get("coding") or [{}])[0].get("display", "Unknown")
        value = None
        unit = ""
        if "valueQuantity" in resource:
            value = resource["valueQuantity"].get("value")
            unit = resource["valueQuantity"].get("unit", "")
        elif "valueString" in resource:
            value = resource["valueString"]
        date = resource.get("effectiveDateTime", "Unknown date")
        status = resource.get("status", "unknown")
        results.append({
            "name": code,
            "value": value,
            "unit": unit,
            "date": date,
            "status": status
        })
    return results


def parse_conditions(entries: list) -> list:
    results = []
    for entry in entries:
        resource = entry.get("resource", {})
        code = resource.get("code", {}).get("text") or \
               (resource.get("code", {}).get("coding") or [{}])[0].get("display", "Unknown")
        status = resource.get("clinicalStatus", {}).get("coding", [{}])[0].get("code", "unknown")
        onset = resource.get("onsetDateTime", "Unknown")
        results.append({
            "condition": code,
            "status": status,
            "onset": onset
        })
    return results


def parse_medications(entries: list) -> list:
    results = []
    for entry in entries:
        resource = entry.get("resource", {})
        med = resource.get("medicationCodeableConcept", {}).get("text") or \
              (resource.get("medicationCodeableConcept", {}).get("coding") or [{}])[0].get("display", "Unknown")
        status = resource.get("status", "unknown")
        dosage = ""
        if resource.get("dosageInstruction"):
            dosage = resource["dosageInstruction"][0].get("text", "")
        results.append({
            "medication": med,
            "status": status,
            "dosage": dosage
        })
    return results


async def get_full_patient_data(patient_id: str) -> dict:
    """Master function — fetches and parses all patient data"""
    patient_raw = await fetch_patient(patient_id)
    observations_raw = await fetch_observations(patient_id)
    conditions_raw = await fetch_conditions(patient_id)
    medications_raw = await fetch_medications(patient_id)
    encounters_raw = await fetch_encounters(patient_id)

    return {
        "patient_id": patient_id,
        "name": parse_patient_name(patient_raw),
        "gender": patient_raw.get("gender", "unknown"),
        "birthDate": patient_raw.get("birthDate", "unknown"),
        "observations": parse_observations(observations_raw),
        "conditions": parse_conditions(conditions_raw),
        "medications": parse_medications(medications_raw),
        "encounters": [e.get("resource", {}) for e in encounters_raw],
        "raw": {
            "patient": patient_raw,
            "observations": observations_raw,
            "conditions": conditions_raw,
            "medications": medications_raw
        }
    }