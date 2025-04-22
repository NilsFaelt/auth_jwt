import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { PartialUserSchema } from "./model/user";
import { HTTPException } from "hono/http-exception";
import { getUserPG } from "./utils/getUserPG";
import { generateAccessJWT } from "./utils/generateAccessJWT";
import { setCookie } from "hono/cookie";
import { generateRefreshJWT } from "./utils/generateRefreshJWT";
import bcrypt from "bcrypt";
import { setTokensCookie } from "./utils/setTokensCookie";

const app = new Hono();

app.post(
  "/login",
  zValidator("json", PartialUserSchema, (data) => {
    if (!data.success) {
      console.log(data.data);
      throw new HTTPException(401, { message: "Unauthorized" });
    }
  }),
  async (c) => {
    const body = c.req.valid("json");
    const username = body.username;

    const user = await getUserPG({ username });
    if (!user) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const isValid = await bcrypt.compare(body.password, user.password);
    if (!isValid) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const accessToken = await generateAccessJWT({ username, id: user.id });
    const refreshToken = await generateRefreshJWT({ id: user.id });

    if (accessToken.success !== "ok" || !accessToken.token) {
      return c.json({ message: "error creating token" }, 500);
    }
    if (refreshToken.success !== "ok" || !accessToken.token) {
      return c.json({ message: "error creating token" }, 500);
    }
    await setTokensCookie({
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      c,
    });

    return c.json({ status: "ok", user });
  }
);
export default app;
