import { defineEventHandler, type H3Event } from "h3";
import InstagramFeed from "../InstagramFeed";

export default defineEventHandler(async (event: H3Event) => {
  const API = new InstagramFeed(event.context.cloudflare.env.ACCESS_TOKEN);
  await API.refreshAccessToken();
  const data = await API.getFeed();
  return { data };
});
