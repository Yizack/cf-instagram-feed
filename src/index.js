import InstagramFeed from "./InstagramFeed.js";

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

async function handleRequest(req, ctx, API) {
  const cacheUrl = new URL(req.url);
  const cacheKey = new Request(cacheUrl.toString(), req);
  const cache = caches.default;
  let response = await cache.match(cacheKey);

  if (response) {
    console.log("Found in cache!");
    return response;
  }

  API.refreshAccessToken();
  const { data } = await API.getFeed();
  response = new JsonResponse({data});
  if (data) {
    console.log("Stored in cache!");
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
  }
  return response;
}

export default {
  async fetch(req, env, ctx) {
    const API = new InstagramFeed(env.ACCESS_TOKEN);    
    return await handleRequest(req, ctx, API);
  }
};
