# Security Basics (MVP)

- Passwords: Store only hashed passwords (bcrypt with at least 10 salt rounds).
- Sessions: Issue short-lived JWTs (e.g., 12h). Rotate `JWT_SECRET` if compromised.
- Role Checks: Enforce on every API route (admin/dispatcher vs driver).
- Status Validation: Only allow valid transitions through a central helper; never “set status” directly without checks.
- Least Privilege: Drivers can only read orders assigned to them.
- HTTPS: Terminate TLS at your reverse proxy (Caddy/Nginx) or hosting provider; never send credentials over plain HTTP.
- Logging: Avoid logging secrets or passwords. Log auth failures with minimal detail.
- Backups: Schedule Postgres backups. Verify restore process regularly.