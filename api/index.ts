import "dotenv/config";
import type { IncomingMessage, ServerResponse } from "http";

let initError: Error | null = null;

const { app, appReady } = (() => {
  try {
    return require("../backend/src/index");
  } catch (e) {
    initError = e as Error;
    return { app: null, appReady: Promise.reject(e) };
  }
})();

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (initError) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: initError.message }));
    return;
  }
  try {
    await appReady;
    app.server.emit("request", req, res);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: msg }));
  }
}
