import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
const app = new Hono();

app.get("/", async (c) => {
  const accessToken = await getCookie(c, "token");
  try {
    const decryptedToken = await verify(
      accessToken!,
      process.env.ACCESS_TOKEN_KEY!
    );
    if (!decryptedToken || !decryptedToken.exp)
      return c.json({ status: "Unauthorized" }, 500);

    return c.json({ value: "super secret value" });
  } catch (error: any) {
    console.error(error);
    if (error.name === "JwtTokenExpired") {
      return c.json({ status: "Token expired" }, 401);
    }

    return c.json({ status: "Unauthorized - Token verification failed" }, 401);
  }
});

export default app;
