# Alerts Module

## Purpose
System alerts with severity levels and dismissal tracking.

## Exports

### Service (`lib/services/alert-service.ts`)
- `createAlert(userId, data)` — Create a new alert
- `getAlerts(userId, filters?)` — Fetch alerts with optional filters
- `dismissAlert(userId, id)` — Mark alert as dismissed
- `deleteAlert(userId, id)` — Delete an alert

### Hook (`hooks/useAlerts.ts`)
- `useAlerts()` — Manages alert state with realtime updates
  - Returns: `{ alerts, isLoading, error, dismissAlert, deleteAlert, filterSeverity, setFilterSeverity, filterDismissed, setFilterDismissed, undismissedCount }`

### Components (`components/alert/`)
- `AlertCard` — Single alert display with dismiss/delete
- `AlertList` — Filterable list of alerts
- `AlertBanner` — Horizontal banner for important alerts

### API Routes
- `GET /api/alerts` — Fetch alerts (severity, dismissed filters)
- `POST /api/alerts` — Create new alert
- `PATCH /api/alerts/[id]` — Dismiss alert
- `DELETE /api/alerts/[id]` — Delete alert

## Dependencies
- `modules/auth` — User session
- `modules/foundation` — AlmaAlert, AlertSeverity types

## Used By
- `/app/alerts` page
- App shell (alert banners)
- Home screen

## Database
Uses `alma_alerts` table with RLS. Maps `priority` field to `severity` and `read_at` to `is_dismissed`.

## Zone
YELLOW — Review required.
