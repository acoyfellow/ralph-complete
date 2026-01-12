import { Container } from "@cloudflare/containers";

export class RalphContainer extends Container {
  defaultPort = 3000;
  
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }
  
  async fetch(request: Request): Promise<Response> {
    // Forward requests to the container's HTTP server
    return super.fetch(request);
  }
}

interface Env {
  // Container environment
}
