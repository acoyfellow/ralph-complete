// Lovely API wrapper for ralph container
import { DurableObject } from "cloudflare:workers";
import type { RalphContainer } from "./container";

export class Ralph extends DurableObject<Env> {
  private id: string;
  
  constructor(state: DurableObjectState<Env>, env: Env) {
    super(state, env);
    this.id = state.id.toString();
  }
  
  // Start ralph on a repo with a prompt
  async start(repo: string, prompt: string) {
    return this.call('/start', { repo, prompt });
  }
  
  // Pause ralph (can resume later)
  async pause() {
    return this.call('/pause');
  }
  
  // Resume ralph
  async resume() {
    return this.call('/resume');
  }
  
  // Send command to ralph mid-execution
  async steer(command: string) {
    return this.call('/exec', { command });
  }
  
  // Check if ralph is running
  async status() {
    return this.call('/status');
  }
  
  // Get ralph's output
  async logs() {
    return this.call('/logs');
  }
  
  // Get tmate URL for remote terminal access
  async remote() {
    return this.call('/tmate');
  }
  
  // Internal: call container HTTP API
  private async call(path: string, body?: any) {
    const stub = this.env.CONTAINER.get(this.env.CONTAINER.idFromName(this.id));
    const res = await stub.fetch(
      new Request(`http://container${path}`, {
        method: body ? 'POST' : 'GET',
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : undefined
      })
    );
    return res.json();
  }
}

interface Env {
  CONTAINER: DurableObjectNamespace<RalphContainer>;
  RALPH: DurableObjectNamespace;
}
