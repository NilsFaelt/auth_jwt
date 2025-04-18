import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { UserSchema } from "./model/user";
import { HTTPException } from "hono/http-exception";
import { hashMe } from "../../utils/hashMe";
import { createUserPG } from "./utils/createUserPG";

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
    return c.json(res);
  }
);
export default app;
