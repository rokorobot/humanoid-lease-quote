import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const cache = globalThis as { prismaClient?: PrismaClient };

/** The one database client. Created on first use, so importing this file never needs a database. */
export function db(): PrismaClient {
  if (cache.prismaClient) return cache.prismaClient;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Export it before starting, e.g. postgresql://user@localhost:5432/app",
    );
  }
  cache.prismaClient = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
  return cache.prismaClient;
}
