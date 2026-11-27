"""Deterministic example of a tool-routing decision; no model or network calls."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Request:
    question: str
    answer_in_context: bool
    external_lookup_allowed: bool = True


def choose_tool(request: Request) -> str:
    """Demonstrate explicit source-based tool boundaries."""
    if request.answer_in_context:
        return "get_context_summary"
    if request.external_lookup_allowed:
        return "search_docs"
    return "no_authorized_tool"


if __name__ == "__main__":
    examples = (
        Request("Summarize this conversation", True),
        Request("Find an API reference not supplied here", False),
        Request("Find external docs when access is denied", False, False),
    )
    for item in examples:
        print(f"{item.question}: {choose_tool(item)}")
