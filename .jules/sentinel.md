## 2026-02-26 - [Unnecessary TLS Verification Disabling]
**Vulnerability:** Explicit usage of `NODE_TLS_REJECT_UNAUTHORIZED="0"` in Node.js applications.
**Learning:** This environment variable completely disables TLS certificate validation, making the application vulnerable to Man-in-the-Middle (MitM) attacks. It is often used as a quick fix for self-signed certificates, but it compromises security unnecessarily when `NODE_EXTRA_CA_CERTS` is available.
**Prevention:** Always rely on `NODE_EXTRA_CA_CERTS` to trust specific CA certificates instead of disabling verification globally. In this codebase, `clash-master` already had the CA certs configured, making the insecure setting redundant and harmful.

## 2026-02-26 - [SQL Injection in Kubernetes Init Scripts]
**Vulnerability:** Directly interpolating environment variables like passwords or database names into `psql` shell commands inside init containers poses an SQL injection risk.
**Learning:** Using `-v` allows `psql` to securely bind variables without breaking SQL semantics. When using `-v param="value"`, use `:'param'` to escape string literals securely and `:"param"` to correctly escape identifiers (e.g., table or user names).
**Prevention:** Always use parameterized `psql` queries when building initialization shell scripts for Postgres databases in Kubernetes to prevent accidental or intentional SQL injections.
