export default defineCachedEventHandler(async (event) => {
  const { accessToken } = useRuntimeConfig(event);
  const API = new InstagramFeed(accessToken);
  await API.refreshAccessToken();
  const data = await API.getFeed();

  setResponseHeader(event, "Access-Control-Allow-Origin", "*");
  return { data };
}, { maxAge: 86400 });
