import type { Context } from "hono";
import { setCookie } from "hono/cookie";

export const setTokensCookie = ({
  accessToken,
  refreshToken,
  c,
}: {
  accessToken: string;
  refreshToken: string;
  c: Context;
}) => {
  setCookie(c, "token", accessToken, {
    path: "/",
    secure: true,
    domain: "localhost",
    httpOnly: true,
    maxAge: 3600,
    sameSite: "lax",
  });
  setCookie(c, "refresh_token", refreshToken, {
    path: "/",
    secure: true,
    domain: "localhost",
    httpOnly: true,
    maxAge: 3600,
    sameSite: "lax",
  });
};
