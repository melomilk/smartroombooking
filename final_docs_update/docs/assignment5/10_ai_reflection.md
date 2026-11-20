# Task #10 — AI Reflection

I used Claude Opus 5.5 in claude.ai. It received the assignment PDF, my GitHub repository, the AGENTS.md file (read explicitly, because Claude loads CLAUDE.md, not AGENTS.md), and screenshots of my own Command Prompt runs.

One useful suggestion was to check whether the unused Supabase package actually reached the browser before scoring it. The AI first described the `ws` vulnerability as a runtime risk. After building the app and searching the bundle, we found Supabase was not shipped at all. The risk was real but smaller: install surface and audit noise. So I scored its impact as 2, not as a security compromise (3).

A weak suggestion was the claim that caret version ranges in `package.json` make builds non-reproducible. My Windows install and the AI's Linux install produced identical dependency trees, because `npm ci` follows the lockfile, so I classified it as unsupported. The AI also rated the Vitest vulnerability as "critical remote code execution" without checking that it needs the Vitest UI server, which this project does not use.

I personally reran the baseline and post-refactor checks on Windows and compared every number with the AI's report. My run showed a TypeScript version warning from the linter that the AI's run never printed. That became a new confirmed risk (A5-R7). Tests also shaped decisions: the new header test failed before the fix and passed after, which is why I accepted that change.

The repository instructions helped. Because AGENTS.md required approval for dependency changes, the AI stopped and asked before removing Supabase, and it reviewed the lockfile diff line by line. Next time I would add CI and branch protection so these rules are enforced, not only written.
