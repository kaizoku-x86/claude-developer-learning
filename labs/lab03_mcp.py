"""Lab 03: MCP stdio server. stdout is reserved for transport."""
import json
from pathlib import Path
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("fictional-incident-triage")
DATA = json.loads((Path(__file__).resolve().parents[1] / "fixtures" / "incidents.json").read_text())

@mcp.tool()
def get_incident(incident_id: str) -> dict:
    """Read fictional incident by ID. No writes or production access."""
    if not incident_id.startswith("INC-"):
        return {"error": "invalid incident_id"}
    return next((row for row in DATA if row["id"] == incident_id), {"error": "not found"})

@mcp.resource("incidents://catalog")
def catalog() -> str:
    """Fictional incident catalogue."""
    return json.dumps(DATA)

@mcp.prompt()
def incident_triage(incident_id: str) -> str:
    """Read-only incident analysis template."""
    return f"Investigate {incident_id} using read-only tools. Cite evidence; do not change infrastructure."

if __name__ == "__main__":
    mcp.run(transport="stdio")
