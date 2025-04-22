import { sign } from "hono/jwt";
import { v4 as uuidv4 } from "uuid";
import { storeRefreshTokenPG } from "./storeRefreshTokenPG";

export const generateRefreshJWT = async ({
  id,
}: {
  id: string;
}): Promise<{ success: "ok"; token: string }> => {
  console.log(id, " SUB ID");
  try {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365;
    const jti = uuidv4();
    const payload = {
      sub: id,
      exp,
      jti,
    };
    const token = await sign(payload, process.env.REFRESH_TOKEN_KEY!);
    await storeRefreshTokenPG({ id, exp, jti });
    return { success: "ok", token: token };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to generate refresh token");
  }
};
