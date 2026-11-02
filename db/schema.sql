CREATE TABLE IF NOT EXISTS crm_leads (
  id text PRIMARY KEY,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz
);

CREATE INDEX IF NOT EXISTS crm_leads_created_at_idx
  ON crm_leads (created_at DESC);

CREATE TABLE IF NOT EXISTS crm_events (
  id text PRIMARY KEY,
  payload jsonb NOT NULL,
  occurred_at timestamptz NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS crm_events_occurred_at_idx
  ON crm_events (occurred_at DESC);
