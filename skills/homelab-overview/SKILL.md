---
name: homelab-overview
description: "Reusable HomeLab operating guide for a GitOps-managed K3s cluster: repository hygiene, secret handling, ingress/DNS patterns, stateful-app cautions, and verification workflow."
version: 1.1.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [homelab, k3s, gitops, kubernetes, infisical, external-secrets, ingress-nginx, dns, runbook]
    related_skills:
      - homelab-expose-lan-apps-via-ingress-nginx
      - homelab-remove-app-from-gitops
      - homelab-gitops-database-migration
---

# HomeLab overview and operating guide

Use this skill as a **public-safe, reusable baseline** when working on a GitOps-managed HomeLab built around K3s/Kubernetes.

It intentionally avoids private infrastructure details such as external VPS IPs, provider-specific VPN control-plane internals, private hostnames, credentials, and service-specific secrets. If a task needs sensitive runtime details, inspect them live through the appropriate secure channel instead of recording them in this skill.

## Scope

This skill is for general HomeLab work such as:

- adding, removing, or refactoring apps in a GitOps repo
- changing Kubernetes manifests, Kustomize overlays, Ingresses, Services, PVCs, and ExternalSecrets
- debugging runtime drift between Git and the live cluster
- exposing apps through ingress-nginx
- keeping public repositories free of secrets
- safely handling stateful apps and app-owned configuration
- verifying rollouts after GitOps or live operational changes

For specialized incidents, load the narrower task-specific skill as well.

## Core architecture assumptions

- Workloads run on a K3s/Kubernetes cluster.
- Desired state is stored in a GitOps repository.
- Pushing durable changes to the repository triggers reconciliation by the cluster's GitOps controller.
- Live `kubectl` changes may be useful for diagnosis or emergency repair, but durable fixes should normally be represented in Git.
- The repository may be public, so manifests must be written with public disclosure in mind.

## Public-repo safety rules

Do **not** commit any of the following:

- API keys or bearer tokens
- OAuth client secrets
- database passwords
- cookie/session/JWT secrets
- private keys or certificates containing private material
- webhook secrets
- provider tokens
- full generated config files that embed secrets
- sensitive IP addresses or private infrastructure details that are not intended to be public

Preferred pattern:

1. Commit only non-sensitive Kubernetes manifests and references.
2. Store sensitive values in a secret manager such as Infisical.
3. Deliver secrets to the cluster through ExternalSecrets or equivalent secret-sync tooling.
4. Use placeholders, key names, or documented required secret paths in Git, not actual secret values.
5. When a deployment fails, inspect the live `ExternalSecret`, generated `Secret`, and pod environment/mounted config before assuming the Git manifest is wrong.

## GitOps vs live operations

Before making changes, classify the task:

### Durable configuration change

Examples:

- add a new app
- remove an old app
- change ingress hostnames
- change resource requests/limits
- add a PVC
- add an ExternalSecret reference

Use the GitOps repo. Validate locally where possible, then let the controller reconcile.

### Runtime diagnosis or emergency repair

Examples:

- inspect pod logs
- restart a deployment
- check a generated Secret
- patch app-owned database state
- temporarily scale a workload down during data repair

Use `kubectl` directly, but avoid leaving untracked drift. If the fix should persist, follow up with a GitOps change.

## Standard workflow

1. Understand whether the requested change is durable GitOps, live operational repair, or both.
2. Inspect the repository layout before adding new files.
3. Search for existing app names, hostnames, secret names, PVCs, and ingress resources.
4. Inspect live cluster state if symptoms are runtime-specific.
5. Keep all sensitive values in the secret manager and reference them through ExternalSecrets.
6. Validate manifests with Kustomize and/or server-side dry-run when possible.
7. Apply or push only when the user has approved the scope.
8. Verify reconciliation, rollout status, logs, endpoints, ingress, and application behavior.
9. For auth/callback-sensitive apps, test the real browser login/callback flow, not just HTTP status codes.

## Repository hygiene

When adding an app, prefer a self-contained app directory containing only what the app needs, for example:

```text
apps/<app>/
  kustomization.yaml
  deployment.yaml
  service.yaml
  ingress.yaml
  pvc.yaml                 # if needed
  external-secret.yaml     # if needed
  configmap.yaml           # if non-sensitive config is needed
```

Checklist:

- The app directory is included by the parent `kustomization.yaml`.
- Resource names are consistent and predictable.
- Labels/selectors match between Deployment and Service.
- Ingress points to the correct Service name and port.
- PVCs are only added when persistence is required.
- Secrets are referenced, not hardcoded.
- Old app resources are removed from Git when replacing an app.
- Live orphaned resources are checked when deleting or renaming apps.

## Secrets and ExternalSecrets

For apps that need secrets:

- Put non-sensitive defaults in ConfigMaps or plain env vars.
- Put sensitive values in a secret manager.
- Use ExternalSecret to generate a Kubernetes Secret.
- Mount the generated Secret as env vars or files.
- Document required secret keys without exposing their values.

Typical verification:

```bash
kubectl -n <namespace> describe externalsecret <name>
kubectl -n <namespace> get secret <generated-secret> -o yaml
kubectl -n <namespace> logs deploy/<app> --tail=200
```

If the app still uses stale values, check all of these layers:

- Git manifest
- ExternalSecret status
- generated Kubernetes Secret
- pod environment or mounted file
- application database or persistent config
- whether the pod was restarted after the change

## Ingress and DNS patterns

Many HomeLab apps are exposed through ingress-nginx on HTTPS/443.

Key points:

- Multiple hostnames may share the same ingress IP and port.
- DNS may be split-horizon: the same public hostname can resolve differently from LAN/VPN and from the public Internet.
- A domain does not always have to resolve directly to the ingress LoadBalancer if an upstream proxy or tunnel is intentionally in the path.
- Confirm the actual traffic path before changing DNS or ingress.

Access-control caution:

- Network-layer ACLs usually operate on IP/port, not HTTP hostnames.
- If many apps share the same ingress IP:443, network ACLs cannot reliably distinguish them by hostname.
- Use app-layer authentication, separate ingress IPs, separate entrypoints, or separate ports when strict per-app isolation is required.

Ingress verification:

```bash
kubectl get ingress -A
kubectl -n <namespace> describe ingress <name>
kubectl -n ingress-nginx logs deploy/ingress-nginx-controller --tail=200
```

## Stateful app cautions

Stateful apps often keep important configuration outside Git, including:

- app-owned SQLite/PostgreSQL/MySQL tables
- OAuth/OIDC client settings
- redirect/callback URLs
- admin settings stored in a PVC
- generated config files
- caches or WAL files

Do not assume a manifest change updates app-owned state.

Before modifying stateful data:

1. Identify the PVC/database that owns the data.
2. Back up or copy the data when practical.
3. Stop or scale down the app if the database/file must be edited offline.
4. Make the smallest safe change.
5. Restart the app and verify logs and behavior.
6. Capture any durable configuration back into Git if appropriate.

## Storage and PVC/PV cautions

For NFS or other external storage-backed PVCs:

- Existing PVs may retain old server/path details even after a provisioner is reconfigured.
- Some PV fields are immutable.
- Deleting a PVC/PV can destroy or orphan data depending on reclaim policy and provisioner behavior.
- Always inspect the PV, reclaim policy, storage class, and backing directory before destructive operations.

Useful checks:

```bash
kubectl get pvc -A
kubectl get pv
kubectl describe pv <pv-name>
kubectl -n <namespace> describe pvc <pvc-name>
```

## Domain and auth changes

For apps with login, OAuth, OIDC, SSO, webhooks, or callback URLs:

- Update ingress hostnames and app public URL settings.
- Update OAuth/OIDC redirect/callback URLs in the identity provider.
- Check whether the app stores provider settings in its own database.
- Restart the app when config is env/configmap/secret-driven.
- Test the real browser flow end to end.

Common places stale auth/domain config can hide:

- app database tables
- mounted config files on PVCs
- generated Kubernetes Secrets
- ExternalSecret source values
- browser cookies/session domains
- identity-provider client definitions

## Useful command patterns

Inspect app resources:

```bash
kubectl -n <namespace> get deploy,svc,ingress,pod,pvc,externalsecret,secret | grep <app>
kubectl -n <namespace> describe deploy <app>
kubectl -n <namespace> logs deploy/<app> --tail=200
kubectl -n <namespace> rollout status deploy/<app> --timeout=240s
```

Render Kustomize:

```bash
kubectl kustomize apps
kubectl kustomize apps/<app>
```

Server-side validation:

```bash
kubectl apply --dry-run=server -k apps/<app>
```

Find repo references:

```bash
rg '<app>|<hostname>|<secret-name>|<pvc-name>' .
```

Audit live ingress hosts and TLS references:

```bash
kubectl get ingress -A -o jsonpath='{range .items[*]}{.metadata.namespace}{"/"}{.metadata.name}{" tls:"}{range .spec.tls[*]}{.secretName}{","}{end}{" hosts:"}{range .spec.rules[*]}{.host}{","}{end}{"\n"}{end}'
```

## Verification checklist

Before finishing HomeLab work, verify the relevant subset:

- No secrets or private infrastructure details were added to Git.
- The Git diff contains only intended durable changes.
- Kustomize renders successfully.
- Server-side dry-run succeeds or any failure is understood.
- ExternalSecrets are synced if secrets are involved.
- Pods are Ready and rollouts completed.
- Logs do not show obvious errors.
- Services have endpoints.
- Ingress hosts and TLS references are correct.
- Persistent data was not modified without a backup/rollback plan.
- Auth/callback flows were tested end to end when relevant.
- Any live emergency changes are either documented as temporary or represented in Git for durability.
