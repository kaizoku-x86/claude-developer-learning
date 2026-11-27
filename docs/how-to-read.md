# How to Read This Course

This is a **guided learning resource**, not a single book you must read from beginning to end. You can follow the modules in order or focus on the topics you need to strengthen.

!!! tip "New to Claude development?"
    Start with [Module 1 — Messages API](01-messages-api.md), then follow the learning routine below. You can read the guides and complete the browser-based quizzes without an API key.

## What you will find

| Section | What it contains | How to use it |
|---|---|---|
| **Modules** | Curated explanations, technical examples, common mistakes, and official references. | Your **main reading material**. Work through Modules 1–5 in order if you are new to the topics. |
| **Glossaries** | A [general glossary](00-general-glossary.md) and [module-specific terms](01-glossary.md). | Look up unfamiliar terms while reading; revisit them after each module. |
| **Labs** | [Hands-on exercises](labs.md) with Python examples, fictional data, and automated tests. | Apply a concept after reading it. Most exercises work locally without access to Claude or production systems. |
| **Tests** | [Interactive practice questions](quizzes/index.md) with answer explanations. | Check your understanding, analyze incorrect answers, and return to the relevant guide. |
| **Capstone** | An [architecture case](07-architecture-case.md) connecting topics from several modules. | Attempt it after studying the foundations; explain your design choices and trade-offs. |

## Recommended learning routine

1. **Read a module guide.** Focus on the concepts, examples, and the reasons behind each design choice rather than memorizing isolated terms.
2. **Check the glossary.** Look up any unfamiliar vocabulary. The general glossary is a quick reference; the module glossary narrows the focus.
3. **Practice with a lab.** Run a relevant example, inspect the behavior, and modify it to test an edge case.
4. **Take a quiz when one is available.** Choose your answers before revealing the explanations. An incorrect answer is a reason to revisit the concept, not just memorize the correct option.
5. **Review the official references.** Especially for model-specific features or API behavior that may change over time.
6. **Move on or revisit.** Continue to the next module, or repeat the exercise with a new scenario until you can explain *why* the solution works.

!!! info "Not all modules have quizzes yet"
    The public question bank is being expanded. The current interactive quizzes cover **Tool Selection**, **Streaming and Tool Use**, and **MCP Concepts**. You can still study Modules 1, 4, and 5 using their guides, glossaries, and relevant labs.

## Suggested path through the modules

| Stage | Read | Reinforce and practice |
|---|---|---|
| **1. API and Models** | [Messages API](01-messages-api.md) | [Module 1 glossary](01-glossary.md); API lab (optional API key) and offline message-inspection lab |
| **2. Prompting and Agents** | [Tool Use and Agents](02-prompting-agents-tools.md), [Structured Outputs](02-structured-outputs.md), [Tool Selection](modules/02-tool-selection.md) | [Module 2 glossary](02-glossary.md); agent and validation labs; [Tool Selection quiz](quizzes/02-tool-selection.md) and [Streaming quiz](quizzes/02-streaming.md) |
| **3. Claude Code and MCP** | [Claude Code and MCP](03-claude-code-mcp.md), [Claude Products](03-claude-products.md) | [Module 3 glossary](03-glossary.md); local MCP lab; [MCP quiz](quizzes/03-mcp.md) |
| **4. Production** | [Evals and Security](04-production-evals-security.md) | [Module 4 glossary](04-glossary.md); evaluation and authorization labs |
| **5. Reuse and Architecture** | [Accelerators and IP](05-accelerators-ip.md) | [Module 5 glossary](05-glossary.md); [architecture capstone](07-architecture-case.md) |

The [Labs page](labs.md) maps exercises to their Python files and explains which ones require additional setup. Lab numbering follows topics; missing numbers do not mean that you skipped a required lesson.

## How to approach the hands-on material

The documentation and interactive tests run in your browser. **Python labs run on your own computer**, so clone the [public GitHub repository](https://github.com/kaizoku-x86/claude-developer-learning) if you want to execute them.

```bash
git clone https://github.com/kaizoku-x86/claude-developer-learning.git
cd claude-developer-learning
python -m pip install -r requirements-labs.txt
python -m pytest -q
```

Most labs use fictional incidents and need no credentials. **Lab 01** makes a real API request and requires your own Anthropic API key and model ID. **Lab 03** uses an MCP-compatible local client and optional dependencies. **Lab 05** deliberately contains a failing assertion when executed directly: diagnosing that failure is part of the exercise.

For full setup and lab descriptions, see [Hands-on Labs](labs.md).

## How to use the practice tests

Open [Interactive Practice](quizzes/index.md), select a topic, answer the questions, and examine the explanations. Some questions test the best response to a scenario, while others ask which statements are correct. The goal is to understand the reasoning, not only the final option.

The questions are **independently authored practice material**. They are not taken from an official Anthropic certification exam, and the site does not issue a certification.

## Where to go next

- **Starting from zero?** Open [Module 1 — Messages API](01-messages-api.md).
- **Already familiar with APIs?** Try [Tool Selection](modules/02-tool-selection.md) and its [practice quiz](quizzes/02-tool-selection.md) to locate gaps.
- **Prefer hands-on learning?** Start with the [Labs overview](labs.md), then return to the associated module guide.
- **Ready to combine concepts?** Work through the [architecture capstone](07-architecture-case.md).

This site is updated as reviewed materials become available. Treat the official [Claude documentation](https://platform.claude.com/docs/en/home) as the source of truth for current platform behavior.
