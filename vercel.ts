import type { VercelConfig } from "@vercel/config/v1"

export const config: VercelConfig = {
  crons: [
    // Daily reminders at 10h BRT (13:00 UTC)
    { path: "/api/cron/reminders", schedule: "0 13 * * *" },
    // Weekly stock alerts on Monday at 8h BRT (11:00 UTC)
    { path: "/api/cron/stock-alerts", schedule: "0 11 * * 1" },
  ],
}
