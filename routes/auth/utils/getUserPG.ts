import { postgresClientHashes } from "../../../pg/client";
import type { User } from "../model/user";

export const getUserPG = async ({
  username,
}: {
  username: string;
}): Promise<User & { id: number }> => {
  try {
    const response = await postgresClientHashes.query(
      `SELECT * FROM HASHES WHERE username = $1 `,
      [username]
    );
    console.log(response.rows[0]);
    return response.rows[0];
  } catch (error) {
    console.log(error);
    throw new Error("Could not get user");
  }
};
