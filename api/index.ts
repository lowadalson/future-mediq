import "dotenv/config";
import { app, appReady } from "../backend/src/index";
import type { IncomingMessage, ServerResponse } from "http";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await appReady;
  app.server.emit("request", req, res);
}
