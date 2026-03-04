## 2024-05-24 - [Add securityContext to vaultwarden deployment]
**Vulnerability:** Vaultwarden deployment was lacking a hardened security context and running with excess capabilities and root filesystem.
**Learning:** Vaultwarden requires binding to port 80. To harden its security context without breaking its ability to bind to this privileged port (< 1024), we must explicitly add the `NET_BIND_SERVICE` capability. This allows us to set `allowPrivilegeEscalation: false` and secure the container.
**Prevention:** Whenever hardening containers that bind to ports < 1024, explicitly ensure the `NET_BIND_SERVICE` capability is added in the `securityContext`.
