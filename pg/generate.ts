import { postgresClientHashes, postgresClientTokens } from "./client";

const createHashesTable = async () => {
  try {
    await postgresClientHashes.query(
      "CREATE TABLE IF NOT EXISTS HASHES (username TEXT PRIMARY KEY UNIQUE, password TEXT NOT NULL,created_at TIMESTAMP DEFAULT now(), id TEXT UNIQUE NOT NULL)"
    );
    console.log("table hashes created");
  } catch (error) {
    console.log(error);
  }
};
const createTokenTable = async () => {
  try {
    await postgresClientTokens.query(
      "CREATE TABLE IF NOT EXISTS TOKENS (sub TEXT PRIMARY KEY NOT NULL, exp BIGINT NOT NULL, jti TEXT UNIQUE NOT NULL, revoked BOOLEAN DEFAULT false)"
    );
    console.log("table tokens created");
  } catch (error) {
    console.log(error);
  }
};

await createTokenTable().catch((err) => {
  console.log(err);
});
await createHashesTable().catch((err) => {
  console.log(err);
});
