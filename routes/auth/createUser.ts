import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { UserSchema } from "./model/user";
import { HTTPException } from "hono/http-exception";
import { hashMe } from "../../utils/hashMe";
import { createUserPG } from "./utils/createUserPG";
import { setSignedCookie } from "hono/cookie";
import { generateAccessJWT } from "./utils/generateAccessJWT";
const app = new Hono();

app.post(
  "/create",
  zValidator("json", UserSchema, (data) => {
    if (!data.success) {
      throw new HTTPException(400, { message: "Wrong values in body" });
    }
  }),
  async (c) => {
    const body = c.req.valid("json");
    const username = body.username;
    const hashedPassword = await hashMe(body.password, 10);
    const res = await createUserPG({
      username,
      password: hashedPassword,
    });
    if (res.status === "fail") {
      return c.json({ message: "error creating user" }, 500);
    }

    const accessToken = await generateAccessJWT(username);
    if (accessToken.success === "fail" || !accessToken.token) {
      return c.json({ message: "error creating token" }, 500);
    }
    setSignedCookie(c, "token", accessToken.token, process.env.COOKIE_SECRET!, {
      path: "/",
      secure: true,
      domain: "localhost",
      httpOnly: true,
      maxAge: 3600,
      sameSite: "lax",
    });
    return c.json(res);
  }
);
export default app;
