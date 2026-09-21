# Database Schema Map

This document serves as the official reference for the `amcmep` PostgreSQL database schema hosted on the SGE DataHub. When building features in Next.js, these are the exact tables and columns we query via the REST API.

## 1. Authentication & Users
* **`auth_accounts`**: Core user credentials (`id`, `user_id`, `email`, `phone`, `password_hash`, `status`).
* **`auth_identities`**: Social logins & Firebase mappings (`firebase_uid`, `canonical_user_id`).
* **`auth_sessions`**: Active login sessions across devices (`refresh_token_hash`, `device_id`, `ip_address`).
* **`user_profiles`**: Public facing user data (`name`, `roles`, `business_ids`, `partner_type`).
* **`guest_profiles`**: Unregistered app users (`device_id`, `fcm_token`).

## 2. Businesses & Services
* **`businesses`**: Core business entities (`id`, `name`, `kind`, `location`).
* **`business_memberships`**: RBAC linking users to businesses (`user_id`, `business_id`, `role`, `permissions`).
* **`service_catalog`**: Master list of offered MEP services (`slug`, `group_name`, `domain`).
* **`listings`**: The Marketplace! Products/Services listed by businesses (`type`, `title`, `price`, `availability`, `media_object_key`).
* **`work_requests`**: Service/Maintenance tracking (`request_number`, `request_type`, `assigned_business_id`, `status`, `amount`).
* **`work_request_targets`**: Lead distribution/targeting for jobs.

## 3. Social & Community (Feed / Moments)
* **`feed_posts`**: Public timeline posts (`author_user_id`, `body`, `media_object_keys`, `visibility`).
* **`feed_comments`**: Nested comments on posts (`parent_comment_id`, `body`).
* **`feed_likes`**: Like interactions.
* **`moments`**: Ephemeral stories (`media_object_key`, `text`, `expires_at`).
* **`moment_views` & `moment_replies`**: Story interactions.
* **`connections`**: Follower/Following graph.

## 4. Chat & Communication
* **`conversations`**: Chat rooms/threads (`type`, `subject`, `participant_user_ids`).
* **`chat_messages`**: Individual messages (`conversation_id`, `body`, `type`).
* **`call_sessions` & `call_participants`**: WebRTC audio/video calls (`offer`, `answer`, `status`).

## 5. Media & Infrastructure
* **`media_objects`**: Centralized file/attachment tracking (`object_key`, `content_type`, `byte_size`).
* **`payment_configs`**: UPI and gateway settings (`upi_id`, `account_number`, `qr_object_key`).
* **`device_tokens`**: Push notification targets (`token`, `platform`).
* **`notification_inbox`**: In-app notifications (`title`, `body`, `action_url`).

## Best Practices for API Usage
When fetching from these tables via the DataHub API:
1. Always use `project_key=amcmep` and `application_id=amcmep_web`.
2. Secure write operations (like `auth_accounts` or `work_requests`) must be routed through Next.js API Routes (`/api/...`) to keep `DATA_HUB_INTERNAL_API_KEY` secure.
3. Read-heavy public tables (like `listings` or `feed_posts`) can be fetched in React Server Components for optimal SEO and performance.
