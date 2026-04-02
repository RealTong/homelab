## 2024-05-24 - Hardened n8n securityContext
**Vulnerability:** Missing standard Kubernetes `securityContext` definitions in the n8n deployment, which could allow a compromised container to escalate privileges or modify the root filesystem.
**Learning:** When applying securityContext hardening to n8n, specific default user IDs are required for correct container operation (e.g., n8n uses 1000). The standard pattern involves pod-level `runAsNonRoot: true`, container-level `allowPrivilegeEscalation: false` and `readOnlyRootFilesystem: true`, along with an `emptyDir` volume mounted at `/tmp`.
**Prevention:** Ensure standard Kubernetes `securityContext` definitions are included in all deployments across the `apps/` directory, following the established hardening pattern.
