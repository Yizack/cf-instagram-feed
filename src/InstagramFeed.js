class InstagramFeed {

  constructor(access_token) {
    this.api = "https://graph.instagram.com";
    this.access_token = access_token;
  }

  async refreshAccessToken() {
    const response = await fetch(`${this.api}/refresh_access_token?grant_type=ig_refresh_token&access_token=${this.access_token}`);
    const { access_token } = await response.json();
    this.access_token = access_token;
  }

  async getFeed() {
    const response = await fetch(`${this.api}/me/media?fields=username,permalink,timestamp,caption&access_token=${this.access_token}`);
    return response.json();
  }

}

export default InstagramFeed;
