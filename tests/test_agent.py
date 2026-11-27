import pytest
from labs.lab02_agent import ToolRequest, execute, tool_results, bounded_loop
from labs.lab06_security import authorize
from labs.lab05_evals import accuracy, critical_miss_rate, CASES


def test_known_incident():
    r = execute(ToolRequest("toolu_1", "get_incident", {"incident_id": "INC-102"}))
    assert not r["is_error"]
    assert r["content"]["symptom"] == "OOMKilled"


def test_unknown_tool_rejected():
    assert execute(ToolRequest("toolu_2", "delete_namespace", {}))["is_error"]


def test_parallel_results_preserve_ids():
    reqs = [ToolRequest("a", "get_incident", {"incident_id": "INC-101"}), ToolRequest("b", "get_incident", {"incident_id": "INC-102"})]
    assert [r["tool_use_id"] for r in tool_results(reqs)] == ["a", "b"]


def test_iteration_limit():
    with pytest.raises(RuntimeError):
        bounded_loop([[], []], max_steps=1)


def test_security():
    assert authorize("triage-bot", "get_pod_logs", {})
    assert not authorize("triage-bot", "delete_namespace", {})
    assert not authorize("unknown", "get_incident", {})


def test_eval_finds_regression():
    assert accuracy(CASES) < 0.9
    assert critical_miss_rate(CASES) == 1.0
