import pytest

from scripts.export_reviewed import APPROVED, public_version


def test_rewrites_notebook_links_for_public_audience():
    source = (
        "- [Technical verification register (private study notebook)]"
        "(notebooks/00-pending-to-review.md)\n"
        "Source: learner notes. Editorial corrections are described in their corresponding module pages.\n"
    )
    public = public_version("docs/00-general-glossary.md", source)
    assert "notebooks/" not in public
    assert "Source: learner notes" not in public


def test_rejects_unapproved_path():
    with pytest.raises(ValueError):
        public_version("docs/notebooks/private.md", "# Never published")


def test_rejects_unexpected_private_reference():
    with pytest.raises(ValueError):
        public_version("docs/03-glossary.md", "[Personal notes](notebooks/secret.md)")


def test_rejects_git_history_path():
    assert all(not p.startswith((".git/", "docs/notebooks/")) for p in APPROVED)


def test_formats_bare_urls():
    result = public_version("docs/01-glossary.md", "Reference: https://example.com/api\n")
    assert result == "Reference: <https://example.com/api>\n"
