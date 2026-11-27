# Module 2 — Tool Selection Practice

<quiz>
Claude repeatedly calls `search_docs` even though the correct answer is already present in the supplied conversation. Both tool descriptions say they retrieve information. What is the most targeted fix?

- [ ] Increase `max_tokens` to give Claude more room to choose.
- [x] Add explicit inclusion and exclusion conditions to both tool descriptions.
- [ ] Make every schema property required.
- [ ] Retry the same prompt until the desired tool is selected.

The issue is **overlapping tool descriptions**. Explicit decision boundaries make the intended routing behavior testable. Changes to argument types do not resolve ambiguous purposes.
</quiz>

<quiz>
A user asks a question whose answer is **absent** from the retained conversation. One tool searches external documentation; another summarizes the existing context. Which tool should be selected?

- [x] The external documentation search tool.
- [ ] The session summary tool, regardless of the source.
- [ ] Both tools on every turn.
- [ ] Neither tool; all factual questions must use an internal answer.

Select the tool based on **where the information is available**, not merely on the question's topic.
</quiz>

<quiz>
Which practices improve tool-routing reliability? Select all that apply.

- [x] Include clear **when to use** conditions.
- [x] Include clear **when not to use** conditions.
- [ ] Assume `strict: true` will always fix wrong-tool selection.
- [x] Evaluate tool choices on both in-context and out-of-context test cases.

Tool descriptions establish routing boundaries. Schema constraints and backend authorization address different layers.
</quiz>

<quiz>
Two read-only tools remain indistinguishable even after refining their descriptions. Both have the same authorization requirements. Which design option is reasonable?

- [ ] Rename the tools without updating their descriptions.
- [x] Combine them into a tool with a documented `mode` parameter.
- [ ] Add irrelevant parameters to both tools.
- [ ] Remove their descriptions entirely.

Merging may reduce accidental ambiguity **when the data and permission boundaries really are compatible**.
</quiz>
