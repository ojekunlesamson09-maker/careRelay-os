from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from core.pipeline import run_pipeline
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="CareRelay OS — AI Agent Layer",
    description="4-Agent Clinical Handoff Intelligence System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HandoffRequest(BaseModel):
    patient_id: str


@app.get("/")
def root():
    return {
        "system": "CareRelay OS",
        "version": "1.0.0",
        "status": "online",
        "agents": [
            {"id": 1, "name": "Context Builder", "provider": "Groq/Llama3.3"},
            {"id": 2, "name": "Risk Intelligence", "provider": "Groq/Llama3.3"},
            {"id": 3, "name": "Clinical Reasoning", "provider": "OpenAI/GPT-4o"},
            {"id": 4, "name": "Handoff Validation", "provider": "OpenAI/GPT-4o"},
        ]
    }


@app.get("/health")
def health():
    return {"status": "healthy", "service": "ai-agents"}


@app.post("/handoff")
async def generate_handoff(request: HandoffRequest):
    """
    Main endpoint — runs the full 4-agent pipeline for a patient
    """
    try:
        result = await run_pipeline(request.patient_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/patient/{patient_id}/context")
async def get_patient_context(patient_id: str):
    """Quick endpoint — just fetch and parse FHIR data"""
    try:
        from core.fhir_parser import get_full_patient_data
        data = await get_full_patient_data(patient_id)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)