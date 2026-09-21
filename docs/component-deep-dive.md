# Component Deep Dive: Technical Implementation

## 1. SgeApiClient
The  is the foundational communication layer. It wraps standard HTTP calls with:
- **Request Interceptors**: Automatically attaches JWT tokens to headers.
- **Response Normalization**: Maps raw JSON from the backend into typed Dart/TS objects.
- **Error Handling**: Distinguishes between network errors, auth failures, and business logic errors.

## 2. OneWorkspaceService
This is the "orchestrator" for all business-related logic.
- **Context Management**: Tracks which business is currently "active" for the user.
- **Listing Management**: Handles the creation and updating of marketplace items.
- **Membership Logic**: Manages the complex relationship between users and business roles.

## 3. DataHubListingService
A specialized service for high-performance listing retrieval.
- **Caching**: Implements a local cache to ensure the marketplace feels instant.
- **Hydration**: Fetches minimal listing data first, then "hydrates" media URLs on demand to save bandwidth.
- **Filtering**: Implements server-side filtering for categories and availability.

## 4. State Management (Controllers)
The app uses a controller-based state pattern (similar to GetX or Provider):
- **MarketplaceController**: Manages the current search results and filters.
- **RequestController**: Handles the lifecycle of active work orders.
- **SessionController**: Manages the user's identity and workspace tokens.
