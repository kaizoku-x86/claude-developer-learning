"""Lab 01: real API request. Needs ANTHROPIC_API_KEY and ANTHROPIC_MODEL."""
import os
from anthropic import Anthropic, APIConnectionError, APITimeoutError, AuthenticationError, BadRequestError, RateLimitError, InternalServerError


def main():
    model = os.getenv("ANTHROPIC_MODEL")
    if not os.getenv("ANTHROPIC_API_KEY") or not model:
        raise SystemExit("Set ANTHROPIC_API_KEY and ANTHROPIC_MODEL (no hardcoded secrets).")
    client = Anthropic(timeout=30.0, max_retries=0)
    try:
        msg = client.messages.create(
            model=model,
            max_tokens=256,
            system="You are a careful incident triage assistant. Do not invent evidence.",
            messages=[{"role": "user", "content": "List two safe read-only checks for CrashLoopBackOff."}],
        )
    except AuthenticationError:
        raise SystemExit("Authentication failed; check API key and account permissions.")
    except BadRequestError:
        raise SystemExit("Invalid request or model configuration.")
    except RateLimitError:
        raise SystemExit("Rate limited; respect Retry-After and retry budget.")
    except (APIConnectionError, APITimeoutError, InternalServerError):
        raise SystemExit("Transient API issue; retry only with bounded backoff.")
    print("message_id:", msg.id)
    print("stop_reason:", msg.stop_reason)
    print("usage:", msg.usage)
    for block in msg.content:
        if block.type == "text":
            print(block.text)
    if msg.stop_reason == "max_tokens":
        print("WARNING: response may be truncated")


if __name__ == "__main__":
    main()
