import { Hono } from "hono";
import createUser from "./createUser";
import login from "./login";

const app = new Hono();
app.route("/", createUser);
app.route("/", login);

export default app;
