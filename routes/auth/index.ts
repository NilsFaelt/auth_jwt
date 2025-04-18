import { Hono } from "hono";
import createUser from "./createUser";

const app = new Hono();
app.route("/", createUser);

export default app;
