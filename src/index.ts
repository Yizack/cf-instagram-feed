import { IttyRouter } from "itty-router";
import InstagramFeed from "./InstagramFeed";

const router = IttyRouter();

class JsonResponse extends Response {
  constructor (body: Record<string, any>) {
    const jsonBody = JSON.stringify(body);
    const options = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "s-maxage=86400"
      }
    };
    super(jsonBody, options);
  }
}

router.get("/", async (req, { ctx, API, cacheManager }: RouterContext) => {
  const { cache, cacheKey } = cacheManager;
  const data = await API.getFeed();
  let response = new JsonResponse({ data });
  if (data) {
    console.info("Stored in cache!");
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
  }
  return response;
});

router.all("*", () => new Response("Not Found.", { status: 404 }));

export default {
  async fetch (req, env, ctx) {
    const cacheUrl = new URL(req.url);
    const cacheKey = new Request(cacheUrl.toString(), req);
    const cache = caches.default;
    const cacheManager = { cache, cacheKey };
    const response = await cache.match(cacheKey);

    if (response) {
      console.info("Found in cache!");
      return response;
    }

    const API = new InstagramFeed(env.ACCESS_TOKEN);
    await API.refreshAccessToken();
    return router.fetch(req, { ctx, API, cacheManager });
  }
} satisfies FetchHandler;
