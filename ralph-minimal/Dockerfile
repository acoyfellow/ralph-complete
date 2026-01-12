FROM node:20-slim

# Minimal deps: tmux + tmate + curl
RUN apt-get update && apt-get install -y tmux tmate git curl && rm -rf /var/lib/apt/lists/*

# Install opencode binary
RUN curl -fsSL https://opencode.ai/install | bash

# Minimal control server (no express, pure node http)
WORKDIR /app
COPY server.js .

EXPOSE 3000
CMD ["node", "server.js"]
