# System Design Document: AMC MEP 24x7 Ecosystem

## 1. Introduction
The AMC MEP 24x7 platform is a specialized service ecosystem designed to bridge the gap between MEP (Mechanical, Electrical, Plumbing) and Fire Safety service providers and their end customers. The system focuses on high-availability service requests, annual maintenance contracts (AMC), and a verified marketplace for industrial products.

## 2. Design Philosophy: "One Workspace"
The core architectural principle is the **One Workspace**. Instead of fragmented user profiles, the system treats every entity (Company, Partner, Technician) as a participant in a shared workspace.

### Core Concepts
- **Unified Identity**: A single user can be a customer in one context and a partner in another.
- **Resource Sharing**: Work requests, documents, and chat histories are bound to the workspace/business, not just the individual user.
- **Permission-Based Access**: Access is governed by roles (Owner, Admin, Technician, Viewer) defined at the business level.

## 3. High-Level Architecture
The system follows a decoupled client-server architecture:

### Presentation Layer
- **Mobile (Flutter)**: The primary interface for technicians and customers. Handles real-time notifications, GPS-based location services, and media capture for site reports.
- **Web Portal (Next.js)**: SEO-optimized public search for customers and a management dashboard for partners and admins.

### API Gateway Layer
- A unified API surface that abstracts the backend. It handles authentication, request validation, and routing to various data sources.

### Data & Backend Layer
- **PostgreSQL & Edge Services**: Serves as the primary enterprise data layer:
    - **Auth**: Secure JWT-based sessions, role-based access control (RBAC), and SMS OTP authentication.
    - **Database**: Relational PostgreSQL schema with ACID compliance for businesses, listings, work orders, and billing.
    - **Storage**: S3 / R2 CDN-backed storage for site photos, blueprints, and statutory certificates.
    - **Functions / Edge API**: Server-side logic for order dispatching, payment webhooks, and push notification triggers.

## 4. Key System Modules
### 4.1 Marketplace & Listings
Allows businesses to publish "Listings" which can be of four types:
1. **AMC**: Recurring maintenance contracts.
2. **PMC**: Compliance and statutory inspection plans.
3. **Service**: One-time repair or installation jobs.
4. **Product**: Physical material supply.

### 4.2 Request Lifecycle Management
Tracks a service request from "Requested" $\rightarrow$ "Assigned" $\rightarrow$ "In Progress" $\rightarrow$ "Completed". Every state change is logged for auditability.

### 4.3 Communication Hub
Integrates real-time chat and call logs between customers and partners, ensuring all professional communication is archived within the business workspace.

## 5. Technical Constraints
- **Latency**: Service requests must be routed to partners in < 2 seconds.
- **Availability**: The system must support 24x7 operationality.
- **Scale**: Designed to handle thousands of concurrent listings across multiple cities.
