## 2024-05-28 - [Harden Redis Security Context]
**Vulnerability:** Missing Kubernetes securityContext declarations allowed the Redis container to run with more privileges than necessary, including full filesystem write access and lack of privilege escalation prevention.
**Learning:** Container security can be significantly improved by enforcing `runAsNonRoot: true`, `readOnlyRootFilesystem: true`, and dropping all capabilities. For Redis, user ID 999 is required, and an `emptyDir` must be mounted at `/tmp` to allow necessary write operations when the root filesystem is read-only.
**Prevention:** Always define a strict `securityContext` for deployments, explicitly setting non-root users and read-only filesystems, providing `emptyDir` volumes only where write access is absolutely required.
