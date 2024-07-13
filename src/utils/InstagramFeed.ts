import { $fetch } from "ofetch";

class InstagramFeed {
  api: string;
  access_token: string;
  constructor (access_token: string) {
    this.api = "https://graph.instagram.com";
    this.access_token = access_token;
  }

  async refreshAccessToken () {
    const response = await $fetch(`${this.api}/refresh_access_token?grant_type=ig_refresh_token&access_token=${this.access_token}`).catch(() => null);
    if (!response) throw new Error("Failed to refresh access token.");
    return response;
  }

  async getFeed () {
    const response = await $fetch<{ data: any }>(`${this.api}/me/media?fields=username,permalink,timestamp,caption&access_token=${this.access_token}`).catch(() => null);
    if (!response) throw new Error("Failed to fetch instagram feed.");
    return response.data;
  }

}

export default InstagramFeed;
