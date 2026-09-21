# Deployment & Infrastructure Guide

## 1. VPS & Database Infrastructure
The system is hosted on dedicated Linux VPS infrastructure. The core stack includes:
- **OS**: Ubuntu 22.04 LTS.
- **Runtime**: Node.js 20+ (for Next.js portal) and Docker (for backend services).
- **Database**: PostgreSQL 16+ with connection pooling and direct indexing.
- **Proxy**: Nginx / Cloudflare Edge for SSL termination, DDoS protection, and HTTP caching.

## 2. Backend & Data Layer Setup
Backend services are deployed via Docker Compose and high-performance serverless edge routes.
- **Database**: PostgreSQL relational schema managing businesses, listings, tickets, and user accounts.
- **Storage**: Cloudflare R2 / S3-compatible buckets configured for public assets (listings) and encrypted private buckets (documents).
- **Auth**: High-security JWT session tokens with bcrypt password hashing and SMS gateway verification.

## 3. Web Deployment (Cloudflare / Vercel / VPS)
- **CI/CD**: GitHub Actions trigger automated test & build on every merge to main.
- **Environment Variables**: All sensitive credentials (Database URL, JWT Secrets, Platform Keys) are managed securely via server-only environment variables.
- **Caching**: Incremental Static Regeneration (ISR) and Edge Caching for catalog listings to ensure fast global response times.

## 4. Mobile Release Pipeline
- **Android**: Built via Flutter CI / GitHub Actions $\rightarrow$ Google Play Store Console (`com.mepsge.amcsge`).
- **iOS**: Built via Xcode / Fastlane $\rightarrow$ Apple App Store Connect (`id6792257571`).
