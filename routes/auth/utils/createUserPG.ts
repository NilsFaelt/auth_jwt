import { postgresClientHashes } from "../../../pg/client";
import type { User } from "../model/user";

export const createUserPG = async (
  user: User
): Promise<{ message: string; status: "ok" | "fail" }> => {
  try {
    await postgresClientHashes.query(
      `INSERT INTO HASHES(username, password) VALUES($1, $2)`,
      [user.username, user.password]
    );
    return { message: "user created", status: "ok" };
  } catch (error) {
    console.log(error);
    return { message: "could not create user", status: "fail" };
  }
};
