import asyncio
import json
import os
from dotenv import load_dotenv
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp import types

load_dotenv()

# Initialize MCP Server
server = Server("careRelay-os")


@server.list_tools()
async def list_tools() -> list[types.Tool]:
    """List all CareRelay OS tools available via MCP"""
    return [
        types.Tool(
            name="generate_clinical_handoff",
            description="""Generates a complete, verified clinical handoff for a patient using 
            a 4-agent AI pipeline. Fetches real FHIR data, analyzes risks, generates SBAR, 
            and validates against source data to prevent hallucinations.""",
            inputSchema={
                "type": "object",
                "properties": {
                    "patient_id": {
                        "type": "string",
                        "description": "The FHIR patient ID to generate handoff for"
                    }
                },
                "required": ["patient_id"]
            }
        ),
        types.Tool(
            name="get_patient_risk_assessment",
            description="""Fetches FHIR patient data and runs risk intelligence analysis.
            Returns urgency score, risk flags, deterioration signals, and immediate actions.""",
            inputSchema={
                "type": "object",
                "properties": {
                    "patient_id": {
                        "type": "string",
                        "description": "The FHIR patient ID to assess"
                    }
                },
                "required": ["patient_id"]
            }
        ),
        types.Tool(
            name="get_patient_context",
            description="""Fetches and parses complete FHIR patient data into a unified 
            clinical context including medications, vitals, conditions, and timeline.""",
            inputSchema={
                "type": "object",
                "properties": {
                    "patient_id": {
                        "type": "string",
                        "description": "The FHIR patient ID"
                    }
                },
                "required": ["patient_id"]
            }
        )
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[types.TextContent]:
    """Handle tool calls from Prompt Opinion platform"""

    if name == "generate_clinical_handoff":
        patient_id = arguments.get("patient_id")
        if not patient_id:
            return [types.TextContent(
                type="text",
                text=json.dumps({"error": "patient_id is required"})
            )]

        try:
            from core.pipeline import run_pipeline
            result = await run_pipeline(patient_id)
            return [types.TextContent(
                type="text",
                text=json.dumps(result, indent=2)
            )]
        except Exception as e:
            return [types.TextContent(
                type="text",
                text=json.dumps({"error": str(e)})
            )]

    elif name == "get_patient_risk_assessment":
        patient_id = arguments.get("patient_id")
        try:
            from core.fhir_parser import get_full_patient_data
            from core.llm_client import call_llm
            from agents.context_builder import run as run_context
            from agents.risk_intelligence import run as run_risk

            patient_data = await get_full_patient_data(patient_id)
            context = run_context(patient_data)
            risk = run_risk(patient_data, context)

            return [types.TextContent(
                type="text",
                text=json.dumps({
                    "patient_id": patient_id,
                    "patient_name": patient_data["name"],
                    "risk_assessment": risk
                }, indent=2)
            )]
        except Exception as e:
            return [types.TextContent(
                type="text",
                text=json.dumps({"error": str(e)})
            )]

    elif name == "get_patient_context":
        patient_id = arguments.get("patient_id")
        try:
            from core.fhir_parser import get_full_patient_data
            patient_data = await get_full_patient_data(patient_id)
            return [types.TextContent(
                type="text",
                text=json.dumps(patient_data, indent=2)
            )]
        except Exception as e:
            return [types.TextContent(
                type="text",
                text=json.dumps({"error": str(e)})
            )]

    else:
        return [types.TextContent(
            type="text",
            text=json.dumps({"error": f"Unknown tool: {name}"})
        )]


async def main():
    print("🔌 CareRelay OS MCP Server starting...")
    print("📋 Tools available:")
    print("   - generate_clinical_handoff")
    print("   - get_patient_risk_assessment")
    print("   - get_patient_context")
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )


if __name__ == "__main__":
    asyncio.run(main())


if __name__ == "__main__":
    asyncio.run(main())