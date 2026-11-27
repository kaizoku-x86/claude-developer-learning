"""Lab 05: intentionally failing evaluation for learner debugging."""
CASES = [
    {"id": "INC-101", "expected": "configuration", "predicted": "configuration", "severity": "high"},
    {"id": "INC-102", "expected": "memory", "predicted": "network", "severity": "critical"},  # deliberate error
    {"id": "INC-103", "expected": "image", "predicted": "image", "severity": "medium"},
]

def accuracy(cases: list[dict]) -> float:
    if not cases:
        raise ValueError("empty evaluation set")
    return sum(c["expected"] == c["predicted"] for c in cases) / len(cases)

def critical_miss_rate(cases: list[dict]) -> float:
    critical = [c for c in cases if c["severity"] == "critical"]
    if not critical:
        return 0.0
    return sum(c["expected"] != c["predicted"] for c in critical) / len(critical)

if __name__ == "__main__":
    print(f"Accuracy: {accuracy(CASES):.1%}")
    print(f"Critical miss rate: {critical_miss_rate(CASES):.1%}")
    assert accuracy(CASES) >= 0.9, "Intentional failure: investigate INC-102 before fixing"
