import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { PartialUserSchema } from "./model/user";
import { HTTPException } from "hono/http-exception";
import { getUserPGVulnerable } from "./utils/getUserPG";
import { generateAccessJWT } from "./utils/generateAccessJWT";

import { generateRefreshJWT } from "./utils/generateRefreshJWT";
import bcrypt from "bcrypt";
import { setTokensCookie } from "./utils/setTokensCookie";

const app = new Hono();

app.post(
  "/vulnerable",
  zValidator("json", PartialUserSchema, (data) => {
    if (!data.success) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }
  }),
  async (c) => {
    const body = c.req.valid("json");
    const username = body.username;

    const user = await getUserPGVulnerable({ username });

    return c.json({ status: "ok", user });
  }
);
export default app;
