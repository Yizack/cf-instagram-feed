
class InstagramFeed {
  api: string;
  access_token: string;
  constructor (access_token: string) {
    this.api = "https://graph.instagram.com";
    this.access_token = access_token;
  }

  async refreshAccessToken () {
    const response = await fetch(`${this.api}/refresh_access_token?grant_type=ig_refresh_token&access_token=${this.access_token}`);
    if (response.ok) {
      const { access_token } = await response.json();
      this.access_token = access_token;
    }
  }

  async getFeed () {
    const response = await fetch(`${this.api}/me/media?fields=username,permalink,timestamp,caption&access_token=${this.access_token}`);
    let res = {};
    if (response.ok) {
      res = response.json();
    }
    return res;
  }

}

export default InstagramFeed;
