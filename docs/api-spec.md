# API Specification (v1)

## Base URL
`https://api.amcmep.in/v1`

## Endpoints

### 1. Businesses
- `GET /businesses`: List all verified businesses.
- `POST /businesses`: Register a new business profile.
- `PATCH /businesses/\{id\}`: Update business metadata.

### 2. Listings
- `GET /listings`: Search and filter marketplace items.
- `POST /listings`: Create a new AMC, PMC, Service, or Product listing.
- `PATCH /listings/\{id\}`: Update price or availability.

### 3. Work Requests
- `POST /requests`: Create a new service request.
- `GET /requests/mine`: View requests assigned to the current user.
- `PATCH /requests/\{id\}`: Update request status (e.g., "In Progress").

### 4. Auth & Session
- `POST /auth/login`: Phone-based authentication.
- `GET /session/me`: Retrieve current user's workspace and roles.
