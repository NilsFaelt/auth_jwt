import { Hono } from "hono";
import createUser from "./createUser";
import login from "./login";
import vulnerable from "./vulnerable";

const app = new Hono();
app.route("/", createUser);
app.route("/", login);
app.route("/", vulnerable);

export default app;
