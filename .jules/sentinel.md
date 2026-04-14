## 2026-02-26 - [Unnecessary TLS Verification Disabling]
**Vulnerability:** Explicit usage of `NODE_TLS_REJECT_UNAUTHORIZED="0"` in Node.js applications.
**Learning:** This environment variable completely disables TLS certificate validation, making the application vulnerable to Man-in-the-Middle (MitM) attacks. It is often used as a quick fix for self-signed certificates, but it compromises security unnecessarily when `NODE_EXTRA_CA_CERTS` is available.
**Prevention:** Always rely on `NODE_EXTRA_CA_CERTS` to trust specific CA certificates instead of disabling verification globally. In this codebase, `clash-master` already had the CA certs configured, making the insecure setting redundant and harmful.

## 2023-10-27 - [OAuth Provider TLS Validation Bypass]
**Vulnerability:** The configuration `TINYAUTH_OAUTH_PROVIDERS_POCKETID_INSECURE: "true"` explicitly bypassed TLS certificate validation for an OAuth provider in the `tinyauth` application.
**Learning:** Bypassing TLS validation on authentication-related endpoints like OAuth providers makes the application vulnerable to Man-in-the-Middle (MitM) attacks. This can allow attackers to intercept tokens or manipulate user information during the authentication flow.
**Prevention:** Never disable TLS validation (e.g., using `INSECURE: "true"`) for external services, especially those handling authentication. Ensure the system trusts the correct Certificate Authorities or use valid certificates for internal services instead of turning off validation.
