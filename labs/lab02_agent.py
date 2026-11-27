"""Offline agent-loop simulator; no model calls and no cluster access."""
from dataclasses import dataclass
import json
from pathlib import Path

DATA = json.loads((Path(__file__).resolve().parents[1] / "fixtures" / "incidents.json").read_text())
INCIDENTS = {row["id"]: row for row in DATA}

@dataclass(frozen=True)
class ToolRequest:
    id: str
    name: str
    arguments: dict


def execute(request: ToolRequest) -> dict:
    if request.name != "get_incident":
        return {"is_error": True, "content": "unknown or unauthorized tool"}
    incident_id = request.arguments.get("incident_id")
    if not isinstance(incident_id, str) or not incident_id.startswith("INC-"):
        return {"is_error": True, "content": "invalid incident_id"}
    incident = INCIDENTS.get(incident_id)
    if incident is None:
        return {"is_error": True, "content": "incident not found"}
    return {"is_error": False, "content": incident}


def tool_results(requests: list[ToolRequest]) -> list[dict]:
    """Every tool_use ID gets a corresponding tool_result block."""
    return [{"type": "tool_result", "tool_use_id": req.id, **execute(req)} for req in requests]


def bounded_loop(mock_turns: list[list[ToolRequest]], max_steps: int = 3) -> list[list[dict]]:
    if max_steps < 1:
        raise ValueError("max_steps must be positive")
    results = []
    for step, requests in enumerate(mock_turns):
        if step >= max_steps:
            raise RuntimeError("agent step budget exceeded")
        results.append(tool_results(requests))
    return results


if __name__ == "__main__":
    req = ToolRequest(id="toolu_01", name="get_incident", arguments={"incident_id": "INC-102"})
    print(json.dumps(tool_results([req]), indent=2))
