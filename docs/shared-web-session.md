# Shared AMC MEP Web Session

AMC MEP web products share unified authentication via a first-party API endpoint:

```text
https://auth.amcmep.in/v1
```

This allows the secure HTTP-only session cookie to remain first-party across subdomains:

- `amcmep.in`
- `app.amcmep.in`
- `workspace.amcmep.in`
- `sge.org.in` (cross-domain API authorization)
- other trusted `*.amcmep.in` web products

## Session Architecture

1. The authentication service issues encrypted JWT session cookies with 24-hour expiration.
2. Standard claims include `userId`, `email`, `role` (`user`, `partner`, `admin`), and tenant workspace references.
3. Edge middleware intercepts incoming web requests, verifies the session cookie, and injects `x-user-id`, `x-user-email`, and `x-user-role` headers into downstream API routes.
4. CORS policies restrict origins to trusted AMC MEP production and staging domains.

## Environment Setup

Set this variable in AMC MEP web projects:

```text
NEXT_PUBLIC_AUTH_ENDPOINT=https://auth.amcmep.in/v1
```

All micro-frontends share this endpoint to validate sessions seamlessly without cross-origin third-party cookie restrictions.
