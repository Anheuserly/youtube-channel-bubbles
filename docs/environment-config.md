# Environment & Configuration

This document outlines the core platform configuration and environment variables required to run the AMC MEP 24x7 web application, derived directly from the Flutter app's `Environment` class.

## Base URLs
The platform operates across several interconnected domains and APIs:
- **DataHub API (Live):** `https://storage.amcmep.in/v1`
- **SGE Cloud API:** `https://cloud.sge.amcmep.in`
- **Main Web (This app):** `https://amcmep.in`


## Platform Identifiers
When interacting with the DataHub API, the following keys distinguish the traffic source and context:
- **Project Key:** `amcmep`
- **Operational Database ID:** `amcmep`
- **Web Application Key:** `amcmep_web`
- **Android Application Key:** `amcmep_android` (Package: `com.mepsge.amcsge`)
- **iOS Application Key:** `amcmep_ios` (Bundle: `com.mepsge.amcmep24x7one`)

## Required Environment Variables (.env.local)
To run this Next.js project locally, you should configure the following environment variables:

```env
# The target API for PostgreSQL DataHub
DATA_HUB_VPS_API_URL=https://storage.amcmep.in/v1

# The API Key for internal Server-to-Server DataHub calls
DATA_HUB_INTERNAL_API_KEY=SGE_live_amcmep_ekTZVFKxhs-VoNqGbTS0RPMB3Vx3WJwi

# Optional overrides

MAIN_WEB_BASE_URL=https://amcmep.in
```

## Third-Party Integrations
- **WebRTC (Calls):** Uses Google STUN servers (`stun:stun.l.google.com:19302`) and configurable TURN servers.
- **Google Maps:** Configured via `googleMapsApiKey`. Note: API keys should be restricted by HTTP referrers in the Google Cloud Console.
