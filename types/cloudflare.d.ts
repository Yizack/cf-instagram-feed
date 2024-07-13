import type { CfProperties, ExecutionContext, R2Bucket, D1Database } from "@cloudflare/workers-types";

export {};

declare module "h3" {
  interface H3EventContext {
    cf: CfProperties;
    cloudflare: {
      request: Request;
      env: {
        ACCESS_TOKEN: string;
      };
      context: ExecutionContext;
    };
  }
}

declare global {

  type Env = Record<string, string | undefined>;

  interface CacheStorage extends CloudflareCacheStorage {
    default: Cache;
  }

  type ExportedHandlerFetchHandler = (req: Request, env: Env, ctx: ExecutionContext) => Promise<Response>;

  interface FetchHandler {
    fetch?: ExportedHandlerFetchHandler;
  }
}
