export {};

declare global {
  interface InstagramUserFeed {
    username: string;
    permalink: string;
    timestamp: string;
    caption: string;
    id: string;
  }
}
