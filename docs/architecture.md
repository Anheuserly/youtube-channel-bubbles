# AMCMEP Platform Architecture — v2.0 Proposal

## Executive Summary

This document proposes a professional, scalable, subdomain-driven architecture for the **AMCMEP.in** ecosystem. The goal is to separate public discovery (SEO) from authenticated apps (customer, partner, admin), centralize the API layer, and eliminate the structural mistakes from the current build.

---

## 1. Domain & Subdomain Strategy

| Subdomain | Purpose | Audience | Auth Required |
|-----------|---------|----------|---------------|
| `amcmep.in` / `www.amcmep.in` | Public search portal, SEO-optimized landing pages, business directory, content/blog | Public | No |
| `app.amcmep.in` | Customer web app — service requests, AMC dashboard, chat, feed, bookings | Customers | Yes |
| `partner.amcmep.in` | Service provider / vendor dashboard — leads, jobs, business profile, analytics, payouts | Partners | Yes |
| `admin.amcmep.in` | Internal operations dashboard — user management, content moderation, dispute resolution, payouts | Operations Team | Yes (RBAC) |
| `api.amcmep.in` | Unified API gateway — all backend services, edge functions, webhooks | Apps / Developers | API Key / JWT |
| `docs.amcmep.in` | API documentation, partner integration guides, SDK references | Developers / Partners | No |
| `status.amcmep.in` | Service status page, incident history, uptime monitoring | Public | No |
| `assets.amcmep.in` | CDN for static assets, images, media, branding files | All | No |

> **Rule:** Every authenticated surface gets its own subdomain. `amcmep.in` stays 100% public and SEO-focused. No authenticated dashboards leak into the main domain.

---

## 2. Repository Strategy

### Recommended: Hybrid Monorepo + Separate Native Repo

Instead of 8 scattered repositories, use **2 primary repositories** with clean internal structure:

### Repository A: `amcmep-platform` (Monorepo)

Contains all web properties and shared code. Managed with **Turborepo** or **Nx**.

```
amcmep-platform/
├── apps/
│   ├── portal/          → amcmep.in (public search & marketing)
│   ├── customer/        → app.amcmep.in (customer web app)
│   ├── partner/         → partner.amcmep.in (provider dashboard)
│   ├── admin/           → admin.amcmep.in (operations)
│   ├── docs/            → docs.amcmep.in (documentation site)
│   └── status/          → status.amcmep.in (status page)
├── packages/
│   ├── ui/              → Shared design system (React + Tailwind)
│   ├── config/          → Shared ESLint, TS, Tailwind configs
│   ├── types/           → Shared TypeScript interfaces & API types
│   ├── sdk/             → Generated API client SDK (used by all apps)
│   ├── utils/           → Shared utilities, helpers, validators
│   └── auth/            → Shared auth logic, session guards, RBAC hooks
├── services/
│   └── api/             → Edge functions, serverless API routes, PostgreSQL data access
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

**Why monorepo for web?**
- One PR can update the API + all consuming apps simultaneously
- Shared UI components ensure visual consistency across portal, customer, partner, and admin
- Single CI/CD pipeline for all web deployments
- Easy to refactor types across the stack

### Repository B: `amcmep-mobile` (Native Apps)

```
amcmep-mobile/
├── android/
├── ios/
├── lib/
├── test/
├── packages/
│   └── amcmep_sdk/      → Dart SDK generated from OpenAPI spec (shared with web SDK)
├── pubspec.yaml
└── README.md
```

**Why separate?**
- Flutter tooling is independent from Node.js/web
- Mobile release cycles (App Store / Play Store) are slower than web deployments
- Prevents mobile-specific build tooling from polluting web CI/CD

### Repository C: `amcmep-assets` (Optional, Lightweight)

```
amcmep-assets/
├── brand/
│   ├── logo/
│   ├── icons/
│   └── illustrations/
├── media/
│   └── press-kit/
└── README.md
```

---

## 3. What to Do with Current Repositories

| Current Repo | Action | New Home |
|-------------|--------|----------|
| `amcmep` | **Archive / migrate** | Merge into `amcmep-platform/apps/portal` |
| `amcmep-one-app` | **Archive / migrate** | Merge into `amcmep-platform/apps/customer` |
| `flutter_application_14amcmep24x7one` | **Rename** → `amcmep-mobile` | Keep as separate repo, clean up structure |
| `amcmep24x7-whatsapp` | Evaluate if still needed | Could become a package inside `amcmep-platform/services/` or separate micro-service |

> **Immediate action:** Rename `flutter_application_14amcmep24x7one` → `amcmep-mobile`. Remove the old `amcmep-one-app` empty repo or reinitialize it properly.

---

## 4. Architecture Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────┐ │
│  │ amcmep.in    │ │app.amcmep.in│ │partner.amcmep│ │admin... │ │
│  │ (Portal)     │ │ (Customer)   │ │   .in        │ │         │ │
│  │ Next.js SSR  │ │ Next.js SPA  │ │ Next.js SPA  │ │         │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         amcmep-mobile (Flutter iOS/Android)                   │ │
│  └────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                        SDK / CLIENT LAYER                        │
│         Shared TypeScript SDK  |  Dart SDK (generated)            │
├─────────────────────────────────────────────────────────────────┤
│                         API GATEWAY LAYER                        │
│              api.amcmep.in (Next.js Edge / Vercel)               │
│         ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│         │ /v1/search  │  │ /v1/requests│  │ /v1/chat    │       │
│         │ /v1/business│  │ /v1/amc     │  │ /v1/feed    │       │
│         └─────────────┘  └─────────────┘  └─────────────┘       │
├─────────────────────────────────────────────────────────────────┤
│                       BACKEND SERVICES                           │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐    │
│  │  JWT Auth  │ │ PostgreSQL │ │ Cloudflare │ │ Edge       │    │
│  │  Service   │ │ Database   │ │ R2 / S3    │ │ Functions  │    │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘    │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                   │
│  │  Search    │ │  Payments  │ │  Push/FCM  │                   │
│  │  (Algolia/ │ │  (Razorpay/│ │  (Firebase/│                   │
│  │   Typesense)│ │   Stripe)  │ │   OneSignal)│                   │
│  └────────────┘ └────────────┘ └────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Shared Design System (Critical Fix)

**Current mistake:** No shared UI kit. Every app looks different.

**Fix:** Create `packages/ui` in the monorepo with:

```
packages/ui/
├── src/
│   ├── components/      → Buttons, Inputs, Cards, Modals, Tables
│   ├── layout/          → Shells, Navbars, Sidebars, Footers
│   ├── primitives/      → Headless UI base + Tailwind
│   ├── theme/           → Colors, typography, spacing, breakpoints
│   └── hooks/           → Shared React hooks (useAuth, useSearch, useChat)
├── package.json
└── tsconfig.json
```

**All web apps must consume this package.** Mobile uses a Flutter equivalent theme file.

---

## 6. API Contract First (OpenAPI Spec)

**Current mistake:** APIs are ad-hoc, types duplicated across apps.

**Fix:** Maintain `services/api/openapi.yaml` as the single source of truth.

```
services/api/
├── openapi.yaml              → Master API spec
├── generators/
│   ├── typescript/           → Auto-generates packages/sdk
│   └── dart/                 → Auto-generates amcmep-mobile/packages/amcmep_sdk
├── routes/
│   ├── search/
│   ├── requests/
│   ├── amc/
│   ├── chat/
│   ├── feed/
│   └── marketplace/
└── functions/                → Backend microservices & edge functions
```

**Rule:** Frontend teams do NOT write API client code. They import the generated SDK.

---

## 7. Deployment & Hosting Strategy

| Subdomain | Platform | Framework | Notes |
|-----------|----------|-----------|-------|
| `amcmep.in` | Vercel | Next.js (SSR) | SEO-critical, use ISR for business pages |
| `app.amcmep.in` | Vercel | Next.js (SPA) | Customer app, CDN-cached static |
| `partner.amcmep.in` | Vercel | Next.js (SPA) | Partner dashboard |
| `admin.amcmep.in` | Vercel | Next.js (SPA) | Internal, IP-restricted if needed |
| `api.amcmep.in` | Edge / Cloudflare / Node | Edge Functions | Unified entry point |
| `docs.amcmep.in` | Vercel / Mintlify | Static / MDX | Documentation hosting |
| `status.amcmep.in` | Statuspage.io / Instatus | Static | Third-party status page |
| Mobile | Play Store + App Store | Flutter | Separate release pipeline |

---

## 8. Data & Auth Flow

```
[User]
   │
   ├─ visits amcmep.in → sees public search, no auth needed
   │
   ├─ clicks "Login / Sign Up" → redirects to auth.amcmep.in (or modal)
   │     → JWT Auth (Phone OTP + Password + OAuth)
   │
   ├─ Customer? → redirect to app.amcmep.in (JWT session)
   ├─ Partner?  → redirect to partner.amcmep.in (JWT + role check)
   └─ Admin?    → redirect to admin.amcmep.in (JWT + RBAC)
```

**Auth Strategy:**
- Use **Enterprise JWT Authentication** as the identity provider
- Store role (`customer`, `partner`, `admin`) in PostgreSQL user tables and verified token claims
- Issue secure HTTP-only cookies and JWTs for session management
- API Gateway validates JWT on every request

---

## 9. SEO & Search Strategy for amcmep.in

**This is the main domain. It must be perfect.**

### Structure:
```
amcmep.in/
├── /                     → Hero search + featured categories
├── /search?q=plumber     → Search results page (server-rendered)
├── /services/[slug]      → Category pages (HVAC, Plumbing, Electrical, etc.)
├── /business/[id]        → Business profile pages (ISR, dynamic meta)
├── /blog/                → Content marketing
├── /about                → Company info
├── /partner-with-us      → Partner onboarding landing
└── /contact              → Support / contact
```

### Technical SEO Checklist:
- [ ] Next.js App Router with `generateMetadata()` for every dynamic page
- [ ] `/sitemap.xml` auto-generated from business database
- [ ] `/robots.txt` with proper crawl rules
- [ ] Structured data (JSON-LD) for LocalBusiness, Service on every business page
- [ ] Core Web Vitals optimization (LCP < 2.5s, CLS < 0.1)
- [ ] Open Graph images for every shareable page
- [ ] Canonical URLs to prevent duplicate content
- [ ] Server-side rendering for search pages (no client-side search for SEO)

---

## 10. Migration Plan (Step-by-Step)

### Phase 1: Foundation (Week 1-2)
1. Create `amcmep-platform` monorepo with Turborepo
2. Set up `packages/ui`, `packages/types`, `packages/config`
3. Create `apps/portal` and migrate content from current `amcmep` repo
4. Rename Flutter repo to `amcmep-mobile`
5. Set up `api.amcmep.in` subdomain pointing to `services/api`

### Phase 2: Customer App (Week 3-4)
1. Build `apps/customer` (app.amcmep.in)
2. Migrate features from current `amcmep-one-app` (if any exist)
3. Connect to generated SDK
4. Implement auth flow with JWT & session cookies

### Phase 3: Partner Portal (Week 5-6)
1. Build `apps/partner` (partner.amcmep.in)
2. Partner registration flow
3. Lead management, job board, analytics dashboard
4. Payout integration

### Phase 4: Admin & Polish (Week 7-8)
1. Build `apps/admin` (admin.amcmep.in)
2. Content moderation tools
3. User management with RBAC
4. Platform analytics

### Phase 5: Mobile Sync (Ongoing)
1. Generate Dart SDK from OpenAPI spec
2. Refactor Flutter app to use generated SDK
3. Clean up old hardcoded API calls
4. Release updated mobile app

---

## 11. Repository List (Final Names)

Create these repositories on GitHub/GitLab:

1. **`amcmep-platform`** → Monorepo for all web apps, shared packages, API
2. **`amcmep-mobile`** → Flutter iOS/Android app (rename from current Flutter repo)
3. **`amcmep-assets`** → Brand assets, logos, media (optional but professional)
4. **`amcmep-infra`** → Infrastructure as Code (Terraform/Pulumi), DNS configs, CI/CD workflows (optional, advanced)

**Archive these:**
- `amcmep` → migrate to `amcmep-platform/apps/portal`
- `amcmep-one-app` → migrate to `amcmep-platform/apps/customer`
- `flutter_application_14amcmep24x7one` → rename to `amcmep-mobile`

---

## 12. Technology Stack Summary

| Layer | Technology |
|-------|------------|
| Web Apps | Next.js 15 + React 19 + TypeScript |
| Styling | Tailwind CSS + Shared Design System |
| Mobile | Flutter (Dart) |
| Backend | PostgreSQL (Auth, Relational DB, R2 Storage, Edge APIs) |
| API Gateway | Next.js Edge API Routes |
| Search | Algolia or Typesense (for fast search) |
| Payments | Razorpay (India) / Stripe (Global) |
| Push | Firebase Cloud Messaging |
| Hosting | Cloudflare Edge / Vercel (Web) + VPS PostgreSQL (Backend) |
| CI/CD | GitHub Actions |
| Monitoring | Vercel Analytics + Sentry |
| Status | Instatus / Statuspage.io |

---

## 13. Common Mistakes to Avoid (Learned from v1)

| Mistake | Fix |
|---------|-----|
| Mixing public SEO pages with auth dashboards | Strict subdomain separation |
| Long, messy repo names | Short, descriptive names: `amcmep-mobile`, `amcmep-platform` |
| Empty repos (`amcmep-one-app`) | Initialize only when ready to build |
| Hardcoded API URLs in Flutter | Use generated SDK from OpenAPI spec |
| No shared types / duplicated interfaces | Central `packages/types` in monorepo |
| No design system | Build `packages/ui` before any new UI |
| No RBAC (everyone sees everything) | Role-based access: customer, partner, admin |
| Client-side search for SEO | Server-render search pages with ISR |
| Monolithic backend scripts | Move to structured services in monorepo |

---

**Next Step:** If you approve this architecture, I can scaffold the `amcmep-platform` monorepo with Turborepo, set up the `packages/ui` design system, and migrate the current `amcmep` portal into `apps/portal`.
