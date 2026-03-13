## 2026-02-26 - [Unnecessary TLS Verification Disabling]
**Vulnerability:** Explicit usage of `NODE_TLS_REJECT_UNAUTHORIZED="0"` in Node.js applications.
**Learning:** This environment variable completely disables TLS certificate validation, making the application vulnerable to Man-in-the-Middle (MitM) attacks. It is often used as a quick fix for self-signed certificates, but it compromises security unnecessarily when `NODE_EXTRA_CA_CERTS` is available.
**Prevention:** Always rely on `NODE_EXTRA_CA_CERTS` to trust specific CA certificates instead of disabling verification globally. In this codebase, `clash-master` already had the CA certs configured, making the insecure setting redundant and harmful.

## $(date +%Y-%m-%d) - [SQL Injection Vulnerability in K8s init containers]
**Vulnerability:** Constructing SQL commands using bash string interpolation inside `init-db` containers, putting the user inputs (`DB_POSTGRESDB_USER` and `DB_POSTGRESDB_PASSWORD`) directly into the `psql` command.
**Learning:** This is a classic SQL injection issue, which applies even inside bash scripts executing inside Kubernetes containers. Malicious inputs inside Kubernetes secrets (managed externally) could easily manipulate the SQL logic, such as escaping the quotes.
**Prevention:** Use PostgreSQL's `psql -v param="value"` query parameterization to safely bind bash variables and avoid executing arbitrary SQL logic. Avoid string interpolation in any scenario where `psql` interacts with secrets/configurations dynamically.
