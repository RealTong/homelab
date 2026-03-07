## 2024-05-20 - Vaultwarden Container Running as Root
**Vulnerability:** Vaultwarden containers in the homelab run as root by default, increasing the risk of privilege escalation.
**Learning:** Setting `readOnlyRootFilesystem: true` on Vaultwarden containers requires explicit unprivileged ports (e.g., `ROCKET_PORT="8080"`) and writable volume mounts (`emptyDir`) for required directories like `/tmp`. The official image also defaults to root, needing explicit `runAsUser`/`runAsGroup`.
**Prevention:** Apply the standard security hardening pattern (pod-level `runAsNonRoot: true`, container-level `allowPrivilegeEscalation: false`, `readOnlyRootFilesystem: true`) accompanied by `emptyDir` mounts and unprivileged ports for applications defaulting to root.
