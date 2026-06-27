import "dotenv/config";
import type { IncomingMessage, ServerResponse } from "http";
import { app, getAppReady } from "../backend/src/index";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    await getAppReady();
    app.server.emit("request", req, res);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: msg }));
  }
}
