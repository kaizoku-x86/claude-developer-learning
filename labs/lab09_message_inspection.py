"""Offline demonstration of stop-reason inspection and safe result handling."""
from __future__ import annotations

def classify_stop_reason(reason: str | None) -> str:
    if reason == "end_turn":
        return "complete"
    if reason == "tool_use":
        return "needs_tool_execution"
    if reason == "max_tokens":
        return "potentially_truncated_by_output_budget"
    if reason == "model_context_window_exceeded":
        return "truncated_by_context_capacity"
    return "investigate_unknown_or_intermediate_status"

def extract_text_blocks(content: list[dict]) -> str:
    return "\n".join(block["text"] for block in content if block.get("type") == "text")

if __name__ == "__main__":
    print(classify_stop_reason("max_tokens"))
    print(extract_text_blocks([{"type": "text", "text": "Read-only diagnosis"}, {"type": "tool_use", "id": "t1"}]))
