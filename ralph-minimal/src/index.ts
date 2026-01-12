import { Ralph } from './ralph';
import { RalphContainer } from './container';

export { Ralph, RalphContainer };

interface Env {
  RALPH: DurableObjectNamespace<Ralph>;
  CONTAINER: DurableObjectNamespace<RalphContainer>;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const ralph = env.RALPH.get(env.RALPH.idFromName('dcainsights'));
    
    // API endpoints
    if (url.pathname.startsWith('/api/')) {
      const action = url.pathname.slice(5);
      
      if (action === 'start') {
        const body = await req.json() as { repo: string; prompt: string };
        return Response.json(await ralph.start(body.repo, body.prompt));
      }
      
      if (action === 'pause') {
        return Response.json(await ralph.pause());
      }
      
      if (action === 'resume') {
        return Response.json(await ralph.resume());
      }
      
      if (action === 'steer') {
        const body = await req.json() as { command: string };
        return Response.json(await ralph.steer(body.command));
      }
      
      if (action === 'status') {
        return Response.json(await ralph.status());
      }
      
      if (action === 'logs') {
        return Response.json(await ralph.logs());
      }
      
      if (action === 'remote') {
        return Response.json(await ralph.remote());
      }
    }
    
    // Control panel UI
    return new Response(HTML, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
};

const HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>ralph</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white p-8 font-mono">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl mb-8">ralph</h1>
    
    <!-- Controls -->
    <div class="space-y-4 mb-8">
      <div class="flex gap-2">
        <input 
          id="repo" 
          value="dcainsights"
          class="flex-1 px-4 py-2 bg-gray-800 rounded border border-gray-700"
          placeholder="repo name"
        />
        <button onclick="start()" class="px-6 py-2 bg-green-600 rounded hover:bg-green-700">
          start
        </button>
      </div>
      
      <textarea 
        id="prompt"
        class="w-full px-4 py-2 bg-gray-800 rounded border border-gray-700 h-24"
        placeholder="initial prompt for opencode"
      >make a todo list for dcainsights revenue growth, ultrawork</textarea>
      
      <div class="flex gap-2">
        <button onclick="pause()" class="px-6 py-2 bg-yellow-600 rounded hover:bg-yellow-700">
          pause
        </button>
        <button onclick="resume()" class="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700">
          resume
        </button>
        <button onclick="refreshStatus()" class="px-6 py-2 bg-gray-600 rounded hover:bg-gray-700">
          refresh
        </button>
      </div>
      
      <div class="flex gap-2">
        <input 
          id="steer" 
          class="flex-1 px-4 py-2 bg-gray-800 rounded border border-gray-700"
          placeholder="steer ralph: 'focus on SEO next'"
        />
        <button onclick="steer()" class="px-6 py-2 bg-purple-600 rounded hover:bg-purple-700">
          steer
        </button>
      </div>
    </div>
    
    <!-- Status -->
    <div class="mb-4 p-4 bg-gray-800 rounded">
      <div class="text-sm text-gray-400 mb-1">status</div>
      <div id="status" class="text-lg">unknown</div>
    </div>
    
    <!-- Remote access -->
    <div class="mb-4 p-4 bg-gray-800 rounded">
      <div class="text-sm text-gray-400 mb-1">remote terminal</div>
      <div id="remote" class="text-sm">
        <button onclick="getRemote()" class="text-blue-400 hover:underline">
          get tmate URL
        </button>
      </div>
    </div>
    
    <!-- Logs -->
    <div class="bg-gray-800 rounded p-4">
      <div class="text-sm text-gray-400 mb-2">logs</div>
      <pre id="logs" class="text-xs text-gray-300 h-96 overflow-y-auto whitespace-pre-wrap"></pre>
    </div>
  </div>
  
  <script>
    const api = async (path, body) => {
      const res = await fetch('/api/' + path, {
        method: body ? 'POST' : 'GET',
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : undefined
      });
      return res.json();
    };
    
    async function start() {
      const repo = document.getElementById('repo').value;
      const prompt = document.getElementById('prompt').value;
      await api('start', { repo, prompt });
      setTimeout(refreshStatus, 1000);
    }
    
    async function pause() {
      await api('pause');
      refreshStatus();
    }
    
    async function resume() {
      await api('resume');
      refreshStatus();
    }
    
    async function steer() {
      const command = document.getElementById('steer').value;
      await api('steer', { command });
      document.getElementById('steer').value = '';
      refreshStatus();
    }
    
    async function refreshStatus() {
      const [status, logs] = await Promise.all([
        api('status'),
        api('logs')
      ]);
      
      document.getElementById('status').textContent = 
        status.running ? '🟢 running' : '🔴 stopped';
      
      document.getElementById('logs').textContent = logs.logs || 'no logs yet';
    }
    
    async function getRemote() {
      const { url } = await api('remote');
      document.getElementById('remote').innerHTML = 
        \`<code class="text-green-400">\${url}</code>
        <div class="text-xs text-gray-400 mt-1">paste this in your terminal to connect</div>\`;
    }
    
    // Auto-refresh every 5 seconds
    setInterval(refreshStatus, 5000);
    refreshStatus();
  </script>
</body>
</html>`;
