# Nexlayer — stripe-integration

<!-- nexlayer:meta version=1 analyzed=2026-06-30T17:58:23Z repo=https://github.com/KatieHarris2397/stripe-integration branch=main -->

> **For AI agents (Claude Code, Cursor, Gemini CLI, Copilot):**
> This file is the **project context** for this Nexlayer deployment — tech stack, env vars, secrets, live URL.
> For full platform detail (nexlayer.yaml schema, Dockerfile rules, CI/CD, task recipes) read **`nexlayer.skills`** in this repo.
>
> **Critical rules (full detail in `nexlayer.skills`):**
> - Inter-pod refs: `${podName:port}` only — never `localhost` or bare hostnames
> - Docker Hub images: prefix with `mirror.gcr.io/library/` — bare tags fail on the cluster
> - Secrets: set in the Nexlayer dashboard — never commit to `nexlayer.yaml` or Dockerfile
>
> **This file:** `agent-managed` sections update automatically. `user-editable` sections (Local Development Setup, Nexlayer Deployment Plan, Build Notes) are yours — preserved across re-analysis.

## Project Summary
<!-- nexlayer:section agent-managed=project_summary -->
A Next.js application integrated with the Stripe API for handling payments and subscription management.
<!-- nexlayer:end -->

## Technology Stack
<!-- nexlayer:section agent-managed=tech_stack -->
| Name | Kind | Version | Detected From |
|------|------|---------|---------------|
| Next.js | framework | 16.2.9 | package.json |
| React | framework | 19.2.4 | package.json |
| TypeScript | language | 5 | package.json |
| Stripe | tool | 22.3.0 | package.json |
| TailwindCSS | tool | 4 | package.json |
<!-- nexlayer:end -->

## Repository Structure
<!-- nexlayer:section agent-managed=structure_map -->
- app/ — Next.js App Router pages and server components
- lib/ — Shared utility functions and Stripe client configuration
- public/ — Static assets
- next.config.ts — Next.js configuration
<!-- nexlayer:end -->

## External Services Required
<!-- nexlayer:section agent-managed=external_deps -->
Services that must be configured separately (not deployed by Nexlayer):

- Stripe API (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)
<!-- nexlayer:end -->

## Local Development Setup
<!-- nexlayer:section user-editable=local_setup -->
### Prerequisites

- Node.js >= 20
- bun

### Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Steps

1. `bun install` — Install dependencies using Bun
2. `bun run dev` — Start development server on http://localhost:3000

<!-- nexlayer:end -->

## Nexlayer Setup
<!-- nexlayer:section agent-managed=nexlayer_setup -->
### Pod Environment Variables

| Pod | Variable | Value | Kind |
|-----|----------|-------|------|
| `web` | `STRIPE_SECRET_KEY` | `"${STRIPE_SECRET_KEY}"` | inter-pod |
| `web` | `STRIPE_WEBHOOK_SECRET` | `"${STRIPE_WEBHOOK_SECRET}"` | inter-pod |
| `web` | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `"${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}"` | inter-pod |
| `web` | `PORT` | `"3000"` | plain |
| `web` | `HOSTNAME` | `"0.0.0.0"` | plain |
| `web` | `NODE_ENV` | `"production"` | plain |

### nexlayer.yaml

```yaml
application:
  name: app
  pods:
    - name: web
      image: "registry.nexlayer.io/user_01kna6j8vrcfj9q0wjtq5qsq3n/stripe-integration:19f19ae589b"
      path: /
      servicePorts:
        - 3000
      vars:
        STRIPE_SECRET_KEY: "${STRIPE_SECRET_KEY}"
        STRIPE_WEBHOOK_SECRET: "${STRIPE_WEBHOOK_SECRET}"
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}"
        PORT: "3000"
        HOSTNAME: "0.0.0.0"
        NODE_ENV: "production"
```

<!-- nexlayer:end -->

## Nexlayer Deployment Plan
<!-- nexlayer:section user-editable=deployment_plan -->
### Pod Topology

| Pod | Image | Port | Role |
|-----|-------|------|------|
| web | mirror.gcr.io/library/node:22-alpine | 3000 | web |

### Deployment notes

- The application is a standalone Next.js server; no internal database pod is defined in the current repository source, though Stripe acts as the external state manager for payments.

<!-- nexlayer:end -->

## Build Notes
<!-- nexlayer:section user-editable=build_notes -->
<!-- Add notes for future builds here — preserved across re-analysis -->
<!-- nexlayer:end -->

## Nexlayer Configuration
<!-- nexlayer:section agent-managed=nexlayer_config -->
**Last deployed:** 2026-06-30T18:00:17Z  
**Live URL:** https://kitbear-studio-app.cloud.nexlayer.ai  
**Runtime:** node · **Port:** 3000  
**Deploy branch:** main  

```yaml
application:
  name: app
  pods:
    - name: web
      image: "registry.nexlayer.io/user_01kna6j8vrcfj9q0wjtq5qsq3n/stripe-integration:19f19ae589b"
      path: /
      servicePorts:
        - 3000
      vars:
        STRIPE_SECRET_KEY: "${STRIPE_SECRET_KEY}"
        STRIPE_WEBHOOK_SECRET: "${STRIPE_WEBHOOK_SECRET}"
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}"
        PORT: "3000"
        HOSTNAME: "0.0.0.0"
        NODE_ENV: "production"
```
<!-- nexlayer:end -->

## Build History
<!-- nexlayer:section agent-managed=build_history -->
| Date | Status | Notes |
|------|--------|-------|
| 2026-06-30T17:58:23Z | analyzed | initial repo analysis |
| 2026-06-30T18:00:17Z | success | deployed https://kitbear-studio-app.cloud.nexlayer.ai |
<!-- nexlayer:end -->
