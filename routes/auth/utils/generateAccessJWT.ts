import type { User } from "../model/user";
import { sign } from "hono/jwt";

export const generateAccessJWT = async (
  userName: string
): Promise<{ success: "ok" | "fail"; token: string | undefined }> => {
  try {
    const payload = {
      name: userName,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    const signedJWT = await sign(payload, process.env.ACCESSTOKEN_KEY!);
    return { success: "ok", token: signedJWT };
  } catch (error) {
    console.log(error);
    return { success: "fail", token: undefined };
  }
};
