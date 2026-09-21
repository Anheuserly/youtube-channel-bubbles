# Data Flow & Lifecycle Documentation

## 1. The Service Request Journey
This document maps the flow of data from the moment a customer identifies a need to the final closure of a work order.

### Step-by-Step Flow
1. **Trigger**: Customer selects a "Service" or "AMC" listing from the marketplace.
2. **Intake**: The app collects:
    - Service type and urgency.
    - Site location (GPS).
    - Description and media (photos of the issue).
3. **Routing**: The system identifies eligible partners based on:
    - Category match (e.g., "Fire Safety").
    - Service area (City/Zone).
    - Current availability/load.
4. **Acceptance**: A partner accepts the request. The status changes to `assigned`.
5. **Execution**: The technician arrives on site, captures a "Start" photo, and updates the progress.
6. **Completion**: Technician captures "End" photo, uploads the report, and the customer signs off digitally.
7. **Closure**: Request is marked `completed`. The event is logged in the business's activity history.

## 2. AMC Contract Lifecycle
1. **Proposal**: Partner creates an AMC listing with specific visits (e.g., Quarterly).
2. **Subscription**: Customer accepts and pays. The system generates an AMC Record.
3. **Scheduling**: The system creates a series of "Visit" tasks based on the AMC frequency.
4. **Fulfillment**: Each visit is tracked as a sub-request.
5. **Renewal**: 30 days before expiry, the system triggers a renewal notification to both parties.

## 3. Marketplace Material Flow
1. **Listing**: Vendor uploads a product (SKU, Price, Stock).
2. **Enquiry**: Customer sends a "Requirement" request.
3. **Quote**: Vendor provides a final quote (including delivery).
4. **Transaction**: Payment is processed; delivery is scheduled.
