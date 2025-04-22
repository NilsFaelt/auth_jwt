import PG from "pg";

//TODO MAKE POOL

export const postgresClientHashes = new PG.Client({
  port: 5432,
  host: "localhost",
  user: "admin",
  password: "password",
  database: "hashes",
});
export const postgresClientTokens = new PG.Client({
  port: 5433,
  host: "localhost",
  user: "admin",
  password: "password",
  database: "tokens",
});

try {
  await postgresClientTokens.connect();
} catch (error) {
  console.log("Error connecting to postgresClientTokens", error);
}
try {
  await postgresClientHashes.connect();
} catch (error) {
  console.log("Error connecting to postgresClientHashes", error);
}
