# System Maintenance Guide

## 1. Daily Health Checks
- **Log Monitoring**: Check the API logs and Cloudflare Worker / OpenNext edge telemetry for an increase in 5xx errors.
- **PostgreSQL / VPS Status**: Verify that the PostgreSQL database cluster and VPS services are healthy.
- **Database Performance**: Monitor slow queries, connection pool sizing, and active transactions in the PostgreSQL engine.

## 2. Backup Strategy
- **Database**: Automated daily snapshots and WAL archives of the primary PostgreSQL database.
- **Storage**: S3-compatible / Cloudflare R2 backup of all uploaded media objects, documents, and certification assets.
- **Configuration**: Version-controlled environment files, secret management, and infrastructure scripts.

## 3. Update Procedure
1. **Backup**: Take a manual snapshot of the database prior to schema migrations.
2. **Staging**: Deploy the update to the staging environment first.
3. **Verification**: Run smoke test suites (Auth $\rightarrow$ Listing API $\rightarrow$ Request).
4. **Production**: Deploy to production using zero-downtime rolling updates.

## 4. Troubleshooting Common Issues
- **Notification Failures**: Check the FCM (Firebase Cloud Messaging) token validity and Apple APNs configuration.
- **Listing Invisibility**: Verify that the `published` flag is set to true, `business_id` matches, and the category is active.
- **Auth Loops**: Clear browser session cookies and verify JWT session token expiry.
