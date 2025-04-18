import { postgresClientHashes } from "./client";

const createHashesTable = async () => {
  try {
    await postgresClientHashes.query(
      "CREATE TABLE IF NOT EXISTS HASHES (username TEXT PRIMARY KEY UNIQUE, password TEXT NOT NULL,created_at TIMESTAMP DEFAULT now())"
    );
    console.log("table hashes created");
  } catch (error) {
    console.log(error);
  }
};

await createHashesTable();
