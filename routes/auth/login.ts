import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { UserSchema } from "./model/user";
import { HTTPException } from "hono/http-exception";
import { getUserPG } from "./utils/getUser";
import bcrypt from "bcrypt";

const app = new Hono();

app.post(
  "/login",
  zValidator("json", UserSchema, (data) => {
    if (!data.success) {
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

    return c.json({ status: "ok", user });
  }
);
export default app;
