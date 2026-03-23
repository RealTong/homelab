## 2026-03-23 - Grafana OAuth Insecure Email Lookup
**Vulnerability:** Grafana was configured with `oauth_allow_insecure_email_lookup = true`, which could allow users to hijack accounts by spoofing email addresses through OAuth providers.
**Learning:** Relying on unverified emails from OAuth providers for account lookup can lead to authentication bypass and account takeover.
**Prevention:** Always ensure `oauth_allow_insecure_email_lookup = false` (or unset) to require secure, verified email lookups.
