import { sign } from "hono/jwt";

export const generateAccessJWT = async ({
  username,
  id,
}: {
  username: string;
  id: string;
}): Promise<{ success: "ok" | "fail"; token: string | undefined }> => {
  try {
    const payload = {
      name: username,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      sub: id,
    };

    const signedJWT = await sign(payload, process.env.ACCESS_TOKEN_KEY!);
    return { success: "ok", token: signedJWT };
  } catch (error) {
    console.log(error);
    return { success: "fail", token: undefined };
  }
};
