## 2024-03-01 - [CRITICAL] Prevent SQL Injection in psql initContainers
**Vulnerability:** Found unsanitized bash variable string concatenation used within `psql -c` commands in `apps/sub2api/deployment.yaml` initContainer. This allowed potential SQL injection if the database name, user, or password contained malicious SQL characters (e.g. single quotes).
**Learning:** K8s init containers running shell scripts with `psql` are susceptible to SQL injection when interpolating environment variables into raw SQL strings (e.g., `psql -c "CREATE USER $USER WITH PASSWORD '$PASS';"`).
**Prevention:** Always use `psql`'s built-in variable interpolation with `-v param="value"` and safely escape identifiers using `:"param"` and string literals using `:'param'` in the SQL command string.
