import { use } from "hono/jsx";
import { postgresClientHashes } from "../../../pg/client";
import type { User } from "../model/user";

export const getUserPG = async ({
  username,
}: {
  username: string;
}): Promise<User> => {
  try {
    const response = await postgresClientHashes.query(
      `SELECT * FROM HASHES WHERE username = $1 `,
      [username]
    );
    return response.rows[0];
  } catch (error) {
    console.log(error);
    throw new Error("Could not get user");
  }
};
