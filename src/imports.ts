import { defineEventHandler, type H3Event } from "h3";

export const defineCachedEventHandler = (
  eventHandler: (event: H3Event) => Promise<any>,
  options?: { maxAge?: number, staleMaxAge?: number }
) => {
  return defineEventHandler(async (event: H3Event) => {
    const req = event.context.cloudflare.request;
    const cacheKey = new Request(req.url, req);
    const cache = caches.default;
    const cachedResponse = await cache.match(cacheKey);

    if (cachedResponse) {
      console.info("Found in cache!");
      return cachedResponse;
    }

    const output = await eventHandler(event);
    const cacheControl = options?.maxAge ? `max-age=${options?.maxAge}` : options?.staleMaxAge ? `s-maxage=${options?.staleMaxAge}` : "max-age=0";
    const outputResponse = new Response(JSON.stringify(output), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Cache-Control": cacheControl
      }
    });

    if (output) {
      console.info("Stored in cache!");
      event.context.cloudflare.context.waitUntil(cache.put(cacheKey, outputResponse.clone()));
    }
    return outputResponse;
  });
};
