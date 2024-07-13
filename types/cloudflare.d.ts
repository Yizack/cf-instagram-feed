import type { CfProperties, ExecutionContext } from "@cloudflare/workers-types";

export {};

declare module "h3" {
  interface H3EventContext {
    cf: CfProperties;
    cloudflare: {
      request: Request;
      env: {
        NITRO_ACCESS_TOKEN: string;
      };
      context: ExecutionContext;
    };
  }
}
