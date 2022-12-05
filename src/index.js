import InstagramFeed from "./InstagramFeed.js";

class JsonResponse extends Response {
  constructor(body, domain) {
    const jsonBody = JSON.stringify(body);
    const options = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": domain,
        "Set-Cookie": "refreshed=true; Max-Age=86400; SameSite=None; Secure; HttpOnly"
      }
    };
    super(jsonBody, options);
  }
}

async function handleRequest(API, env, refreshed) {
  const { data } = await API.getFeed();
  return new JsonResponse({refreshed, data}, env.DOMAIN);
}

export default {
  async fetch(req, env) {
    const API = new InstagramFeed(env.ACCESS_TOKEN);
    const { headers } = req;
    const cookies = headers.get("Cookie") || "";
    const refreshed = cookies.includes("refreshed=true");

    if (!refreshed) {
      API.refreshAccessToken();
    }
    
    return await handleRequest(API, env, refreshed);
  }
};
