import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("4000").transform(Number),
  CLIENT_ORIGIN: z.string().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const config = envSchema.parse(process.env);
