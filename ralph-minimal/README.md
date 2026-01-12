# ralph - opencode agent runner

ultra-minimal cloudflare-native setup for running opencode agents indefinitely.

## what it does

- runs opencode in a cloudflare container
- gives you a web UI to control it
- pause/resume/steer from anywhere
- costs ~$15/month when running 24/7

## deploy

```bash
# 1. install deps
npm install

# 2. build docker image
npm run build

# 3. push to cloudflare
npm run push

# 4. deploy worker + DO + container
npm run deploy
```

done. your ralph is at `https://ralph.your-account.workers.dev`

## usage

**start ralph:**
```bash
curl https://ralph.your-account.workers.dev/api/start \
  -d '{"repo":"dcainsights","prompt":"make a todo list for SEO, ultrawork"}'
```

**pause:**
```bash
curl https://ralph.your-account.workers.dev/api/pause -X POST
```

**resume:**
```bash
curl https://ralph.your-account.workers.dev/api/resume -X POST
```

**steer:**
```bash
curl https://ralph.your-account.workers.dev/api/steer \
  -d '{"command":"focus on conversion rate optimization next"}'
```

**get logs:**
```bash
curl https://ralph.your-account.workers.dev/api/logs
```

**remote terminal access:**
```bash
curl https://ralph.your-account.workers.dev/api/remote
# gives you: ssh xyz@nyc1.tmate.io
# paste in terminal, access ralph from anywhere
```

## web UI

just visit `https://ralph.your-account.workers.dev` in browser.

click buttons, see logs, steer ralph.

## architecture

```
┌─────────────────┐
│  cloudflare     │
│  worker         │  ← you access this
└────────┬────────┘
         │
    ┌────▼──────┐
    │  Durable  │
    │  Object   │  ← ralph.start(), ralph.pause(), etc
    └────┬──────┘
         │
    ┌────▼──────────┐
    │  container    │
    │  - tmux       │
    │  - opencode   │  ← actually runs your repo
    │  - tmate      │
    └───────────────┘
```

## surface area

**container API (7 endpoints):**
- POST /start - start opencode on repo
- POST /pause - pause execution
- POST /resume - resume execution
- POST /exec - send command
- GET /status - check if running
- GET /logs - get output
- GET /tmate - get remote URL

**DO wrapper (7 methods):**
- ralph.start(repo, prompt)
- ralph.pause()
- ralph.resume()
- ralph.steer(command)
- ralph.status()
- ralph.logs()
- ralph.remote()

**worker (7 routes):**
- POST /api/start
- POST /api/pause
- POST /api/resume
- POST /api/steer
- GET /api/status
- GET /api/logs
- GET /api/remote

that's it. 21 total things to understand.

## cost

- container: $0.02/hour = ~$15/month if running 24/7
- DO: pennies
- worker: free tier

**total: ~$15-20/month**

## files

```
ralph-minimal/
├── Dockerfile          # container with tmux + opencode
├── server.js           # HTTP API inside container (100 lines)
├── src/
│   ├── index.ts       # worker + UI (150 lines)
│   └── ralph.ts       # DO wrapper (50 lines)
├── wrangler.jsonc     # cloudflare config
├── package.json
└── README.md
```

total: ~300 lines of code.

## dev loop

```bash
# run locally
npm run dev

# visit http://localhost:8787
```

## production

```bash
# deploy everything
npm run deploy

# ralph is live at:
# https://ralph.your-account.workers.dev
```

## remote access

ralph running but you want to see the terminal?

```bash
# get tmate URL
curl https://ralph.your-account.workers.dev/api/remote

# returns: ssh xyz@nyc1.tmate.io
# paste in terminal from anywhere (phone, laptop, etc)
# you're now inside ralph's tmux session
```

## making money

ralph's job: work on dcainsights to generate revenue.

**what ralph does:**
1. analyze traffic (google analytics)
2. expand top articles
3. add interactive calculators
4. write new SEO-optimized content
5. build monetization features
6. add affiliate links
7. optimize conversions

**you do:**
1. start ralph: `curl .../api/start`
2. check logs occasionally
3. steer if needed: "focus on exchange affiliate links"
4. let it run

ralph works 24/7. you make money while sleeping.

## troubleshooting

**container won't start:**
```bash
# check if image exists
wrangler containers list

# rebuild and push
npm run build && npm run push
```

**ralph stuck:**
```bash
# get status
curl .../api/status

# if running but not responsive
curl .../api/pause -X POST
curl .../api/resume -X POST
```

**need to debug:**
```bash
# get remote access
curl .../api/remote
# ssh into it
# poke around with tmux
```

## next steps

1. deploy this
2. point it at dcainsights
3. let it run for 24 hours
4. check what it built
5. iterate on the prompt
6. profit

---

**narrow surface area. lovely DX. actually works.**
