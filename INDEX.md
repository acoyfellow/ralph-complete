# Ralph - Ultra-Minimal Opencode Agent Runner

**Complete implementation. Deploy in 5 minutes. ~$15/month. 300 lines of code.**

---

## 📚 Documentation

### Start Here
- **[QUICK_START.md](QUICK_START.md)** - Copy/paste commands to deploy now
- **[RALPH_SUMMARY.md](RALPH_SUMMARY.md)** - Complete overview, API docs, cost breakdown

### Go Deeper
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Visual diagrams, data flows, design decisions
- **[ralph-minimal/README.md](ralph-minimal/README.md)** - Full technical documentation

---

## 🚀 Quick Deploy

```bash
cd ralph-minimal
npm install
./deploy.sh
```

Your ralph is live at `https://ralph.your-account.workers.dev`

---

## 📦 What's Inside

### `/ralph-minimal/` - Complete implementation
```
ralph-minimal/
├── Dockerfile          # Container: tmux + opencode
├── server.js           # HTTP API (100 lines, zero deps)
├── src/
│   ├── index.ts       # Worker + Web UI (150 lines)
│   └── ralph.ts       # Durable Object wrapper (50 lines)
├── wrangler.jsonc     # Cloudflare config
├── package.json       # Dependencies
├── tsconfig.json      # TypeScript config
└── deploy.sh          # One-command deploy
```

**Total: ~300 lines of actual code**

---

## 🎯 What It Does

Ralph runs opencode indefinitely on your repos to make you money.

### Features
- ✅ Start/pause/resume from anywhere
- ✅ Steer mid-execution
- ✅ Live logs auto-refresh
- ✅ Remote terminal access (tmate)
- ✅ Web UI + API
- ✅ Mobile-friendly
- ✅ ~$15/month when running 24/7
- ✅ Zero infrastructure to manage

### Example: dcainsights
```bash
# Start ralph
curl https://ralph.workers.dev/api/start -d '{
  "repo": "dcainsights",
  "prompt": "analyze traffic, write SEO content, add calculators, build affiliate links, optimize conversions, ultrawork"
}'

# Let it run for 24 hours

# Check what it built
curl https://ralph.workers.dev/api/logs
```

Ralph works while you sleep. You make money.

---

## 🏗️ Architecture

```
Browser/Phone
    ↓
Cloudflare Worker (routing + UI)
    ↓
Durable Object (lovely API)
    ↓
Container (tmux + opencode)
    ↓
Your repo (dcainsights, etc)
```

**Narrow surface area:** 21 total API methods
**Lovely DX:** `ralph.start()`, `ralph.pause()`, etc
**Actually works:** Deploy today, runs indefinitely

---

## 💰 Cost

- **Running 24/7:** ~$15/month
- **Running 8hr/day:** ~$5/month  
- **Only when working:** ~$1-2/month

Container sleeps when idle. Pay per second.

---

## 📱 Control from Anywhere

### Web UI
Visit `https://ralph.workers.dev`

- Start/pause/resume buttons
- Live logs (auto-refresh every 5s)
- Steer input
- Status indicator
- Remote terminal access

### API
```bash
curl https://ralph.workers.dev/api/start
curl https://ralph.workers.dev/api/pause
curl https://ralph.workers.dev/api/resume
curl https://ralph.workers.dev/api/steer
curl https://ralph.workers.dev/api/logs
curl https://ralph.workers.dev/api/remote
```

### Phone
Save bookmark: `https://ralph.workers.dev`

Control ralph from anywhere.

---

## 🛠️ Surface Area

### Container HTTP API (7 endpoints)
1. POST /start
2. POST /pause
3. POST /resume
4. POST /exec
5. GET /status
6. GET /logs
7. GET /tmate

### DO Methods (7 methods)
1. ralph.start(repo, prompt)
2. ralph.pause()
3. ralph.resume()
4. ralph.steer(command)
5. ralph.status()
6. ralph.logs()
7. ralph.remote()

### Worker Routes (7 routes)
1. POST /api/start
2. POST /api/pause
3. POST /api/resume
4. POST /api/steer
5. GET /api/status
6. GET /api/logs
7. GET /api/remote

**Total: 21 things to understand**

---

## 🎨 Design Principles

1. **Ultra-minimal** - 300 lines total
2. **Narrow surface** - 21 API methods
3. **Lovely DX** - Beautiful, type-safe API
4. **Zero infrastructure** - No servers, VMs, K8s
5. **Actually deployable** - Works right now
6. **Production-ready** - Handles failures, restarts
7. **Cost-effective** - ~$5-20/month
8. **Remote access** - SSH from anywhere
9. **Mobile-friendly** - Control from phone
10. **Make money** - That's the whole point

---

## 🚀 Next Steps

1. Read [QUICK_START.md](QUICK_START.md)
2. Deploy: `./deploy.sh`
3. Start ralph on dcainsights
4. Let it run for 24 hours
5. Check what it built
6. Iterate on prompt
7. Make money while sleeping

---

## 📞 Support

Everything you need is in the docs:
- [QUICK_START.md](QUICK_START.md) - Get started now
- [RALPH_SUMMARY.md](RALPH_SUMMARY.md) - Complete reference
- [ARCHITECTURE.md](ARCHITECTURE.md) - How it works

---

## ✨ The Promise

**Deploy once. Let ralph work indefinitely. Make money while sleeping.**

That's it.

---

Built with ❤️ for making money, not open source glory.
