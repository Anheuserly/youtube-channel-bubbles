# AMC MEP 24x7 Service Activation Checklist

This checklist explains how each visible AMC MEP 24x7 service becomes fully working beyond the UI preview.

## Search verticals

- Seed the `search_documents` collection with `title`, `url`, `domain`, `snippet`, `content`, `vertical`, `language`, `region`, and ranking scores.
- Map the existing `administrators` collection to business search results.
- Map the existing `providers` collection as partners attached to administrator businesses, then use those partner records for marketplace operations and fulfilment.
- Keep `clients` for normal search users, saved preferences, and customer flows.
- Add one full-text index for `content`.
- Add indexes for `vertical`, `language`, `region`, and descending `rankScore`.
- Store vertical-specific fields later:
  - Providers: profile name, category, location, website URL, verification status, service areas.
  - Marketplace: administrator business id, provider/partner id, product/service title, catalog metadata, enquiry route, rank score.
  - Images: thumbnail URL, width, height, image embedding.
  - Videos: thumbnail URL, duration, channel/source, transcript.
  - News: publisher, published date, story cluster id.
  - Maps: latitude, longitude, place id, address, category.
  - Shopping: price, currency, merchant, availability, rating.

## AI and intelligence

- Connect an AI model gateway for answer generation.
- Require citations from the visible result set or a retrieval pipeline.
- Add separate collections for conversations, messages, translation history, finance snapshots, weather cache, and scholar metadata.
- Keep AI answers secondary to organic results until citations and safety checks are reliable.

## Productivity apps

- Mail needs a mail provider, mailbox schema, message/thread collections, spam rules, and compose/send flows.
- Drive needs storage buckets, file metadata, upload, permissions, previews, sharing links, and version history.
- Docs, Sheets, and Slides need editor engines plus realtime collaboration and export pipelines.
- Calendar needs event schema, recurrence, reminders, invites, and availability lookup.
- Keep needs notes, labels, reminders, search, and quick-capture actions.

## Developer platform

- Domain Connect needs `business_domains`, DNS verification, custom domain routing, SSL status checks, and reserved subdomain protection.
- Cloud needs project/resource models, quotas, billing, provisioning jobs, and status tracking.
- Dev Tools needs API keys, SDK documentation, request logs, and test-console routes.
- Studio needs file/project storage, code editor runtime, build jobs, and deployment targets.
- Analytics needs event ingestion, metrics storage, dashboard queries, and alert rules.

## Current UI behavior

- Every sidebar item now opens either a search vertical or a service dashboard.
- The app launcher icon opens a grid of services.
- Services marked `Preview` have visible UI behavior but still need real data to become production features.
- Services marked `Needs API` or `Needs backend` need the integrations listed on their dashboard before they can perform real work.
