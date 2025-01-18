import { sql } from "drizzle-orm";

export const arrayAppend = (column: string, value: string) => {
  return sql`array_append
        (${sql.identifier(column)}, ${value}::jsonb)`;
};

export const now = () => sql`now()`;

export const coalesce = <T, F = unknown, S = unknown>(col1: F, col2: S) =>
  sql<T & (F | S)>`coalesce(${col1}, ${col2})`;
