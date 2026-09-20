# Kapture CRM MCP server

A zero-dependency stdio MCP server that gives KapAble (or any MCP client)
tools backed by the Kapture CRM API.

Node only — no `pip`, no virtualenv, no `npm install`. That matters here:
KapAble passes the plugin's Env values to the child process as its **entire**
environment (`src/ipc/utils/mcp_manager.ts`), so a server that needs `PATH` to
find an interpreter is easy to break. Pointing `Command` at an absolute `node`
path avoids the problem outright.

## Connect it to KapAble

**Plugins → Add Plugin**

| Field | Value |
|---|---|
| Name | `Kapture CRM` |
| Transport | `stdio` |
| Command | absolute path to node, e.g. `/usr/local/bin/node` (find it with `which node`) |
| Args | absolute path to this file, e.g. `/Users/you/KapAble/tools/kapture-mcp/server.mjs` |
| Enabled | on |

Then open the plugin's detail page and add these under **Env**. The editors are
disabled until the plugin is Enabled, so switch it on first.

| Variable | Required | Value |
|---|---|---|
| `KAPTURE_BASE_URL` | one of these | `https://demokapairlines.kapturecrm.com` |
| `KAPTURE_SUBDOMAIN` | | `demokapairlines` — the host is derived |
| `KAPTURE_TOKEN` | yes* | Your API token. `Basic ` is prefixed if you omit a scheme. |
| `KAPTURE_SESSION_COOKIE` | * | `_KAPTURECRM_SESSION` value |
| `KAPTURE_JSESSIONID` | * | `JSESSIONID` value |
| `KAPTURE_JSESSIONRID` | * | `JSESSIONRID` value |

\* Supply **either** an API token **or** the session cookies. The published
API endpoints authenticate with `Authorization: Basic <token>`; the internal
console endpoints want browser session cookies. Setting both is fine — the
server sends whatever it has.

Session cookies expire. If tools start failing with an auth error, refresh
them from a logged-in browser session and update the Env values.

## Verify

Ask in a new chat:

> list my Kapture queues

You should see MCP tool-call cards and real data. If a tool reports a path is
not configured, that endpoint still needs filling in — see below.

You can also exercise it without KapAble:

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
  | KAPTURE_BASE_URL=https://your-tenant.kapturecrm.com KAPTURE_TOKEN=... node server.mjs
```

## Adding endpoints

`ENDPOINTS` at the top of `server.mjs` is the whole configuration surface. One
entry became one tool. `get_ticket_by_id` is filled in from Kapture's published
reference; the rest have empty `path` values for you to complete from your own
API docs.

An entry with an empty `path` is **skipped**, not advertised — so a half-filled
map never offers the model a tool that would 404. Fill them in one at a time
and re-run the verify step.

```js
pull_tickets_by_date_range: {
  description: "...",
  method: "POST",
  path: "/pull-ticket-by-date-range.html/v.2.0",   // ← from your docs
  params: { from_date: {...}, to_date: {...} },
  body: (a) => ({ fromDate: a.from_date, toDate: a.to_date }),
},
```

`body` maps tool arguments to the wire payload, so tool names can stay readable
while the request keeps whatever field names Kapture expects.

## `kapture_request`

There is a generic tool that takes a `path`, `method` and `body` and calls the
API directly. It keeps the server useful before `ENDPOINTS` is complete.

It is deliberately unconstrained: the model can reach any endpoint your
credentials allow, including writes. That is fine for a trusted internal tool
and wrong for anything broader. Once your named tools cover what you need,
delete it from `toolList()` and tighten the surface.

## Notes

- stdout carries the protocol. Diagnostics go to stderr — never `console.log`
  in this file or clients will see corrupt frames.
- Tool failures come back as results with `isError: true`, carrying Kapture's
  own error body, rather than JSON-RPC errors. The model can then read a `401`
  differently from a `404` and correct itself.
- The process drains in-flight requests before exiting on stdin EOF. Without
  that, a piped stdin ends the process while a tool call is still awaiting its
  HTTP response.
