from labs.lab02_tool_selection import Request, choose_tool


def test_uses_retained_session_context():
    assert choose_tool(Request("Use the existing answer", True)) == "get_context_summary"


def test_requires_external_information():
    assert choose_tool(Request("Find missing documentation", False)) == "search_docs"


def test_denies_unapproved_external_lookup():
    assert choose_tool(Request("Search is not allowed", False, False)) == "no_authorized_tool"
