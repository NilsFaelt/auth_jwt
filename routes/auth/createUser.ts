import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { PartialUserSchema } from "./model/user";
import { HTTPException } from "hono/http-exception";
import { hashMe } from "../../utils/hashMe";
import { createUserPG } from "./utils/createUserPG";
import { generateAccessJWT } from "./utils/generateAccessJWT";
import { generateRefreshJWT } from "./utils/generateRefreshJWT";
import { setTokensCookie } from "./utils/setTokensCookie";

const app = new Hono();

app.post(
  "/create",
  zValidator("json", PartialUserSchema, (data) => {
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
    if (res.status !== "ok") {
      return c.json({ message: "error creating user" }, 500);
    }

    const accessToken = await generateAccessJWT({ username, id: res.user.id });
    const refreshToken = await generateRefreshJWT({ id: res.user.id });
    if (accessToken.success === "fail" || !accessToken.token) {
      return c.json({ message: "error creating token" }, 500);
    }
    await setTokensCookie({
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      c,
    });
    return c.json(res);
  }
);
export default app;
