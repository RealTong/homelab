## 2026-02-26 - [Unnecessary TLS Verification Disabling]
**Vulnerability:** Explicit usage of `NODE_TLS_REJECT_UNAUTHORIZED="0"` in Node.js applications.
**Learning:** This environment variable completely disables TLS certificate validation, making the application vulnerable to Man-in-the-Middle (MitM) attacks. It is often used as a quick fix for self-signed certificates, but it compromises security unnecessarily when `NODE_EXTRA_CA_CERTS` is available.
**Prevention:** Always rely on `NODE_EXTRA_CA_CERTS` to trust specific CA certificates instead of disabling verification globally. In this codebase, `clash-master` already had the CA certs configured, making the insecure setting redundant and harmful.

## 2026-02-26 - [Kubernetes securityContext and Read-Only Root Filesystem]
**Vulnerability:** Missing `securityContext` allows containers to run with root privileges and write to the root filesystem.
**Learning:** When enforcing `readOnlyRootFilesystem: true` in Kubernetes, it is crucial to ensure that all directories the application needs to write to are mounted as writable volumes. For Prometheus, both `/tmp` and `/prometheus` (the data directory) must be writable. While a PVC is mounted at `/prometheus`, the application still needs write access, which is handled correctly by the PVC. The `securityContext` settings should be applied carefully to avoid `CrashLoopBackOff` errors.
**Prevention:** Always verify the required writable paths for an application before enabling `readOnlyRootFilesystem: true` and provide `emptyDir` or persistent volumes for those paths.
