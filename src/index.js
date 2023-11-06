import { Router } from "itty-router";
import InstagramFeed from "./InstagramFeed.js";

const router = Router();

class JsonResponse extends Response {
  constructor(body) {
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

router.get("/", async (req, { ctx, API, cacheManager }) => {
  const { cache, cacheKey } = cacheManager;
  const { data } = await API.getFeed();
  let response = new JsonResponse({data});
  if (data) {
    console.log("Stored in cache!");
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
  }
  return response;
});

router.all("*", () => new Response("Not Found.", { status: 404 }));

export default {
  async fetch(req, env, ctx) {
    const cacheUrl = new URL(req.url);
    const cacheKey = new Request(cacheUrl.toString(), req);
    const cache = caches.default;
    const cacheManager = { cache, cacheKey };
    const response = await cache.match(cacheKey);

    if (response) {
      console.log("Found in cache!");
      return response;
    }

    const API = new InstagramFeed(env.ACCESS_TOKEN); 
    await API.refreshAccessToken();   
    return router.handle(req, { ctx, API, cacheManager, env });
  }
};
