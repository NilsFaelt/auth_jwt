import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { PartialUserSchema } from "./model/user";
import { HTTPException } from "hono/http-exception";
import { getUserPG } from "./utils/getUser";
import { generateAccessJWT } from "./utils/generateAccessJWT";
import { setCookie } from "hono/cookie";
import bcrypt from "bcrypt";

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
    if (accessToken.success === "fail" || !accessToken.token) {
      return c.json({ message: "error creating token" }, 500);
    }
    //MAKE SIGNED COOKIE AFTER DEV
    setCookie(c, "token", accessToken.token, {
      path: "/",
      secure: true,
      domain: "localhost",
      httpOnly: true,
      maxAge: 3600,
      sameSite: "lax",
    });

    return c.json({ status: "ok", user });
  }
);
export default app;
