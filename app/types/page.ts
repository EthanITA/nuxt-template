import { type User } from "~~/server/database/schema";

type MiddlewareOptions = {
  enabled?: false | "force" | "default";
  roles?: User["role"][];
};

declare module "#app" {
  interface PageMeta {
    auth?: MiddlewareOptions;
  }
}

declare module "vue-router" {
  interface RouteMeta {
    auth?: MiddlewareOptions;
  }
}
