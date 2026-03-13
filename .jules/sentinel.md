## 2026-02-26 - [Unnecessary TLS Verification Disabling]
**Vulnerability:** Explicit usage of `NODE_TLS_REJECT_UNAUTHORIZED="0"` in Node.js applications.
**Learning:** This environment variable completely disables TLS certificate validation, making the application vulnerable to Man-in-the-Middle (MitM) attacks. It is often used as a quick fix for self-signed certificates, but it compromises security unnecessarily when `NODE_EXTRA_CA_CERTS` is available.
**Prevention:** Always rely on `NODE_EXTRA_CA_CERTS` to trust specific CA certificates instead of disabling verification globally. In this codebase, `clash-master` already had the CA certs configured, making the insecure setting redundant and harmful.

## 2026-02-26 - [SQL Injection in PostgreSQL initContainers]
**Vulnerability:** SQL injection vulnerability in `initContainers` when executing `psql` commands via string interpolation.
**Learning:** Using environment variables with string interpolation in shell scripts executed by `initContainers` (e.g., `psql -c "CREATE USER $USER WITH PASSWORD '$PASS'"`) makes the system vulnerable to SQL injection if variables contain malicious content.
**Prevention:** Use parameterization provided by `psql` (the `-v` flag) for safe variable interpolation, like `psql -v user="$USER" -v pw="$PASS" -c "CREATE USER :\"user\" WITH PASSWORD :'pw';"`. Use `:'param'` to escape strings and `:"param"` to escape identifiers.
