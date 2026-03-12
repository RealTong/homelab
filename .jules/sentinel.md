## 2026-02-26 - [Unnecessary TLS Verification Disabling]
**Vulnerability:** Explicit usage of `NODE_TLS_REJECT_UNAUTHORIZED="0"` in Node.js applications.
**Learning:** This environment variable completely disables TLS certificate validation, making the application vulnerable to Man-in-the-Middle (MitM) attacks. It is often used as a quick fix for self-signed certificates, but it compromises security unnecessarily when `NODE_EXTRA_CA_CERTS` is available.
**Prevention:** Always rely on `NODE_EXTRA_CA_CERTS` to trust specific CA certificates instead of disabling verification globally. In this codebase, `clash-master` already had the CA certs configured, making the insecure setting redundant and harmful.

## 2023-10-24 - [SQL Injection in Shell Script via psql string interpolation]
**Vulnerability:** Constructing `psql` queries within shell scripts using raw environment variables/string interpolation (e.g. `psql -c "CREATE USER $USER WITH PASSWORD '$PASSWORD';"`) is vulnerable to SQL injection if variables contain malicious content like single quotes. This is particularly prevalent in K8s init containers.
**Learning:** Shell expansion interpolates the variable directly into the command string before it's passed to `psql`, allowing an attacker to escape string boundaries and inject arbitrary SQL if they control the variable contents (e.g. `PASSWORD="my_password' OR 1=1--"`).
**Prevention:** Use `psql`'s built-in variable parameterization with the `-v` flag (e.g., `psql -v username="$USER" -v pw="$PASSWORD" -c "CREATE USER :\"username\" WITH PASSWORD :'pw';"`) to ensure variables are safely escaped by the database client.
