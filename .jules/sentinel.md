
## 2024-05-24 - [Security Context Hardening]
**Vulnerability:** Grafana deployment lacked standard Kubernetes `securityContext` definitions, allowing potential privilege escalation and running with write access to the root filesystem.
**Learning:** Grafana requires specific user ID (472) to function correctly when dropping privileges. When enabling `readOnlyRootFilesystem: true`, an `emptyDir` volume must be mounted at `/tmp` to allow the application to write temporary files.
**Prevention:** Always implement pod-level (`runAsNonRoot`, `runAsUser`) and container-level (`allowPrivilegeEscalation`, `readOnlyRootFilesystem`, `capabilities: drop: ["ALL"]`) security contexts, providing explicit `emptyDir` mounts for required writable directories.
