## 2026-02-26 - [Unnecessary TLS Verification Disabling]
**Vulnerability:** Explicit usage of `NODE_TLS_REJECT_UNAUTHORIZED="0"` in Node.js applications.
**Learning:** This environment variable completely disables TLS certificate validation, making the application vulnerable to Man-in-the-Middle (MitM) attacks. It is often used as a quick fix for self-signed certificates, but it compromises security unnecessarily when `NODE_EXTRA_CA_CERTS` is available.
**Prevention:** Always rely on `NODE_EXTRA_CA_CERTS` to trust specific CA certificates instead of disabling verification globally. In this codebase, `clash-master` already had the CA certs configured, making the insecure setting redundant and harmful.

## 2026-03-11 - [SQL Injection in psql K8s Init Container Scripts]
**Vulnerability:** SQL injection risk in K8s init containers running `psql` scripts with raw string interpolation for secrets (e.g., `CREATE USER $DB_POSTGRESDB_USER WITH PASSWORD '$DB_POSTGRESDB_PASSWORD';`).
**Learning:** Using shell variable expansion inside `psql -c` strings is unsafe, as user-provided environment variables containing secrets, database names or usernames can cause injection.
**Prevention:** Always use `psql -v param="value"` for variable passing and `:'param'` / `:"param"` for escaping string literals and identifiers respectively.
