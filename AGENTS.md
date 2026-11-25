# Agent instructions

For multi-step coding tasks, follow the loop in
`portable-agent-workflow/SKILL.md`:

1. Understand the request and inspect the repo (`git status`, config files).
2. Plan in 3 to 7 short steps; do the riskiest step first.
3. Make small changes that match the existing style. Do not overwrite unread changes.
4. Run the project's own tests, lint, and build. Do not disable checks to pass.
5. Report what changed, what was verified (exact commands), and what was not.

Never commit or push unless asked. Never print secrets. Confirm before deleting data,
force-pushing, or publishing.
