import { z } from "zod";

export default z
  .object({
    DATABASE_URL: z.string(),
    NODE_ENV: z.enum(["development", "production"]).default("production"),
  })
  .passthrough()
  .parse(process.env);
