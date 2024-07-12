import type { CacheStorage as CloudflareCacheStorage, ExecutionContext, RequestInfo } from "@cloudflare/workers-types";
import type InstagramFeed from "../src/InstagramFeed";

export {};

declare global {

  interface Env {
    ACCESS_TOKEN: string;
  }

  interface CacheStorage extends CloudflareCacheStorage {
    default: Cache;
  }

  type ExportedHandlerFetchHandler = (req: Request, env: Env, ctx: ExecutionContext) => Promise<Response>;

  interface FetchHandler {
    fetch?: ExportedHandlerFetchHandler;
  }

  type RouterContext = { ctx: ExecutionContext, API: InstagramFeed, cacheManager: { cache: Cache, cacheKey: Request } };
}
