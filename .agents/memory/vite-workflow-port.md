---
name: Vite workflow port
description: How to reliably bind this project's pnpm-driven Vite workflow to Replit's webview port.
---

Set `PORT=5000` in the workflow command rather than forwarding `--port` through the pnpm script.

**Why:** The forwarded command included an extra separator that Vite treated as an argument, so it silently remained on port 5173 while Replit waited for port 5000.

**How to apply:** When recreating or changing the preview workflow, preserve the explicit `PORT=5000` environment assignment and webview port 5000.