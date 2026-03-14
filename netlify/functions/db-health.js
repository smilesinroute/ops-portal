// Netlify Function: db-health (Ops portal)
// Live DB check using a remote Postgres URL with sslmode=require
// Requires env var DATABASE_URL to be set in the Netlify site settings.

const { Client } = require("pg");

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders() };
  }
  if (event.httpMethod !== "GET") {
    return json(405, { status: "error", message: "Method Not Allowed" });
  }

  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    return json(500, {
      status: "error",
      message:
        "Missing DATABASE_URL env var. Set it in Netlify Site Settings → Environment variables.",
    });
  }

  const client = new Client({ connectionString: DATABASE_URL });
  try {
    const start = Date.now();
    await client.connect();
    const result = await client.query("SELECT NOW() AS now");
    await client.end();
    const ms = Date.now() - start;

    return json(200, {
      status: "ok",
      time: result?.rows?.[0]?.now,
      latency_ms: ms,
    });
  } catch (err) {
    return json(500, {
      status: "error",
      message: sanitize(err),
    });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      ...corsHeaders(),
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,OPTIONS",
    "access-control-allow-headers": "Content-Type,Authorization",
  };
}

function sanitize(err) {
  const msg = err && (err.message || String(err));
  return msg && msg.replace(/postgresql?:\/\/[^@]+@/gi, "postgres://<redacted>@");
}