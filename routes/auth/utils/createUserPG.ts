import { postgresClientHashes } from "../../../pg/client";
import type { User } from "../model/user";
import { v4 as uuidv4 } from "uuid";

type PartialUser = Omit<User, "id" | "created_at">;
export const createUserPG = async (
  user: PartialUser
): Promise<{ message: string; status: "ok"; user: User }> => {
  try {
    const id = uuidv4();
    const res = await postgresClientHashes.query(
      `INSERT INTO HASHES(username, password, id) VALUES($1, $2, $3) RETURNING *`,
      [user.username, user.password, id]
    );

    return { message: "user created", status: "ok", user: res.rows[0] as User };
  } catch (error) {
    console.log(error);
    throw new Error("Error creating user");
  }
};
