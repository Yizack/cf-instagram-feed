import { $fetch } from "ofetch";

export class InstagramFeed {
  api: string;
  accessToken: string;
  constructor (accessToken: string) {
    this.api = "https://graph.instagram.com";
    this.accessToken = accessToken;
  }

  async refreshAccessToken () {
    const response = await $fetch(`${this.api}/refresh_access_token?grant_type=ig_refresh_token&access_token=${this.accessToken}`).catch(() => {
      throw createError({ statusCode: 500, message: "Failed to refresh access token" });
    });
    return response;
  }

  async getFeed () {
    const response = await $fetch<{ data: InstagramUserFeed }>(`${this.api}/me/media?fields=username,permalink,timestamp,caption&access_token=${this.accessToken}`).catch(() => {
      throw createError({ statusCode: 500, message: "Failed to fetch instagram feed" });
    });
    return response.data;
  }

}
