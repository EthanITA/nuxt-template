import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  updatedAt: timestamp({ mode: "date" }).defaultNow(),
  createdAt: timestamp({ mode: "date" }).defaultNow().notNull(),
  deletedAt: timestamp({ mode: "date" }),
};
