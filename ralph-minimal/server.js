const http = require('http');
const { exec } = require('child_process');

const run = (cmd) => new Promise((resolve, reject) => {
  exec(cmd, (error, stdout, stderr) => {
    if (error) reject(error);
    else resolve(stdout.trim());
  });
});

http.createServer(async (req, res) => {
  const send = (data) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };
  
  try {
    // Start opencode
    if (req.url === '/start' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        const { repo, prompt } = JSON.parse(body);
        
        // Clone repo if not exists
        await run(`[ -d /app/${repo} ] || git clone https://github.com/acoyfellow/${repo}.git /app/${repo}`);
        
        // Start tmux with opencode
        await run(`tmux new-session -d -s ralph "cd /app/${repo} && opencode ."`);
        await run(`sleep 1 && tmux send-keys -t ralph "${prompt}" Enter`);
        
        send({ status: 'started' });
      });
      return;
    }
    
    // Pause (send Ctrl-Z to tmux)
    if (req.url === '/pause' && req.method === 'POST') {
      await run('tmux send-keys -t ralph C-z');
      send({ status: 'paused' });
      return;
    }
    
    // Resume (fg command)
    if (req.url === '/resume' && req.method === 'POST') {
      await run('tmux send-keys -t ralph "fg" Enter');
      send({ status: 'resumed' });
      return;
    }
    
    // Execute command
    if (req.url === '/exec' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        const { command } = JSON.parse(body);
        await run(`tmux send-keys -t ralph "${command}" Enter`);
        send({ status: 'executed' });
      });
      return;
    }
    
    // Status
    if (req.url === '/status' && req.method === 'GET') {
      try {
        await run('tmux has-session -t ralph');
        send({ running: true });
      } catch {
        send({ running: false });
      }
      return;
    }
    
    // Logs (tmux pane contents)
    if (req.url === '/logs' && req.method === 'GET') {
      const logs = await run('tmux capture-pane -t ralph -p -S -1000');
      send({ logs });
      return;
    }
    
    // Tmate URL for remote access
    if (req.url === '/tmate' && req.method === 'GET') {
      await run('tmate -S /tmp/tmate.sock new-session -d -s ralph-remote');
      await run('tmate -S /tmp/tmate.sock wait tmate-ready');
      const url = await run('tmate -S /tmp/tmate.sock display -p "#{tmate_ssh}"');
      send({ url });
      return;
    }
    
    // Health check
    if (req.url === '/health') {
      send({ ok: true });
      return;
    }
    
    res.writeHead(404);
    res.end();
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
}).listen(3000, () => console.log('Ready'));
