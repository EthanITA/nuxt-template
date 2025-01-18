import * as schema from "../database/schema";
import * as methods from "../database/methods";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import env from "./env";

export const tables = schema;

const url = env.DATABASE_URL;

export const db = drizzle(postgres(url), { schema, casing: "camelCase" });

export const dbMethods = methods;
