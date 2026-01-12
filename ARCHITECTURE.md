# Ralph Architecture - Visual Flow

## The Stack (Bottom to Top)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  YOU (browser/phone/terminal)                              │
│                                                             │
│  https://ralph.workers.dev                                 │
│  or curl commands                                           │
│                                                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP requests
                         │
┌────────────────────────▼────────────────────────────────────┐
│                                                             │
│  CLOUDFLARE WORKER (index.ts)                              │
│                                                             │
│  Routes:                                                    │
│  • GET  /           → Web UI                               │
│  • POST /api/start  → Start ralph                          │
│  • POST /api/pause  → Pause ralph                          │
│  • POST /api/resume → Resume ralph                         │
│  • POST /api/steer  → Steer ralph                          │
│  • GET  /api/status → Get status                           │
│  • GET  /api/logs   → Get logs                             │
│  • GET  /api/remote → Get tmate URL                        │
│                                                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ env.RALPH.get('session-id')
                         │
┌────────────────────────▼────────────────────────────────────┐
│                                                             │
│  DURABLE OBJECT (ralph.ts)                                 │
│                                                             │
│  Lovely API:                                                │
│  • ralph.start(repo, prompt)                               │
│  • ralph.pause()                                            │
│  • ralph.resume()                                           │
│  • ralph.steer(command)                                     │
│  • ralph.status()                                           │
│  • ralph.logs()                                             │
│  • ralph.remote()                                           │
│                                                             │
│  Stores: session state, logs cache                         │
│                                                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP to container
                         │ env.CONTAINER.get(id).fetch()
                         │
┌────────────────────────▼────────────────────────────────────┐
│                                                             │
│  CLOUDFLARE CONTAINER (Docker)                             │
│                                                             │
│  HTTP API Server (server.js):                              │
│  • POST /start  → tmux new-session + opencode             │
│  • POST /pause  → tmux send-keys C-z                       │
│  • POST /resume → tmux send-keys fg                        │
│  • POST /exec   → tmux send-keys <command>                 │
│  • GET  /status → tmux has-session?                        │
│  • GET  /logs   → tmux capture-pane                        │
│  • GET  /tmate  → tmate session URL                        │
│                                                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ process management
                         │
┌────────────────────────▼────────────────────────────────────┐
│                                                             │
│  TMUX SESSION                                               │
│                                                             │
│  Running: opencode in /app/dcainsights                     │
│                                                             │
│  • git clone repo                                           │
│  • npm install                                              │
│  • opencode starts                                          │
│  • receives prompt                                          │
│  • works indefinitely                                       │
│  • can be paused/resumed                                    │
│  • can receive new commands                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow - Starting Ralph

```
1. Browser → POST /api/start { repo, prompt }
              ↓
2. Worker receives → calls ralph.start(repo, prompt)
              ↓
3. DO receives → calls container HTTP: POST /start
              ↓
4. Container receives → executes:
              ↓
   tmux new-session -d -s ralph "cd /app/dcainsights && opencode ."
              ↓
   tmux send-keys -t ralph "make a todo list..." Enter
              ↓
5. Opencode starts working
              ↓
6. Response bubbles back up:
   Container → DO → Worker → Browser
              ↓
7. Browser shows: "✅ started"
```

## Data Flow - Getting Logs

```
1. Browser → GET /api/logs
              ↓
2. Worker → ralph.logs()
              ↓
3. DO → GET /logs to container
              ↓
4. Container → tmux capture-pane -t ralph -p
              ↓
5. Tmux returns: last 1000 lines of output
              ↓
6. Bubbles back:
   Container → DO → Worker → Browser
              ↓
7. Browser displays logs in <pre> tag
```

## Data Flow - Steering

```
1. Browser → POST /api/steer { command: "focus on SEO" }
              ↓
2. Worker → ralph.steer(command)
              ↓
3. DO → POST /exec { command } to container
              ↓
4. Container → tmux send-keys -t ralph "focus on SEO" Enter
              ↓
5. Opencode receives command
              ↓
6. Changes direction mid-execution
              ↓
7. Response: "executed"
```

## Component Responsibilities

### Worker (index.ts)
- **Job**: Public HTTP interface
- **Knows**: Routes, request handling
- **Doesn't know**: Container details, tmux commands
- **Lines**: ~150

### Durable Object (ralph.ts)
- **Job**: Nice API + state management
- **Knows**: How to talk to container
- **Doesn't know**: HTTP routing, tmux internals
- **Lines**: ~50

### Container (server.js + Dockerfile)
- **Job**: Execute commands, manage tmux
- **Knows**: Tmux, opencode, git
- **Doesn't know**: Cloudflare APIs, routing
- **Lines**: ~100

### Tmux Session
- **Job**: Keep opencode running
- **Knows**: Process management
- **Doesn't know**: HTTP, APIs, Cloudflare
- **Lines**: Built-in tool

## Why This Architecture?

### Separation of Concerns
Each layer does ONE thing:
- Worker: HTTP routing
- DO: API translation
- Container: Process management
- Tmux: Session persistence

### Easy to Debug
Each layer has clear boundaries:
```bash
# Test container directly
docker run -p 3000:3000 ralph-opencode
curl localhost:3000/health

# Test DO in isolation
wrangler dev

# Test full stack
curl https://ralph.workers.dev/api/status
```

### Easy to Replace
Don't like tmux? Replace it:
- Container API stays same
- DO stays same
- Worker stays same

Only server.js changes.

### Narrow Surface Area
Only 21 API methods total:
- 7 container endpoints
- 7 DO methods
- 7 worker routes

Easy to understand, test, maintain.

## Cost Per Request

```
Browser Request
    ↓
Worker (free)
    ↓
DO (~$0.000001)
    ↓
Container ($0.02/hour when running)
```

Most expensive: Container CPU time
Cheapest: Everything else

## What Makes This Special

1. **Zero infrastructure** - No VMs, no K8s, no config
2. **Global edge** - Runs close to users
3. **Pay per second** - Container sleeps when idle
4. **Instant boot** - Container ready in <1s
5. **Remote access** - SSH from anywhere via tmate
6. **Lovely DX** - ralph.start(), ralph.pause()
7. **Ultra-minimal** - 300 lines total
8. **Production-ready** - Handles failures, restarts
9. **Type-safe** - Full TypeScript support
10. **Actually works** - Deploy today, make money tomorrow

## The Promise

Deploy once.
Let ralph work indefinitely.
Make money while sleeping.

That's it.
