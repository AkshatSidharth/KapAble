#!/usr/bin/env node
/**
 * Kapture CRM MCP server — stdio transport, zero dependencies.
 *
 * Speaks MCP over newline-delimited JSON-RPC on stdin/stdout, so it runs
 * under any MCP client (KapAble's Plugins page, Claude Desktop, etc.) with
 * nothing to install beyond Node itself.
 *
 * Configure with environment variables:
 *
 *   KAPTURE_BASE_URL   Full base, e.g. https://demokapairlines.kapturecrm.com
 *                      (or set KAPTURE_SUBDOMAIN and the host is derived)
 *   KAPTURE_SUBDOMAIN  Subdomain only, e.g. demokapairlines
 *   KAPTURE_TOKEN      Value for the Authorization header. "Basic " is added
 *                      if you don't include a scheme yourself.
 *
 * Optional, for endpoints that want browser session cookies rather than the
 * API token (the internal console APIs do):
 *
 *   KAPTURE_SESSION_COOKIE   _KAPTURECRM_SESSION value
 *   KAPTURE_JSESSIONID       JSESSIONID value
 *   KAPTURE_JSESSIONRID      JSESSIONRID value
 *
 * IMPORTANT: stdout is the protocol channel. Never console.log here — every
 * diagnostic goes to stderr, or the client sees corrupt frames.
 */

const PROTOCOL_VERSION = "2025-06-18";
const SERVER_INFO = { name: "kapture-crm", version: "0.1.0" };

// ---------------------------------------------------------------------------
// Endpoint map
// ---------------------------------------------------------------------------
// Each entry becomes an MCP tool. `get_ticket_by_id` is filled in from
// Kapture's published reference; add the rest from your own API docs
// (dev.kapture.cx → API Reference) by pasting the path exactly as documented.
//
// Until an entry has a `path`, it is skipped rather than exposed as a tool
// that would 404 — so you can add them one at a time and re-test.

const ENDPOINTS = {
  get_ticket_by_id: {
    description:
      "Fetch a single Kapture ticket by its ticket id. Returns the full ticket record.",
    method: "POST",
    path: "/search-ticket-by-ticket-id.html/v.2.0",
    params: {
      ticket_id: { type: "string", description: "Kapture ticket id", required: true },
    },
    // Maps tool args -> request body. Keep the wire names the API expects.
    body: (a) => ({ ticketId: a.ticket_id }),
  },

  // --- fill these in from your API reference ------------------------------
  add_ticket: {
    description: "Create a new ticket in Kapture from an external source.",
    method: "POST",
    path: "", // e.g. "/add-ticket.html/v.2.0"
    params: {
      payload: { type: "object", description: "Ticket fields to create", required: true },
    },
    body: (a) => a.payload,
  },

  update_ticket: {
    description: "Update an existing Kapture ticket.",
    method: "POST",
    path: "", // e.g. "/update-ticket.html/v.2.0"
    params: {
      payload: { type: "object", description: "Ticket fields to update", required: true },
    },
    body: (a) => a.payload,
  },

  pull_tickets_by_date_range: {
    description:
      "List tickets created within a date range. Use this to populate queue and SLA views.",
    method: "POST",
    path: "", // e.g. "/pull-ticket-by-date-range.html/v.2.0"
    params: {
      from_date: { type: "string", description: "Start date", required: true },
      to_date: { type: "string", description: "End date", required: true },
    },
    body: (a) => ({ fromDate: a.from_date, toDate: a.to_date }),
  },

  get_customer: {
    description: "Fetch a customer record by identifier.",
    method: "POST",
    path: "", // e.g. "/get-customer.html/v.2.0"
    params: {
      customer_id: { type: "string", description: "Customer identifier", required: true },
    },
    body: (a) => ({ customerId: a.customer_id }),
  },
};

// ---------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------

function baseUrl() {
  const explicit = (process.env.KAPTURE_BASE_URL || "").trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const sub = (process.env.KAPTURE_SUBDOMAIN || "").trim();
  if (sub) return `https://${sub}.kapturecrm.com`;
  throw new Error(
    "Set KAPTURE_BASE_URL (or KAPTURE_SUBDOMAIN) in the plugin's Env settings.",
  );
}

function authHeaders() {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };

  const token = (process.env.KAPTURE_TOKEN || "").trim();
  if (token) {
    // The docs show `Authorization: Basic <Your Token>` where the token is
    // already encoded, so pass it through rather than re-encoding it.
    headers.Authorization = /^(Basic|Bearer)\s/i.test(token) ? token : `Basic ${token}`;
  }

  const cookies = [
    ["_KAPTURECRM_SESSION", process.env.KAPTURE_SESSION_COOKIE],
    ["JSESSIONID", process.env.KAPTURE_JSESSIONID],
    ["JSESSIONRID", process.env.KAPTURE_JSESSIONRID],
  ]
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `${k}=${String(v).trim()}`);
  if (cookies.length) headers.Cookie = cookies.join("; ");

  if (!token && !cookies.length) {
    throw new Error(
      "No credentials. Set KAPTURE_TOKEN, or the session cookie variables, in the plugin's Env settings.",
    );
  }
  return headers;
}

async function callKapture(method, path, body) {
  const url = `${baseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const init = { method, headers: authHeaders() };
  if (body !== undefined && method !== "GET") init.body = JSON.stringify(body);

  const res = await fetch(url, init);
  const text = await res.text();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = text;
  }

  if (!res.ok) {
    // Surface Kapture's own error body — an expired token reads very
    // differently from a wrong path, and the agent can act on the difference.
    throw new Error(
      `Kapture ${method} ${path} failed: HTTP ${res.status}. ` +
        (typeof parsed === "string" ? parsed.slice(0, 500) : JSON.stringify(parsed).slice(0, 500)),
    );
  }
  return parsed;
}

// ---------------------------------------------------------------------------
// Tool definitions
// ---------------------------------------------------------------------------

function schemaFor(params) {
  const properties = {};
  const required = [];
  for (const [name, spec] of Object.entries(params || {})) {
    properties[name] = { type: spec.type, description: spec.description };
    if (spec.required) required.push(name);
  }
  return { type: "object", properties, required };
}

function toolList() {
  const tools = [];

  for (const [name, def] of Object.entries(ENDPOINTS)) {
    if (!def.path) continue; // not configured yet — don't advertise a 404
    tools.push({
      name,
      description: def.description,
      inputSchema: schemaFor(def.params),
    });
  }

  // Escape hatch: lets the agent reach any documented endpoint before every
  // entry above has been filled in. Remove it once the map is complete if you
  // would rather constrain the surface.
  tools.push({
    name: "kapture_request",
    description:
      "Call any Kapture API endpoint directly. Use when no specific tool covers " +
      "the operation. Provide the documented path, e.g. /search-ticket-by-ticket-id.html/v.2.0",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string", description: "Endpoint path, leading slash included" },
        method: { type: "string", description: "HTTP method, defaults to POST" },
        body: { type: "object", description: "JSON request body" },
      },
      required: ["path"],
    },
  });

  return tools;
}

async function dispatch(name, args) {
  if (name === "kapture_request") {
    return callKapture((args.method || "POST").toUpperCase(), args.path, args.body);
  }
  const def = ENDPOINTS[name];
  if (!def) throw new Error(`Unknown tool: ${name}`);
  if (!def.path) {
    throw new Error(
      `Tool "${name}" has no path configured. Add it to ENDPOINTS in server.mjs from your Kapture API reference.`,
    );
  }
  return callKapture(def.method, def.path, def.body ? def.body(args) : undefined);
}

// ---------------------------------------------------------------------------
// JSON-RPC over stdio
// ---------------------------------------------------------------------------

function write(msg) {
  process.stdout.write(JSON.stringify(msg) + "\n");
}

function reply(id, result) {
  write({ jsonrpc: "2.0", id, result });
}

function replyError(id, code, message) {
  write({ jsonrpc: "2.0", id, error: { code, message } });
}

async function handle(msg) {
  const { id, method, params } = msg;

  // Notifications have no id and take no response.
  if (id === undefined || id === null) return;

  try {
    switch (method) {
      case "initialize":
        return reply(id, {
          // Echo the client's version when it names one, so we don't force a
          // downgrade on a newer client.
          protocolVersion: params?.protocolVersion || PROTOCOL_VERSION,
          capabilities: { tools: {} },
          serverInfo: SERVER_INFO,
        });

      case "ping":
        return reply(id, {});

      case "tools/list":
        return reply(id, { tools: toolList() });

      case "tools/call": {
        const toolName = params?.name;
        const args = params?.arguments || {};
        try {
          const result = await dispatch(toolName, args);
          return reply(id, {
            content: [
              { type: "text", text: typeof result === "string" ? result : JSON.stringify(result, null, 2) },
            ],
          });
        } catch (err) {
          // Tool failures are results, not protocol errors — the model needs
          // to read the message and correct itself.
          return reply(id, {
            content: [{ type: "text", text: String(err && err.message ? err.message : err) }],
            isError: true,
          });
        }
      }

      default:
        return replyError(id, -32601, `Method not found: ${method}`);
    }
  } catch (err) {
    return replyError(id, -32603, String(err && err.message ? err.message : err));
  }
}

let buffer = "";

// Requests are handled asynchronously, so EOF must not terminate the process
// while a tool call is still awaiting its HTTP response. A live client holds
// stdin open, but a piped or file stdin hits EOF immediately — exiting there
// drops the reply that is still in flight.
const inFlight = new Set();

function track(promise) {
  inFlight.add(promise);
  promise.finally(() => inFlight.delete(promise));
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  let newline;
  while ((newline = buffer.indexOf("\n")) !== -1) {
    const line = buffer.slice(0, newline).trim();
    buffer = buffer.slice(newline + 1);
    if (!line) continue;
    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      process.stderr.write(`kapture-mcp: could not parse frame: ${line.slice(0, 200)}\n`);
      continue;
    }
    track(handle(msg));
  }
});

process.stdin.on("end", async () => {
  // Drain repeatedly: a settling handler can itself queue more work.
  while (inFlight.size) await Promise.allSettled([...inFlight]);
  process.exit(0);
});
process.stderr.write("kapture-mcp: ready on stdio\n");
