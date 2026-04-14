## 2024-03-22 - SQL Injection in Kubernetes Init Containers
**Vulnerability:** Init containers executing `psql` commands were interpolating environment variables directly into query strings (e.g., `CREATE DATABASE $DB_POSTGRESDB_DATABASE;`), allowing potential SQL injection via K8s secrets.
**Learning:** Even within isolated Kubernetes environments, secrets used for database initialization must be sanitized or parameterized. Shell interpolation of secrets into SQL statements is unsafe.
**Prevention:** Use `psql -v param="value"` for variable interpolation. Use `:'param'` to safely escape string literals and `:"param"` to safely escape identifiers.
