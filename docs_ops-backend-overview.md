# Independent Operations Backend & Portal — MVP Overview

This document outlines the MVP for a separate internal system to manage orders, drivers, and status updates for courier and mobile notary operations. It is intentionally independent from the public customer portal (React + Vite on Netlify).

## Purpose
Build an internal operations portal and backend for:
- Order management (CRUD + status workflow)
- Driver assignments
- Status updates with audit trail
- Role-based authentication and access control

## Why Separate?
- Security: Public site stays static and holds no secrets/sensitive data.
- Maintainability: Operational data (orders, pricing, assignments) lives behind auth.
- Scalability: Deploy/update/scale ops without impacting the marketing site.
- Future-proofing: Customer portal consumes minimal, public-facing APIs only when needed.

## Roles & Access
- Admin: Full access to orders, pricing, assignments, users.
- Dispatcher (optional): Same as Admin minus system settings.
- Driver: View only own assigned orders; perform status updates; no pricing visibility.

## MVP Scope
Must-have:
- Auth with roles (Admin, Driver; Dispatcher optional).
- Orders CRUD with status workflow:
  - requested → assigned → in_transit → notarizing (if applicable) → completed
  - canceled as exception path
- Manual driver assignments.
- Order event log (timeline) for every status change/note.
- Pricing fields (manual inputs); no complex engine.
- Basic internal REST API (internal-only), secured via role checks or RLS policies.

Non-goals (for MVP):
- Real-time GPS tracking
- Photo proof & signatures
- External client login
- Complex pricing engine
- Public API for booking (can be added later)

## Technical Stack & Architecture
- Backend & DB: Supabase (Postgres + Auth + Row-Level Security) recommended for fast MVP.
  - Alternative: Firebase (trade-offs for relational data).
- Frontend (internal portal): Next.js (or React + Vite) hosted separately (Vercel/Render/self-host).
- API: Internal REST endpoints for orders, users, events.
- Offline (Future): Driver PWA caches assigned orders, queues updates offline.
- Deployment: Independent from customer portal; separate environment config and secrets.

## Status Workflow
- requested → assigned → in_transit → notarizing? → completed
- canceled allowed from requested/assigned (with reason).
- Only valid transitions allowed via a centralized state helper.

## Data Model (MVP)
- users: id, email, role (admin|driver|dispatcher), password/auth provider, full_name, created_at
- drivers: user_id, commission_number, commission_expiry, active, license_verified
- orders: id, client_ref?, service_type (notary|courier|combined), status, pickup_city/zip, delivery_city/zip, urgency, document_type, notes, assigned_driver, pricing fields, created_at, updated_at
- order_events: id, order_id, type, actor_user, data jsonb, created_at

## API Surface (Internal)
- POST /api/auth/login (if not using Supabase client directly)
- GET /api/orders?status=
- POST /api/orders
- PATCH /api/orders/:id (restricted fields)
- PATCH /api/orders/:id/status  { action: "assign" | "pickup_start" | "pickup_complete" | "deliver" | "notary_start" | "complete" | "cancel" }
- GET /api/orders/:id/events
- POST /api/orders/:id/events  (notes/manual adjustments)
- GET /api/drivers
- PATCH /api/drivers/:id  (activate/deactivate, commission data)

Future public API (optional):
- POST /api/public/order-request
- GET  /api/public/order-status/:publicId

## Security & Access Control
- Enforce role checks on server/API.
- With Supabase, use RLS:
  - Drivers can only SELECT orders where assigned_driver = auth.uid()
  - Drivers can INSERT order_events for their assigned orders
  - Admins unrestricted
- Separate secrets from customer portal; no shared environment across apps.
- Audit trail via order_events; immutable append-only behavior for critical changes.

## Environments & Deployment
- Dev, Staging, Prod separated.
- Portal: Vercel/Render or self-host; DB: Supabase project per environment.
- Backups: Enable automated DB backups (or pg_dump schedule if self-hosted).
- Health checks & minimal monitoring.

## Milestones (Sequenced)
- Milestone 1: Foundations
  - [ ] Create repo for ops portal (e.g., `ops-portal`)
  - [ ] Pick BaaS (Supabase recommended) and create project
  - [ ] Apply initial DB schema (see `db/migrations/001_init.sql`)
  - [ ] Auth + roles (seed first admin)
  - [ ] Basic portal shell (login, layout, protected routes)

- Milestone 2: Orders Core
  - [ ] Orders CRUD (admin)
  - [ ] Status state machine utility + server enforcement
  - [ ] Driver management (create/link driver to user)
  - [ ] Assignment action (admin UI) + visibility of assigned_driver

- Milestone 3: Driver Workflow
  - [ ] Driver “My Jobs” list + order detail
  - [ ] Status update actions (writes `order_events`, updates `orders.status`)
  - [ ] Order events timeline component (admin + driver views)
  - [ ] Pricing fields (admin-only), total calculation helper

- Milestone 4: Security & Ops
  - [ ] RLS policies (Supabase) with tests
  - [ ] Error handling & logging
  - [ ] Health check endpoint and basic monitoring
  - [ ] Documentation: setup, deploy, RLS policy notes

- Milestone 5 (Optional Next)
  - [ ] Commission expiry reminders (weekly job)
  - [ ] Public order-request endpoint for customer portal ingestion
  - [ ] PWA groundwork (manifest + basic service worker)

## Open Decisions
- Supabase vs Firebase (default: Supabase for relational + RLS)
- Include `notarizing` step in MVP or later only for combined orders?
- Separate Dispatcher role now or later?

## Success Metrics (Initial)
- Time from requested → assigned (median)
- On-time completion rate (%)
- Driver acceptance rate
- Incidents per 100 orders (canceled/reassigned)

## Ownership & Next Steps
- Confirm repo name and hosting approach.
- Apply initial schema and seed admin.
- Implement Milestone 1; then proceed in order.

---
Last updated: {{today}}