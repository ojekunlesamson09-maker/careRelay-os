import asyncio
import json
import sys
from dotenv import load_dotenv

from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp import types

load_dotenv()

# -----------------------
# Logging: NEVER use stdout in MCP stdio servers.
# Stdout is reserved for the MCP protocol stream.
# -----------------------
def log(*args, **kwargs):
    print(*args, file=sys.stderr, flush=True, **kwargs)


def json_text(payload) -> list[types.TextContent]:
    return [types.TextContent(type="text", text=json.dumps(payload, indent=2))]


# Initialize MCP Server
server = Server("careRelay-os")


@server.list_tools()
async def list_tools() -> list[types.Tool]:
    """List all CareRelay OS tools available via MCP"""
    return [
        types.Tool(
            name="generate_clinical_handoff",
            description=(
                "Generates a complete, verified clinical handoff for a patient using "
                "a multi-agent pipeline. Fetches FHIR data, analyzes risks, generates "
                "SBAR, and validates against source data to reduce hallucinations."
            ),
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
            description=(
                "Fetches FHIR patient data and runs risk intelligence analysis. "
                "Returns urgency score, risk flags, deterioration signals, and immediate actions."
            ),
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
            description=(
                "Fetches and parses patient FHIR data into a unified clinical context "
                "including medications, vitals, conditions, and timeline."
            ),
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
    """Handle tool calls via MCP"""

    patient_id = (arguments or {}).get("patient_id")
    if not patient_id:
        return json_text({"error": "patient_id is required"})

    try:
        if name == "generate_clinical_handoff":
            from core.pipeline import run_pipeline
            result = await run_pipeline(patient_id)
            return json_text(result)

        if name == "get_patient_risk_assessment":
            from core.fhir_parser import get_full_patient_data
            from agents.context_builder import run as run_context
            from agents.risk_intelligence import run as run_risk

            patient_data = await get_full_patient_data(patient_id)
            context = run_context(patient_data)
            risk = run_risk(patient_data, context)

            return json_text({
                "patient_id": patient_id,
                "patient_name": patient_data.get("name"),
                "risk_assessment": risk
            })

        if name == "get_patient_context":
            from core.fhir_parser import get_full_patient_data
            patient_data = await get_full_patient_data(patient_id)
            return json_text(patient_data)

        return json_text({"error": f"Unknown tool: {name}"})

    except Exception as e:
        # IMPORTANT: log errors to stderr; do not print to stdout
        log(f"[ERROR] Tool '{name}' failed: {repr(e)}")
        return json_text({"error": str(e), "tool": name})


async def main():
    # Log ONLY to stderr
    log("CareRelay OS MCP Server starting...")
    log("Tools available:")
    log(" - generate_clinical_handoff")
    log(" - get_patient_risk_assessment")
    log(" - get_patient_context")

    # Start MCP stdio transport (MCP protocol on stdin/stdout)
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )


if __name__ == "__main__":
    asyncio.run(main())
