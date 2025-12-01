<div align="center">


<img src="https://avatars.githubusercontent.com/u/67304509?v=4" align="center" width="144px" height="144px"/>

## Pork3s
The kubernetes cluster of RealTong's Homelab

</div>

## Guiding Principles

This project is, first and foremost, a platform for learning and exploration. The core philosophy is to maintain a resilient and reproducible test environment where experimentation is encouraged. While this approach can sometimes lead to over-engineering (here's [the counter-argument](https://frenck.dev/the-enterprise-smart-home-syndrome/)), the primary goal is to guarantee that any component can be rebuilt from code.

This philosophy is supported by several key principles:
*   **Everything as Code:** All infrastructure, from bare-metal provisioning to application deployment, is defined declaratively and managed through version control. This ensures consistency and enables rapid disaster recovery.
*   **Monorepo Simplicity:** The entire homelab is managed within a single repository, providing a unified view of all services, configurations, and documentation.
*   **Open Source First:** I prioritize the use of open-source software to maintain flexibility and support the community.

## Core Infrastructure

**Hardware:**
- **Servers:** 3 servers – (N5105 16C16G), (Oracle Cloud VM.Standard.2.1), (Ugreen DXP4800)
- **Management:** UPS (APC Back-UPS 500VA)
- **Storage:** 4x 4TB HDD, 1x 256GB SSD

**Software Stack:**
- **Operating Systems**: [Ubuntu](https://www.ubuntu.com/), [Proxmox](https://www.proxmox.com/)
- **Container Orchestration:** [Kubernetes](https://kubernetes.io/)
- **Automation:** [FluxCD](https://fluxcd.io/), [Renovate](https://docs.renovatebot.com/)
- **Security:** [PocketID](https://pocket-id.org/), [TinyAuth](https://tinyauth.app/), [Cert-Manager](https://cert-manager.io/), [Mkcert](https://github.com/FiloSottile/mkcert)
- **Networking:** [Ingress Nginx](https://kubernetes.github.io/ingress-nginx/), [WireGuard](https://www.wireguard.com/), [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/)
- **Observability:** [Kube Prometheus Stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack), [Grafana](https://grafana.com/), [Uptime Kuma](https://github.com/louislam/uptime-kuma)