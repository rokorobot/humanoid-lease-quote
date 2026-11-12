// Prisma CLI config. DATABASE_URL comes from the environment; this template loads no .env file.
import { defineConfig } from "prisma/config";

const url = process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // `prisma generate` needs no database, so the URL is optional here.
  ...(url ? { datasource: { url } } : {}),
});
