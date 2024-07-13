import { toWebHandler } from "h3";
import { app } from "../.routes";

const handler = toWebHandler(app);

export default {
  async fetch (request, env, context) {
    return handler(request, {
      cloudflare: { request, env, context }
    });
  }
} satisfies FetchHandler;
