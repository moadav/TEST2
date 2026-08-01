# Isolation Probe Testbed (item #3) — run the probe THROUGH the gate

A Nuxt insertion testbed whose build runs `node probe.mjs && nuxt build`. When a setup runs, the gate spawns
the build in ITS environment (on the Container App worker, where the real secrets live) — so the probe reports
whether the env allowlist + token scrub actually isolate the child.

## Why not just run probe.mjs locally?
Your laptop doesn't have GITHUB_TOKEN / DATABASE_URL / Azure creds set — those live in the Container App. So a
local probe run is a false PASS. The probe is only meaningful running IN the gate's spawned process on the
deployed worker, which is where the secrets exist to leak.

## Use it as a BEFORE/AFTER
1. BEFORE applying the item-#3 edits: push this, run a setup (dry run OK). The build runs probe.mjs first; if
   the gate still inherits the worker env / leaves the token in .git/config, the probe EXITS 1 -> the setup
   returns InstallOrBuildFailed and buildDetail shows "PROBE FAIL — leaks: env:GITHUB_TOKEN ...". That proves
   the leak exists today AND that the probe runs in-gate.
2. Apply the allowlist edit (remove the denylist) + the token-scrub edit.
3. AFTER: push/run again. Probe EXITS 0 -> build proceeds to nuxt build -> setup reaches DryRunReady/PrOpened.
   buildDetail no longer shows leaks. That proves both leak paths are closed on the real runner.

The delta between BEFORE (fail, leaks named) and AFTER (pass) is the isolation proof.
