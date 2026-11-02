import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import pg from "pg";

const { Pool } = pg;
const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 5000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const app = express();
const cookieName = "cca_crm_session";
const sessionHours = 12;

app.disable("x-powered-by");
app.use(express.json({ limit: "5mb" }));

function sign(value) {
  return crypto.createHmac("sha256", process.env.SESSION_SECRET).update(value).digest("base64url");
}

function validSession(req) {
  const token = req.headers.cookie?.split(";").map((v) => v.trim()).find((v) => v.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  if (!token) return false;
  const [payload, signature] = decodeURIComponent(token).split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString()).expires > Date.now();
  } catch {
    return false;
  }
}

function requireCrm(req, res, next) {
  if (!validSession(req)) return res.status(401).json({ error: "Sign in to access the CRM." });
  next();
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch {
    res.status(503).json({ ok: false, error: "CRM storage is unavailable." });
  }
});

app.get("/api/auth/session", (req, res) => res.json({ authenticated: validSession(req) }));

app.post("/api/auth/login", (req, res) => {
  const expected = process.env.CRM_ADMIN_PASSWORD;
  const secret = process.env.SESSION_SECRET;
  const supplied = typeof req.body?.password === "string" ? req.body.password : "";
  if (!expected || !secret) return res.status(503).json({ error: "CRM sign-in is not configured." });
  const a = crypto.createHash("sha256").update(supplied).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  if (!crypto.timingSafeEqual(a, b)) return res.status(401).json({ error: "That password did not match." });
  const payload = Buffer.from(JSON.stringify({ expires: Date.now() + sessionHours * 60 * 60 * 1000 })).toString("base64url");
  res.setHeader("Set-Cookie", `${cookieName}=${payload}.${sign(payload)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${sessionHours * 60 * 60}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
  res.json({ authenticated: true });
});

app.post("/api/auth/logout", (_req, res) => {
  res.setHeader("Set-Cookie", `${cookieName}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
  res.json({ authenticated: false });
});

// Public intake is write-only and idempotent; only the signed-in CRM can read or edit records.
app.post("/api/public/leads", async (req, res) => {
  const lead = req.body?.lead;
  if (!isRecord(lead) || typeof lead.id !== "string" || typeof lead.at !== "number") {
    return res.status(400).json({ error: "Invalid lead record." });
  }
  try {
    await pool.query(
      `INSERT INTO crm_leads (id, payload, created_at, updated_at)
       VALUES ($1, $2::jsonb, to_timestamp($3 / 1000.0), now())
       ON CONFLICT (id) DO NOTHING`,
      [lead.id, JSON.stringify(lead), lead.at],
    );
    res.status(201).json({ saved: true, id: lead.id });
  } catch {
    res.status(503).json({ error: "Lead could not be saved. Keep the request open and retry." });
  }
});

app.post("/api/public/events", async (req, res) => {
  const event = req.body?.event;
  if (!isRecord(event) || typeof event.id !== "string" || typeof event.at !== "number") {
    return res.status(400).json({ error: "Invalid event record." });
  }
  try {
    await pool.query(
      `INSERT INTO crm_events (id, payload, occurred_at)
       VALUES ($1, $2::jsonb, to_timestamp($3 / 1000.0))
       ON CONFLICT (id) DO NOTHING`,
      [event.id, JSON.stringify(event), event.at],
    );
    res.status(201).json({ saved: true, id: event.id });
  } catch {
    res.status(503).json({ error: "Activity could not be saved." });
  }
});

app.get("/api/crm", requireCrm, async (_req, res) => {
  try {
    const [leads, events] = await Promise.all([
      pool.query("SELECT payload FROM crm_leads WHERE archived_at IS NULL ORDER BY created_at DESC"),
      pool.query("SELECT payload FROM crm_events ORDER BY occurred_at DESC LIMIT 2000"),
    ]);
    res.json({ leads: leads.rows.map((r) => r.payload), events: events.rows.map((r) => r.payload), visitor: null });
  } catch {
    res.status(503).json({ error: "CRM data could not be loaded. Your local cache was not changed." });
  }
});

app.post("/api/crm/sync", requireCrm, async (req, res) => {
  const leads = Array.isArray(req.body?.leads) ? req.body.leads : [];
  const events = Array.isArray(req.body?.events) ? req.body.events : [];
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const lead of leads) {
      if (!isRecord(lead) || typeof lead.id !== "string" || typeof lead.at !== "number") continue;
      await client.query(
        `INSERT INTO crm_leads (id, payload, created_at, updated_at)
         VALUES ($1, $2::jsonb, to_timestamp($3 / 1000.0), now())
         ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now(), archived_at = NULL`,
        [lead.id, JSON.stringify(lead), lead.at],
      );
    }
    for (const event of events) {
      if (!isRecord(event) || typeof event.id !== "string" || typeof event.at !== "number") continue;
      await client.query(
        `INSERT INTO crm_events (id, payload, occurred_at)
         VALUES ($1, $2::jsonb, to_timestamp($3 / 1000.0))
         ON CONFLICT (id) DO NOTHING`,
        [event.id, JSON.stringify(event), event.at],
      );
    }
    await client.query("COMMIT");
    res.json({ saved: true, leads: leads.length, events: events.length });
  } catch {
    await client.query("ROLLBACK");
    res.status(503).json({ error: "CRM sync failed; local data was not removed." });
  } finally {
    client.release();
  }
});

app.post("/api/crm/import", requireCrm, async (req, res) => {
  const leads = Array.isArray(req.body?.leads) ? req.body.leads : [];
  const events = Array.isArray(req.body?.events) ? req.body.events : [];
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const lead of leads) {
      if (!isRecord(lead) || typeof lead.id !== "string" || typeof lead.at !== "number") continue;
      await client.query(
        `INSERT INTO crm_leads (id, payload, created_at, updated_at)
         VALUES ($1, $2::jsonb, to_timestamp($3 / 1000.0), now())
         ON CONFLICT (id) DO NOTHING`,
        [lead.id, JSON.stringify(lead), lead.at],
      );
    }
    for (const event of events) {
      if (!isRecord(event) || typeof event.id !== "string" || typeof event.at !== "number") continue;
      await client.query(
        `INSERT INTO crm_events (id, payload, occurred_at)
         VALUES ($1, $2::jsonb, to_timestamp($3 / 1000.0))
         ON CONFLICT (id) DO NOTHING`,
        [event.id, JSON.stringify(event), event.at],
      );
    }
    await client.query("COMMIT");
    res.json({ imported: { leads: leads.length, events: events.length } });
  } catch {
    await client.query("ROLLBACK");
    res.status(503).json({ error: "Import failed; no records were removed." });
  } finally {
    client.release();
  }
});

app.put("/api/crm/leads/:id", requireCrm, async (req, res) => {
  const lead = req.body?.lead;
  if (!isRecord(lead) || lead.id !== req.params.id || typeof lead.at !== "number") {
    return res.status(400).json({ error: "Invalid lead record." });
  }
  try {
    await pool.query(
      `INSERT INTO crm_leads (id, payload, created_at, updated_at)
       VALUES ($1, $2::jsonb, to_timestamp($3 / 1000.0), now())
       ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()`,
      [lead.id, JSON.stringify(lead), lead.at],
    );
    res.json({ saved: true });
  } catch {
    res.status(503).json({ error: "Change could not be saved to the CRM." });
  }
});

app.delete("/api/crm/leads/:id", requireCrm, async (req, res) => {
  try {
    await pool.query("UPDATE crm_leads SET archived_at = now() WHERE id = $1", [req.params.id]);
    res.json({ archived: true });
  } catch {
    res.status(503).json({ error: "Lead could not be archived." });
  }
});

// Protect every admin route except the password page, in both preview and production.
app.use((req, res, next) => {
  if (req.path === "/admin/login" || !req.path.startsWith("/admin")) return next();
  if (!validSession(req)) return res.redirect(`/admin/login?next=${encodeURIComponent(req.originalUrl)}`);
  next();
});

if (process.env.NODE_ENV === "production") {
  const publicDir = path.join(root, "dist/public");
  app.use(express.static(publicDir, { index: false }));
app.get("/{*splat}", (req, res) => {
    if (req.path.startsWith("/api/")) return res.status(404).json({ error: "Not found." });
    res.sendFile(path.join(publicDir, "index.html"));
  });
} else {
  const { createServer } = await import("vite");
  const vite = await createServer({ server: { middlewareMode: true, hmr: { server: undefined } }, appType: "spa" });
  app.use(vite.middlewares);
}

app.listen(port, "0.0.0.0", () => console.log(`Server listening on 0.0.0.0:${port}`));
