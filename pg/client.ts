import PG from "pg";

export const postgresClientHashes = new PG.Client({
  port: 5432,
  host: "localhost",
  user: "admin",
  password: "password",
  database: "hashes",
});

await postgresClientHashes.connect();
