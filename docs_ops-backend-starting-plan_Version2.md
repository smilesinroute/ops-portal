# Simple & Safe Starting Plan for Ops Backend (MVP)

Goal
Build a minimal backend API and portal to manage orders and drivers securely. Keep it simple to launch fast but safe enough to protect your data.

Why Separate
- Security: Customer site stays static with no secrets or sensitive data.
- Maintainability: Internal portal handles sensitive operations (orders, pricing, assignments).
- Scalability: Deploy and scale independently from the marketing site.
- Future-proofing: Customer site will consume minimal, public APIs later; no operational logic there.

MVP Scope
- Roles: admin (and optionally dispatcher) vs driver.
- Auth: Password login with hashed passwords; JWT sessions.
- Orders: CRUD (admin), assignment, status workflow:
  - requested → assigned → in_transit → notarizing (if applicable) → completed
  - canceled as an exception path
- Permissions:
  - Admin: full order/driver management.
  - Driver: view only assigned orders; update statuses allowed by workflow.
- Event Log: Append-only order_events for status changes and notes.
- Security: Role checks on every API call; server-side validation of status transitions; HTTPS in production.

Tech Choices
- API: Node.js + Express (TypeScript).
- DB: Postgres (users, orders, order_events).
- Auth: bcrypt for password hashing + JWT.
- Validation: zod for payloads.
- Deployment: Independent from customer portal (Vercel/Render/Docker/VPS).

Future (Not in MVP)
- GPS tracking, photos/signatures, complex pricing engine.
- Public booking API for the customer site (add later if needed).
- Offline PWA for drivers (can be phased in after MVP stability).

Success Criteria
- Admins can log in, create/assign orders, and track statuses.
- Drivers can log in, see assigned orders, and progress them through allowed states.
- Every status change is recorded in order_events.
- Unauthorized access is blocked by role checks and DB constraints.