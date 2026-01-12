# QUICK START - Get Ralph Running in 5 Minutes

## Prerequisites
- Docker installed
- Cloudflare account
- Wrangler CLI: `npm install -g wrangler`
- Logged into Cloudflare: `wrangler login`

## Deploy (copy/paste these commands)

```bash
# 1. Install dependencies
cd ralph-minimal
npm install

# 2. Deploy everything
./deploy.sh
```

That's it. Ralph is live.

## Test It

```bash
# Get your worker URL
wrangler deployments list

# Start ralph (replace YOUR-WORKER-URL)
curl https://YOUR-WORKER-URL/api/start \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "dcainsights",
    "prompt": "make a todo list for SEO optimization, ultrawork"
  }'

# Check status (wait 30 seconds first)
curl https://YOUR-WORKER-URL/api/status

# Get logs
curl https://YOUR-WORKER-URL/api/logs
```

## Open Web UI

Visit `https://YOUR-WORKER-URL` in browser.

Click "start", watch logs auto-refresh.

## Control from Phone

Save this bookmark:
`https://YOUR-WORKER-URL`

Now you can:
- Start/pause ralph from anywhere
- Steer it mid-execution
- Check logs in real-time
- Get remote terminal access

## Make Money

Ralph is now working on dcainsights 24/7:
- Analyzing traffic
- Writing SEO content
- Adding calculators
- Building affiliate links
- Optimizing conversions

You just:
- Check logs occasionally
- Steer if needed
- Collect revenue

## Troubleshooting

**Container won't start:**
```bash
# Check container pushed
wrangler containers list

# If not there, rebuild
docker build -t ralph-opencode .
wrangler containers push ralph-opencode
wrangler deploy
```

**Need to debug:**
```bash
# Get remote access
curl https://YOUR-WORKER-URL/api/remote

# Copy the ssh command
# Paste in terminal
# You're inside ralph's tmux session
```

**Ralph stuck:**
```bash
# Pause and resume
curl https://YOUR-WORKER-URL/api/pause -X POST
sleep 5
curl https://YOUR-WORKER-URL/api/resume -X POST
```

## Cost

Running 24/7: ~$15/month
Running 8hr/day: ~$5/month
Only when working: ~$1-2/month

## Next

Let ralph run for 24 hours.

Check what it built:
```bash
curl https://YOUR-WORKER-URL/api/logs
```

Visit dcainsights.com - see new content, tools, optimizations.

Iterate on the prompt if needed:
```bash
curl https://YOUR-WORKER-URL/api/steer \
  -d '{"command": "focus on exchange affiliate links with high commissions"}'
```

## That's It

Ultra-minimal. Lovely DX. Actually works.

Deploy once. Make money forever.
